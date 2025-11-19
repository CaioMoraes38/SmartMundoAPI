import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../database/supabase';
import { Sale, CreateSalePayload } from '../../../models/sales';
import { ICreateSaleRepository } from '../../../controllers/createControllers/createSales/protocol';
import { StockUnit } from '../../../models/stockUnit';


export class SaleRepository implements ICreateSaleRepository {
    private db: SupabaseClient = supabase;

    
    async createSaleTransaction(params: CreateSalePayload): Promise<Sale> {
        let totalAmount = 0;
        const saleDetailsPayload: any[] = [];
        const stockUnitsToUpdate: string[] = [];

        for (const item of params.items) {
            const { data: stockUnit, error: unitError } = await this.db
                .from('stock_units')
                .select('cost_price, is_available')
                .eq('stock_unit_id', item.stock_unit_id)
                .single();

            if (unitError || !stockUnit) {
                throw new Error(`Unidade de estoque ID ${item.stock_unit_id} não encontrada ou erro de busca.`);
            }

            if (!stockUnit.is_available) {
                throw new Error(`Unidade de estoque ID ${item.stock_unit_id} não está disponível para venda.`);
            }
            
            if (item.selling_price <= 0) {
                 throw new Error(`Preço de venda inválido para o item ID ${item.stock_unit_id}.`);
            }

            totalAmount += item.selling_price;
            stockUnitsToUpdate.push(item.stock_unit_id);

            saleDetailsPayload.push({
                stock_unit_id: item.stock_unit_id,
                selling_price: item.selling_price,
                cost_price: stockUnit.cost_price,
            });
        }

        const finalAmount = totalAmount * (1 - (params.discount_applied || 0) / 100);

        const { data: saleData, error: saleError } = await this.db
            .from('sales')
            .insert({
                store_id: params.store_id,
                total_amount: finalAmount,
                discount_applied: params.discount_applied || 0,
            })
            .select()
            .single();

        if (saleError || !saleData) {
            console.error('Erro ao criar cabeçalho da venda:', saleError);
            throw new Error(`Erro ao finalizar a transação de venda.`);
        }

        const newSale = saleData as Sale;
        const saleId = newSale.sale_id;

        const saleDetailsWithId = saleDetailsPayload.map(detail => ({ ...detail, sale_id: saleId }));

        const { error: detailsError } = await this.db
            .from('sale_details')
            .insert(saleDetailsWithId);

        if (detailsError) {
            console.error('Erro ao criar detalhes da venda:', detailsError);
            throw new Error('Erro ao registrar detalhes da venda, a venda pode estar incompleta.');
        }

        const { error: updateError } = await this.db
            .from('stock_units')
            .update({ 
                is_available: false, 
                sold_at: new Date().toISOString() 
            })
            .in('stock_unit_id', stockUnitsToUpdate);

        if (updateError) {
            console.error('Erro ao dar baixa no estoque:', updateError);
            throw new Error('Venda registrada, mas a baixa no estoque falhou.');
        }

        return newSale;
    }
}