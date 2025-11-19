import { item_status } from "../controllers/createControllers/createStockUnit/protocol";


export interface StockUnit {
    stock_unit_id: string; 
    product_id: string;   
    store_id: string;      
    cost_price: number;    
    status: item_status;  
    is_available: boolean; 
    entry_date: string;    
    sold_at: string | null; 
}

export interface CreateStockUnitPayload {
    product_id: string;
    store_id: string;
    cost_price: number;
    status: item_status;
}