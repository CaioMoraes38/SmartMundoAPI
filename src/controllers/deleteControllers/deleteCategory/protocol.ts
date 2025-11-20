import { HttpRequest, HttpResponse } from "../../generalProtocols";

export interface IDeleteCategoryController {
    
    handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<string>>;
}

export interface IDeleteCategoryRepository {
    /**
     * @param id ID da categoria a ser apagada.
     */
    deleteCategory(id: number): Promise<void>;
}