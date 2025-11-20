import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { IDeleteCategoryController, IDeleteCategoryRepository } from "./protocol";

export class DeleteCategoryController implements IDeleteCategoryController {
    constructor(private readonly deleteCategoryRepository: IDeleteCategoryRepository) {}

    async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<string>> {
        try {
            // O ID deve vir nos parâmetros da rota (ex: /categories/123)
            const id = httpRequest.params?.id;

            if (!id) {
                return {
                    statusCode: 400,
                    body: "O ID da categoria é obrigatório.",
                };
            }

            const idToDelete = Number(id);

            if (isNaN(idToDelete)) {
                return {
                    statusCode: 400,
                    body: "O ID fornecido não é válido.",
                };
            }

          
            await this.deleteCategoryRepository.deleteCategory(idToDelete);

            return {
                statusCode: 200,
                body: "Categoria excluída com sucesso.",
            };

        } catch (error: any) {
            console.error("ERRO AO DELETAR CATEGORIA:", error);
            if (error.message && error.message.includes("violates foreign key constraint")) {
                return {
                    statusCode: 409, 
                    body: "Não é possível excluir esta categoria porque existem produtos vinculados a ela.",
                };
            }

            return {
                statusCode: 500,
                body: "Erro interno do servidor ao tentar excluir a categoria: " + error.message,
            };
        }
    }
}