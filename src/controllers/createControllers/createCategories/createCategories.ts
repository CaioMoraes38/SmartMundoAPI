import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { Category } from "../../../models/category";
import { CreateCategoryParams, ICreateCategoryController, ICreateCategoryRepository } from "./protocol";

export class CreateCategoryController implements ICreateCategoryController {
    constructor(private readonly createCategoryRepository: ICreateCategoryRepository) {}

    async handle(
        httpRequest: HttpRequest<CreateCategoryParams>
    ): Promise<HttpResponse<Category>> {
        try {
            const payload = httpRequest.body;

            if (!payload || !payload.name) {
                return {
                    statusCode: 400,
                    body: "O campo 'name' da categoria é obrigatório.",
                };
            }
            
            const newCategory = await this.createCategoryRepository.createCategory({
                name: payload.name,
                description: payload.description || null,
            });

            return {
                statusCode: 201, 
                body: newCategory,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE CRIAÇÃO DE CATEGORIA:", error);

            if (error.message.includes("O nome desta categoria já existe")) {
                return {
                    statusCode: 409, 
                    body: error.message,
                };
            }

            return {
                statusCode: 500,
                body: "Erro interno do servidor ao criar categoria: " + error.message,
            };
        }
    }
}