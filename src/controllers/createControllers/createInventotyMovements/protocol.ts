import { InventoryMovement, CreateMovementPayload } from "../../../models/InventoryMovement";
import { HttpRequest, HttpResponse } from "../../generalProtocols";


export type movement_type = 'entrada_inicial' | 'ajuste_positivo' | 'ajuste_negativo' | 'perda' | 'dano';


export type CreateMovementParams = CreateMovementPayload; 

export interface ICreateMovementController {
    handle(httpRequest: HttpRequest<CreateMovementParams>): Promise<HttpResponse<InventoryMovement>>;
}

export interface ICreateMovementRepository {
    createMovement(params: CreateMovementParams): Promise<InventoryMovement>;
}