import { movement_type } from "../controllers/createControllers/createInventotyMovements/protocol";


export interface InventoryMovement {
    movement_id: string;
    stock_unit_id: string;
    store_id: string;
    type: movement_type; 
    movement_date: string;
    notes: string | null;
}



export interface CreateMovementPayload {
    stock_unit_id: string;
    store_id: string;
    type: movement_type;
    notes?: string | null;
}