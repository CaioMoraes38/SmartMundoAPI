import { HttpRequest, HttpResponse } from "../../generalProtocols";


export interface ProfitSummary {
    period: string;       
    store_id: string;     
    total_profit: number; 
}


export interface StockSummary {
    store_id: string;
    store_name: string;
    product_id: string;
    product_name: string;
    total_units_in_stock: number;
    total_stock_value: number;
}


export interface GetReportsParams {
    storeId?: string;
    periodType?: 'day' | 'total';
}


export interface IGetReportsRepository {
    getAggregatedProfit(params: GetReportsParams): Promise<ProfitSummary[]>;
    getCurrentStockSummary(): Promise<StockSummary[]>;
}

export interface IGetProfitReportsController {
    handle(httpRequest: HttpRequest<GetReportsParams>): Promise<HttpResponse<ProfitSummary[]>>;
}

export interface IGetStockSummaryController {
    handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<StockSummary[]>>;
}