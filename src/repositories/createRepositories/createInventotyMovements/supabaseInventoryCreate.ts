import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../database/supabase';
import { InventoryMovement } from '../../../models/InventoryMovement';
import { ICreateMovementRepository, CreateMovementParams } from '../../../controllers/createControllers/createInventotyMovements/protocol'; // <--- CORREÇÃO AQUI


export class InventoryMovementRepository implements ICreateMovementRepository {
    private db: SupabaseClient = supabase;

    /**
     * @param params 
     * @returns
     */
    async createMovement(params: CreateMovementParams): Promise<InventoryMovement> {
        
        const { data, error } = await this.db
            .from('inventory_movements')
            .insert(params)
            .select()
            .single();

        if (error) {
            console.error('Erro ao registrar movimentação de estoque:', error);
            throw new Error(`Erro de banco de dados ao criar movimento: ${error.message}`);
        }

        const newMovement = data as InventoryMovement;

      
        if (newMovement.type === 'perda' || newMovement.type === 'dano') {
            
            const { error: updateError } = await this.db
                .from('stock_units')
                .update({ 
                    is_available: false, 
                    sold_at: new Date().toISOString() 
                })
                .eq('stock_unit_id', newMovement.stock_unit_id);

            if (updateError) {
                console.error('Alerta: Falha ao atualizar status da unidade em estoque após movimento:', updateError);
                
            }
        }
        
        return newMovement;
    }
}