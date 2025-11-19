import { Category, CreateCategoryPayload } from "../../../models/category";
import { HttpRequest, HttpResponse } from "../../generalProtocols";


export type CreateCategoryParams = CreateCategoryPayload; 


export interface ICreateCategoryController {
    handle(httpRequest: HttpRequest<CreateCategoryParams>): Promise<HttpResponse<Category>>;
}


export interface ICreateCategoryRepository {
    createCategory(params: CreateCategoryParams): Promise<Category>;
}