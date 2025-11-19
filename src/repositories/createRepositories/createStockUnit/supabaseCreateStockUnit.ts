import { SupabaseClient } from '@supabase/supabase-js';
import { StockUnit } from '../../../models/stockUnit';
import { CreateStockUnitParams, ICreateStockUnitRepository } from '../../../controllers/createControllers/createStockUnit/protocol';
import { supabase } from '../../../database/supabase';

export class StockUnitsRepository implements ICreateStockUnitRepository {
    private db: SupabaseClient = supabase; 

    async createStockUnit(params: CreateStockUnitParams): Promise<StockUnit> {
        const { data, error } = await this.db
            .from('stock_units')
            .insert(params)
            .select()
            .single();

        if (error) {
            console.error('Erro ao inserir nova unidade em estoque:', error);
            throw new Error(`Erro de banco de dados ao criar unidade de estoque: ${error.message}`);
        }

        return data as StockUnit;
    }
}