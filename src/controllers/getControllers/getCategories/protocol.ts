import { Category } from "../../../models/category";
import { HttpResponse } from "../../generalProtocols";

export interface IGetCategoriesController {
    handle(): Promise<HttpResponse<Category[]>>;
}


export interface IGetCategoriesRepository {
    getCategories(): Promise<Category[]>;
}