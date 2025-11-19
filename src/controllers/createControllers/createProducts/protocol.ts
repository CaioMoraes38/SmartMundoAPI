import { Product, CreateProductPayload } from "../../../models/products";
import { HttpRequest, HttpResponse } from "../../generalProtocols"; 

export type CreateProductParams = CreateProductPayload; 


export interface ICreateProductController {
    handle(httpRequest: HttpRequest<CreateProductParams>): Promise<HttpResponse<Product>>;
}

export interface ICreateProductRepository {
    createProduct(params: CreateProductParams): Promise<Product>;
}