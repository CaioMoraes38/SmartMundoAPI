
export interface Sale {
    sale_id: string;
    store_id: string;
    sale_date: string;
    total_amount: number;
    discount_applied: number;
}


export interface SaleDetail {
    sale_detail_id: string;
    sale_id: string;
    stock_unit_id: string; 
    selling_price: number; 
    cost_price: number;    
    profit: number;        
}


export interface CreateSalePayload {
    store_id: string;
    discount_applied?: number;
    items: Array<{
        stock_unit_id: string; 
        selling_price: number; 
    }>;
}