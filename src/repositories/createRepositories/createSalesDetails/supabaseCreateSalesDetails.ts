import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../database/supabase';
import { 
    ICreateSaleRepository, 
    CreateSaleParams, 
    Sale 
} from '../../../controllers/createControllers/createSalesDetails/protocol';

export class SupabaseCreateSaleRepository implements ICreateSaleRepository {
    private db: SupabaseClient = supabase;

    async createSaleTransaction(params: CreateSaleParams): Promise<Sale> {
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
                throw new Error(`Unidade de estoque ID ${item.stock_unit_id} não encontrada.`);
            }

            if (!stockUnit.is_available) {
                throw new Error(`Item ID ${item.stock_unit_id} já foi vendido ou não está disponível.`);
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
            console.error('Erro ao criar venda:', saleError);
            throw new Error(`Erro ao registrar venda no banco de dados.`);
        }

        const newSale = saleData as Sale;

        // PASSO 3: Criar detalhes da Venda (SALE_DETAILS)
        // Adiciona o sale_id gerado aos detalhes
        const detailsWithSaleId = saleDetailsPayload.map(detail => ({
            ...detail,
            sale_id: newSale.sale_id
        }));

        const { error: detailsError } = await this.db
            .from('sale_details')
            .insert(detailsWithSaleId);

        if (detailsError) {
            console.error('Erro ao inserir detalhes:', detailsError);
            // Nota: Em um cenário ideal, deveríamos reverter a venda aqui (rollback)
            throw new Error('Erro ao registrar os itens da venda.');
        }

        // PASSO 4: Baixa no Estoque (STOCK_UNITS)
        const { error: updateError } = await this.db
            .from('stock_units')
            .update({ 
                is_available: false, 
                sold_at: new Date().toISOString() 
            })
            .in('stock_unit_id', stockUnitsToUpdate);

        if (updateError) {
            console.error('Erro na baixa de estoque:', updateError);
            throw new Error('Venda registrada, mas houve erro ao dar baixa no estoque.');
        }

        return newSale;
    }
}