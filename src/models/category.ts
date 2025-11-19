
export interface Category {
    category_id: string; 
    name: string;        
    description: string | null; 
}


export interface CreateCategoryPayload {
    name: string;
    description?: string | null;
}