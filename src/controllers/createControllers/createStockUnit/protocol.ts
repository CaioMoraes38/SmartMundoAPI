import { StockUnit, CreateStockUnitPayload } from "../../models/stockUnit";
import { HttpRequest, HttpResponse } from "../generalProtocols";

/**
 * Representa os valores fixos (ENUM) definidos no PostgreSQL para o estado do item.
 */
export type item_status = 'novo' | 'usado' | 'recondicionado' | 'defeito';

/**
 * Parâmetros de entrada para criar uma nova unidade em estoque.
 */
export type CreateStockUnitParams = CreateStockUnitPayload;

/**
 * Interface do Controller de Criação de Unidade de Estoque.
 */
export interface ICreateStockUnitController {
    handle(httpRequest: HttpRequest<CreateStockUnitParams>): Promise<HttpResponse<StockUnit>>;
}

/**
 * Interface do Repositório de Criação de Unidade de Estoque.
 */
export interface ICreateStockUnitRepository {
    createStockUnit(params: CreateStockUnitParams): Promise<StockUnit>;
}