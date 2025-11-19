import { StockUnit, CreateStockUnitPayload } from "../../../models/stockUnit";
import { HttpRequest, HttpResponse } from "../../generalProtocols";


export type item_status = 'novo' | 'usado' | 'recondicionado' | 'defeito';


export type CreateStockUnitParams = CreateStockUnitPayload;


export interface ICreateStockUnitController {
    handle(httpRequest: HttpRequest<CreateStockUnitParams>): Promise<HttpResponse<StockUnit>>;
}


export interface ICreateStockUnitRepository {
    createStockUnit(params: CreateStockUnitParams): Promise<StockUnit>;
}