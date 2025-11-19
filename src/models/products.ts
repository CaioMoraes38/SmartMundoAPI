
export interface Product {
    product_id: string; 
    name: string;
    suggested_price: number; 
    min_price: number;       
    barcode: string | null;  
    description: string | null;
    image_url: string | null;  
    category_id: number;
    created_at: string; 
}


export interface CreateProductPayload {
    name: string;
    suggested_price: number;
    min_price: number;
    category_id: number;
    barcode?: string;
    description?: string;
    image_url?: string;
}