import { HttpRequest, HttpResponse } from "../../generalProtocols";

// === Interfaces do Modelo (Simplificadas para uso aqui) ===

export interface Sale {
    sale_id: string;
    store_id: string;
    total_amount: number;
    sale_date: string;
}

export interface SaleDetail {
    sale_detail_id: string;
    stock_unit_id: string;
    selling_price: number;
    cost_price: number;
    profit: number; // Calculado pelo banco
}

// === Payload de Entrada (O que o Front envia) ===

export interface SaleItemPayload {
    stock_unit_id: string; // ID da unidade física
    selling_price: number; // Preço que foi vendido
}

export interface CreateSaleParams {
    store_id: string;
    discount_applied?: number; // Opcional, desconto em %
    items: SaleItemPayload[];  // Lista de itens vendidos
}

// === Contratos ===

export interface ICreateSaleRepository {
    /**
     * Cria a transação completa: Venda -> Detalhes -> Baixa de Estoque
     */
    createSaleTransaction(params: CreateSaleParams): Promise<Sale>;
}

export interface ICreateSaleController {
    handle(httpRequest: HttpRequest<CreateSaleParams>): Promise<HttpResponse<Sale>>;
}