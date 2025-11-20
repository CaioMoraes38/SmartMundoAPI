import { config } from "dotenv";
config(); 

import express, { Request, Response } from "express"; 
// O supabase não precisa ser importado aqui se não for usado diretamente no index
// import { supabase } from "./database/supabase"; 

// === USUÁRIOS ===
import { GetUsersController } from "./controllers/getControllers/getUsers/getUsers";
import { SupabaseUsersRepository } from "./repositories/getRepositories/getUsers/supabaseGetUsers";
import { CreateUserController } from "./controllers/createControllers/createUser/createUser";
import { SupabaseCreateUserRepository } from "./repositories/createRepositories/createUsers/supabaseCreateUsers";

// === PRODUTOS ===
import { CreateProductController } from "./controllers/createControllers/createProducts/createProducts";
import { SupabaseCreateProductRepository } from "./repositories/createRepositories/createProducts/supabaseCreateProducts";

// === ESTOQUE ===
import { CreateStockUnitController } from "./controllers/createControllers/createStockUnit/createStockUnit";
import { StockUnitsRepository } from "./repositories/createRepositories/createStockUnit/supabaseCreateStockUnit";

// === VENDAS ===
import { CreateSaleController } from "./controllers/createControllers/createSales/createSales";
import { SaleRepository } from "./repositories/createRepositories/createSales/supabaseCreateSales";

// === RELATÓRIOS ===
// Certifique-se de que o nome do arquivo aqui bate com o que você salvou (ReportsRepository.ts)
import { ReportsRepository } from "./repositories/getRepositories/getReports/reportsRepository";
import { GetProfitReportsController } from "./controllers/getControllers/reports/getProfitReportsController";
import { GetTotalProfitController } from "./controllers/getControllers/reports/getTotalProfitController";
import { GetStockSummaryController } from "./controllers/getControllers/reports/GetStockSummaryController";

// === DELETE CATEGORIA (CORRIGIDO) ===
// Ajuste os caminhos se você salvou em pastas diferentes
import { SupabaseDeleteCategoryRepository } from "./repositories/deleteRepositories/supabaseDeleteCategory";
import { DeleteCategoryController } from "./controllers/deleteControllers/deleteCategory/deleteCategory";


const app = express();
app.use(express.json());

// =========================================================================
// 1. INSTANCIAÇÃO DOS REPOSITÓRIOS
// =========================================================================
const productsRepository = new SupabaseCreateProductRepository();
const stockUnitsRepository = new StockUnitsRepository();
const saleRepository = new SaleRepository();

// Reports: Sem argumentos (removemos o constructor)
const reportsRepository = new ReportsRepository(); 

// Delete: Instancia o Repositório primeiro
const deleteCategoryRepository = new SupabaseDeleteCategoryRepository();


// =========================================================================
// 2. INSTANCIAÇÃO DOS CONTROLLERS (Injeção de Dependência)
// =========================================================================

// Users
// (Instanciados dentro da rota abaixo, mas poderiam ser aqui)

// Produtos/Estoque/Vendas
const createProductController = new CreateProductController(productsRepository);
const createStockUnitController = new CreateStockUnitController(stockUnitsRepository);
const createSaleController = new CreateSaleController(saleRepository);

// Relatórios
const getProfitReportsController = new GetProfitReportsController(reportsRepository);
const getTotalProfitController = new GetTotalProfitController(reportsRepository);
const getStockSummaryController = new GetStockSummaryController(reportsRepository);

// Delete Category: Injeta o Repositório no Controller
const deleteCategoryController = new DeleteCategoryController(deleteCategoryRepository);


// =========================================================================
// 3. DEFINIÇÃO DAS ROTAS
// =========================================================================

// --- Usuários ---
app.get("/users", async (req, res) => {
    const repo = new SupabaseUsersRepository();
    const controller = new GetUsersController(repo);
    const { statusCode, body } = await controller.handle();
    return res.status(statusCode).send(body);
});

app.post("/users", async (req, res) => {
    const supabaseCreaterRepository = new SupabaseCreateUserRepository();
    const createUserController = new CreateUserController(supabaseCreaterRepository);
    const { statusCode, body } = await createUserController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
});

// --- Produtos ---
app.post("/products", async (req: Request, res: Response) => {
    const { statusCode, body } = await createProductController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
});

// --- Estoque ---
app.post("/stock-units", async (req: Request, res: Response) => {
    const { statusCode, body } = await createStockUnitController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
});

// --- Vendas ---
app.post("/sales", async (req: Request, res: Response) => {
    const { statusCode, body } = await createSaleController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
});

// --- Relatórios ---
app.get("/reports/profit", async (req: Request, res: Response) => {
    const { statusCode, body } = await getProfitReportsController.handle({
        params: req.query
    });
    return res.status(statusCode).send(body);
});

app.get("/reports/profit/total", async (req: Request, res: Response) => {
    const { statusCode, body } = await getTotalProfitController.handle({
        params: req.query
    });
    return res.status(statusCode).send(body);
});

app.get("/reports/stock-summary", async (req: Request, res: Response) => {
    const { statusCode, body } = await getStockSummaryController.handle({
        params: req.query
    });
    return res.status(statusCode).send(body);
});

// --- Delete Category ---
app.delete("/categories/:id", async (req, res) => {
    const { statusCode, body } = await deleteCategoryController.handle({
        params: req.params // Passa os parâmetros da URL (id)
    });
    return res.status(statusCode).send(body);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log("Rotas Disponíveis:");
    console.log(" - POST /products, /stock-units, /sales");
    console.log(" - GET /reports/profit, /reports/profit/total, /reports/stock-summary");
    console.log(" - DELETE /categories/:id");
});