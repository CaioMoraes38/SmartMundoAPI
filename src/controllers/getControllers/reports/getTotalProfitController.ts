import { HttpRequest, HttpResponse } from "../../generalProtocols";
import { 
    IGetProfitReportsController, 
    IGetReportsRepository, 
    ProfitSummary, 
    GetReportsParams 
} from "./protocol";

export class GetTotalProfitController implements IGetProfitReportsController {
    constructor(private readonly reportsRepository: IGetReportsRepository) {}

    async handle(
        httpRequest: HttpRequest<GetReportsParams>
    ): Promise<HttpResponse<ProfitSummary[]>> {
        try {
            const params: GetReportsParams = {
                storeId: httpRequest.params?.storeId,
                periodType: 'total', 
            };
            
            const profitSummary = await this.reportsRepository.getAggregatedProfit(params);

            return {
                statusCode: 200,
                body: profitSummary,
            };

        } catch (error: any) {
            return {
                statusCode: 500,
                body: "Erro ao gerar relatório de lucro total: " + error.message,
            };
        }
    }
}