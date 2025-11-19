import { HttpRequest, HttpResponse } from "../../../controllers/generalProtocols";
import { StockUnit } from "../../../models/stockUnit";
import { CreateStockUnitParams, ICreateStockUnitController, ICreateStockUnitRepository, item_status } from "./protocol";

const VALID_STATUSES: item_status[] = ['novo', 'usado', 'recondicionado', 'defeito'];

export class CreateStockUnitController implements ICreateStockUnitController {
    constructor(private readonly createStockUnitRepository: ICreateStockUnitRepository) {}

    async handle(
        httpRequest: HttpRequest<CreateStockUnitParams>
    ): Promise<HttpResponse<StockUnit>> {
        try {
            const payload = httpRequest.body;

            if (!payload || !payload.product_id || !payload.store_id || typeof payload.cost_price !== 'number' || !payload.status) {
                return {
                    statusCode: 400,
                    body: "Campos obrigatórios ausentes: product_id, store_id, cost_price e status.",
                };
            }
            
            if (!VALID_STATUSES.includes(payload.status)) {
                return {
                    statusCode: 400,
                    body: `O estado do item deve ser um dos seguintes: ${VALID_STATUSES.join(', ')}.`,
                };
            }

            const newStockUnit = await this.createStockUnitRepository.createStockUnit(payload);

            return {
                statusCode: 201, 
                body: newStockUnit,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE UNIDADE DE ESTOQUE:", error);

            return {
                statusCode: 500,
                body: "Algo deu errado ao registrar a entrada do item: " + error.message,
            };
        }
    }
}