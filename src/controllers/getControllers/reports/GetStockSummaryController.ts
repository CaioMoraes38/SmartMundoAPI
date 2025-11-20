import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { 
    IGetStockSummaryController, 
    IGetReportsRepository, 
    StockSummary 
} from "./protocol";

export class GetStockSummaryController implements IGetStockSummaryController {
    constructor(private readonly reportsRepository: IGetReportsRepository) {}

    async handle(
        httpRequest: HttpRequest<any>
    ): Promise<HttpResponse<StockSummary[]>> {
        try {
            const stockSummary = await this.reportsRepository.getCurrentStockSummary();

            return {
                statusCode: 200,
                body: stockSummary,
            };

        } catch (error: any) {
            return {
                statusCode: 500,
                body: "Erro ao gerar resumo de estoque: " + error.message,
            };
        }
    }
}