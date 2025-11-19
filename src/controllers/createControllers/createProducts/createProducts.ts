import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { Product } from "../../../models/products";
import { CreateProductParams, ICreateProductController, ICreateProductRepository } from "./protocol";

export class CreateProductController implements ICreateProductController {
    // Injeção de dependência do repositório
    constructor(private readonly createProductRepository: ICreateProductRepository) {}

    async handle(
        httpRequest: HttpRequest<CreateProductParams>
    ): Promise<HttpResponse<Product>> {
        try {
            const payload = httpRequest.body;

            // Validação de campos obrigatórios
            if (!payload || !payload.name || typeof payload.suggested_price !== 'number' || typeof payload.min_price !== 'number' || !payload.category_id) {
                return {
                    statusCode: 400,
                    body: "Campos obrigatórios ausentes: nome, suggested_price, min_price e category_id.",
                };
            }

            // Cria a ficha mestra do produto no banco
            const newProduct = await this.createProductRepository.createProduct(payload);

            return {
                statusCode: 201, // Created
                body: newProduct,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE PRODUTO:", error);

            // Tenta retornar erros específicos, como duplicidade de código de barras
            if (error.message.includes("barcode")) {
                return {
                    statusCode: 409, // Conflict
                    body: "O código de barras fornecido já está em uso.",
                };
            }

            return {
                statusCode: 500,
                body: "Algo deu errado no servidor ao criar o produto: " + error.message,
            };
        }
    }
}