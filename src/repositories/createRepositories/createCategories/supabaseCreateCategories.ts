import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../database/supabase';
import { Category } from '../../../models/category';
import { CreateCategoryParams, ICreateCategoryRepository } from '../../../controllers/createControllers/createCategories/protocol'

export class CategoryRepository implements ICreateCategoryRepository{
    private db: SupabaseClient = supabase;

   
    async createCategory(params: CreateCategoryParams): Promise<Category> {
        const { data, error } = await this.db
            .from('categories')
            .insert(params)
            .select()
            .single();

        if (error) {
            console.error('Erro ao inserir nova categoria:', error);
            if (error.code === '23505' && error.details.includes('name')) {
                 throw new Error("O nome desta categoria já existe.");
            }
            throw new Error(`Erro de banco de dados ao criar categoria: ${error.message}`);
        }

        return data as Category;
    }

    async getCategories(): Promise<Category[]> {
        const { data, error } = await this.db
            .from('categories')
            .select('*')
            .order('name', { ascending: true }); 

        if (error) {
            console.error('Erro ao buscar categorias:', error);
            throw new Error(`Erro de banco de dados ao listar categorias: ${error.message}`);
        }

        return (data as Category[]) || [];
    }
}