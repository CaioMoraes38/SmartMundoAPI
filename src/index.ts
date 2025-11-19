import { config } from "dotenv";
config(); 

import express, { Request, Response, Router } from "express"; 


import { GetUsersController } from "./controllers/getControllers/getUsers/getUsers";
import { SupabaseUsersRepository } from "./repositories/getUsers/supabaseGetUsers";
import { CreateUserController } from "./controllers/createControllers/createUser/createUser";
import { SupabaseCreateUserRepository } from "./repositories/createRepositories/createUsers/supabaseCreateUsers";


import { CreateProductController } from "./controllers/createControllers/createProducts/createProducts";
import { SupabaseCreateProductRepository } from "./repositories/createRepositories/createProducts/supabaseCreateProducts";


import { CreateStockUnitController } from "./controllers/createControllers/createStockUnit/createStockUnit";
import { StockUnitsRepository } from "./repositories/createRepositories/createStockUnit/supabaseCreateStockUnit";
import { CreateSaleController } from "./controllers/createControllers/createSales/createSales";
import { SaleRepository } from "./repositories/createRepositories/createSales/supabaseCreateSales";



const app = express();
app.use(express.json());

const productsRepository = new SupabaseCreateProductRepository();
const stockUnitsRepository = new StockUnitsRepository();
const saleRepository = new SaleRepository();


// Controllers de Produtos e Estoque
const createProductController = new CreateProductController(productsRepository);
const createStockUnitController = new CreateStockUnitController(stockUnitsRepository);
const createSaleController = new CreateSaleController(saleRepository);





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


app.post("/products", async (req: Request, res: Response) => {
    const { statusCode, body } = await createProductController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
});


app.post("/stock-units", async (req: Request, res: Response) => {
    const { statusCode, body } = await createStockUnitController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
});

app.post("/sales", async (req: Request, res: Response) => {
    const { statusCode, body } = await createSaleController.handle({
        body: req.body
    });
    return res.status(statusCode).send(body);
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor rodando na porta", port);
    console.log("Endpoints de PRODUTO: POST /products, POST /stock-units e POST /sales");
});