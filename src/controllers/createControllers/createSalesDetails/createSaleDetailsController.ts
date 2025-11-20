import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { 
    ICreateSaleController, 
    ICreateSaleRepository, 
    CreateSaleParams, 
    Sale 
} from "./protocol";

export class CreateSaleController implements ICreateSaleController {
    constructor(private readonly createSaleRepository: ICreateSaleRepository) {}

    async handle(
        httpRequest: HttpRequest<CreateSaleParams>
    ): Promise<HttpResponse<Sale>> {
        try {
            const payload = httpRequest.body;

            // Validações Básicas
            if (!payload || !payload.store_id || !payload.items || payload.items.length === 0) {
                return {
                    statusCode: 400,
                    body: "É necessário informar a loja (store_id) e pelo menos um item para venda.",
                };
            }

            // Valida estrutura dos itens
            for (const item of payload.items) {
                if (!item.stock_unit_id || item.selling_price <= 0) {
                    return {
                        statusCode: 400,
                        body: "Cada item deve ter um stock_unit_id válido e preço maior que zero.",
                    };
                }
            }

            // Executa a transação
            const sale = await this.createSaleRepository.createSaleTransaction(payload);

            return {
                statusCode: 201, // Created
                body: sale,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE VENDA:", error);
            
            return {
                statusCode: 500,
                body: "Falha ao processar venda: " + error.message,
            };
        }
    }
}