import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../database/supabase';
import { IDeleteCategoryRepository } from '../../controllers/deleteControllers/deleteCategory/protocol';

export class SupabaseDeleteCategoryRepository implements IDeleteCategoryRepository {
    [x: string]: any;
    private db: SupabaseClient = supabase;

    async deleteCategory(id: number): Promise<void> {
        const { error } = await this.db
            .from('categories')
            .delete()
            .eq('category_id', id);

        if (error) {
            console.error('Erro ao deletar categoria:', error);
            throw new Error(error.message);
        }
    }
}