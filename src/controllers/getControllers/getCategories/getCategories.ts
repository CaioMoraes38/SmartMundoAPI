import { HttpResponse } from "../../generalProtocols";
import { Category } from "../../../models/category";
import { IGetCategoriesController, IGetCategoriesRepository } from "./protocol";

export class GetCategoriesController implements IGetCategoriesController {
    constructor(private readonly getCategoriesRepository: IGetCategoriesRepository) {}

    async handle(): Promise<HttpResponse<Category[]>> {
        try {
            const categories = await this.getCategoriesRepository.getCategories();

            return {
                statusCode: 200, 
                body: categories,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE LISTAGEM DE CATEGORIA:", error);

            return {
                statusCode: 500,
                body: "Erro interno do servidor ao listar categorias: " + error.message,
            };
        }
    }
}