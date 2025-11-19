📦 SmartMundoAPI - Sistema de Controle de Estoque Multi-Loja

Esta é uma API de backend robusta desenvolvida em Node.js com Express e TypeScript, utilizando o Supabase como banco de dados principal. O projeto segue o padrão de arquitetura Controller-Repository-Service para garantir escalabilidade, testabilidade e separação de responsabilidades.

🌟 Funcionalidades Principais

O sistema foi projetado para gerenciar um inventário de compra e venda de produtos, com foco em rastreamento unitário e contabilidade de lucro detalhada.

Multi-Loja: Suporte a várias lojas (stores).

Rastreamento Unitário: Cada item em estoque é uma stock_unit única, com seu próprio custo (cost_price) e estado (status).

Autenticação: Login simples com app_users (requer hashing seguro com bcrypt).

Transações: Baixa automática de estoque na venda e cálculo de lucro por item.

Relatórios: Consulta de lucro e resumo de estoque em tempo real.

🛠️ Tecnologias Utilizadas

Backend: Node.js, Express.js

Linguagem: TypeScript

Banco de Dados: PostgreSQL (via Supabase)

Acesso ao DB: @supabase/supabase-js

Ferramentas: dotenv, ts-node

⚙️ Configuração e Instalação

Siga estes passos para configurar e rodar o projeto localmente.

1. Pré-requisitos

Node.js (versão 18+)

Uma instância de projeto no Supabase.

Base de dados inicializada com o inventory_schema.sql.

2. Instalação de Dependências

npm install


3. Configuração de Variáveis de Ambiente

Crie um arquivo chamado .env na raiz do projeto e preencha-o com suas chaves do Supabase.

Atenção: Use a Service Role Key para o backend, pois ela permite acesso irrestrito ao banco (necessário para o login e a baixa de estoque).

# Conteúdo do arquivo .env
SUPABASE_URL="[SUA URL DO PROJETO SUPABASE AQUI]"
SUPABASE_SERVICE_ROLE_KEY="[SUA SERVICE ROLE KEY AQUI]"
PORT=3000


4. Inicialização do Servidor

Rode o servidor Express no modo de desenvolvimento com ts-node:

npm start


O servidor estará rodando em http://localhost:3000.

🗄️ Estrutura da Arquitetura

O projeto utiliza o padrão Controller/Repository:

src/database/supabase.ts: Inicializa o cliente Supabase.

src/models/: Define as interfaces TypeScript para as tabelas (e.g., Product, StockUnit).

src/controllers/: Camada que lida com a requisição HTTP (req, res), valida o payload e chama o repositório.

src/repositories/: Camada que contém a lógica de acesso direto ao Supabase (.from('tabela').select(...)).

index.ts: Ponto de entrada que configura as rotas e injeta as dependências.

🗺️ Endpoints da API

Todos os endpoints utilizam a base http://localhost:3000/.

Rota

Método

Descrição

/login

POST

Autentica um usuário e retorna dados seguros (requer username, password).

/users

POST

Cria um novo usuário (name, userName, password).

/categories

POST

Cria uma nova categoria (name, description).

/categories

GET

Lista todas as categorias.

/products

POST

Cria a Ficha Mestra do Produto (name, suggested_price, min_price, category_id).

/stock-units

POST

Registra a entrada de uma unidade no estoque, atrelando product_id, store_id, cost_price e status.

/sales

POST

Processa uma transação de venda. Requer store_id e um array de items (com stock_unit_id e selling_price). Executa a baixa de estoque.

/reports/profit

GET

Retorna o lucro agregado (diário, semanal, mensal ou total). Aceita query params como ?periodType=month ou ?storeId=[UUID].

/reports/stock-summary

GET

Retorna o resumo atual do estoque por loja e o valor de custo total.
