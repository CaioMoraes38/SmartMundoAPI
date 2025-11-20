import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../database/supabase';
import { IGetReportsRepository, GetReportsParams, ProfitSummary, StockSummary } from '../../../controllers/getControllers/reports/protocol';

export class ReportsRepository implements IGetReportsRepository {
    private db: SupabaseClient;

    constructor(dbClient: SupabaseClient) {
        this.db = dbClient;
    }

    async getAggregatedProfit(params: GetReportsParams): Promise<ProfitSummary[]> {
        const { data, error } = await this.db
            .from('daily_profit_summary')
            .select('sale_day, store_id, daily_profit')
            .order('sale_day', { ascending: false });

        if (error) throw new Error(error.message);

        const dailyData = data || [];

        if (params.periodType === 'total') {
            const total = dailyData.reduce((sum, item: any) => sum + item.daily_profit, 0);
            return [{ period: 'Total', store_id: params.storeId || 'Geral', total_profit: parseFloat(total.toFixed(2)) }];
        }

        return dailyData.map((item: any) => ({
            period: item.sale_day.substring(0, 10),
            store_id: item.store_id,
            total_profit: item.daily_profit,
        }));
    }

    async getCurrentStockSummary(): Promise<StockSummary[]> {
        const { data, error } = await this.db
            .from('current_stock_summary')
            .select('*')
            .order('store_name', { ascending: true })
            .order('product_name', { ascending: true });

        if (error) throw new Error(error.message);

        return data || [];
    }
}
