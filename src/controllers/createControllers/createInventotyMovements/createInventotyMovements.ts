import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { InventoryMovement } from "../../../models/InventoryMovement";
import { CreateMovementParams, ICreateMovementController, ICreateMovementRepository, movement_type } from "./protocol";

const VALID_MOVEMENT_TYPES: movement_type[] = ['entrada_inicial', 'ajuste_positivo', 'ajuste_negativo', 'perda', 'dano'];

export class CreateMovementController implements ICreateMovementController {
    constructor(private readonly createMovementRepository: ICreateMovementRepository) {}

    async handle(
        httpRequest: HttpRequest<CreateMovementParams>
    ): Promise<HttpResponse<InventoryMovement>> {
        try {
            const payload = httpRequest.body;

            // Validação de campos obrigatórios
            if (!payload || !payload.stock_unit_id || !payload.store_id || !payload.type) {
                return {
                    statusCode: 400,
                    body: "Campos obrigatórios ausentes: stock_unit_id, store_id e type.",
                };
            }
            
            // Validação do TIPO FIXO (ENUM)
            if (!VALID_MOVEMENT_TYPES.includes(payload.type)) {
                return {
                    statusCode: 400,
                    body: `O tipo de movimento deve ser um dos seguintes: ${VALID_MOVEMENT_TYPES.join(', ')}.`,
                };
            }

            // Registra a movimentação e executa a baixa no estoque, se necessário
            const newMovement = await this.createMovementRepository.createMovement(payload);

            return {
                statusCode: 201, // Created
                body: newMovement,
            };

        } catch (error: any) {
            console.error("ERRO NO CONTROLLER DE MOVIMENTAÇÃO:", error);

            return {
                statusCode: 500,
                body: "Algo deu errado ao registrar o movimento: " + error.message,
            };
        }
    }
}