import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { Sale } from "../../../models/sales";
import { CreateSaleParams, ICreateSaleController, ICreateSaleRepository } from "./protocol";

export class CreateSaleController implements ICreateSaleController {
    constructor(private readonly createSaleRepository: ICreateSaleRepository) {}

    async handle(
        httpRequest: HttpRequest<CreateSaleParams>
    ): Promise<HttpResponse<Sale>> {
        try {
            const payload = httpRequest.body;

            // Validação de campos obrigatórios
            if (!payload || !payload.store_id || !payload.items || payload.items.length === 0) {
                return {
                    statusCode: 400,
                    body: "Campos obrigatórios ausentes: store_id e pelo menos um item (items).",
                };
            }
            
            // Validação de itens
            for (const item of payload.items) {
                if (!item.stock_unit_id || typeof item.selling_price !== 'number' || item.selling_price <= 0) {
                    return {
                        statusCode: 400,
                        body: "Cada item deve ter um stock_unit_id válido e um selling_price positivo.",
                    };
                }
            }

            // Processa a transação de venda e baixa de estoque
            const newSale = await this.createSaleRepository.createSaleTransaction(payload);

            return {
                statusCode: 201, // Created
                body: newSale,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE VENDA:", error);
            
            // Retorna o erro específico do repositório
            if (error.message.includes('Unidade de estoque')) {
                return {
                    statusCode: 409, // Conflito de estoque
                    body: error.message,
                };
            }

            return {
                statusCode: 500,
                body: "Algo deu errado ao processar a venda: " + error.message,
            };
        }
    }
}