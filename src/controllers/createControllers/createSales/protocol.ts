import { Sale, SaleDetail, CreateSalePayload } from "../../../models/sales";
import { HttpRequest, HttpResponse } from "../../generalProtocols";



export type CreateSaleParams = CreateSalePayload; 


export interface ICreateSaleController {
    handle(httpRequest: HttpRequest<CreateSaleParams>): Promise<HttpResponse<Sale>>;
}

export interface ICreateSaleRepository {
    createSaleTransaction(params: CreateSaleParams): Promise<Sale>;
}

export { Sale };
