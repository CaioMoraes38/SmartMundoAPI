import { SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../../../models/products';
import { CreateProductParams, ICreateProductRepository } from '../../../controllers/createControllers/createProducts/protocol';
import { supabase } from '../../../database/supabase'; 



export class SupabaseCreateProductRepository implements ICreateProductRepository {
    private db: SupabaseClient = supabase;

    async createProduct(params: CreateProductParams): Promise<Product> {
        const { data, error } = await this.db
            .from('products')
            .insert(params)
            .select()
            .single();

        if (error) {
            console.error('Erro ao inserir novo produto:', error);
            if (error.code === '23505' && error.details.includes('barcode')) {
                 throw new Error("O código de barras fornecido já está em uso.");
            }
            throw new Error(`Erro de banco de dados ao criar produto: ${error.message}`);
        }

        return data as Product;
    }
}