# Análise Completa do Projeto NotaFacil

## 📋 Resumo Executivo

**NotaFacil** é uma aplicação web full-stack para gerenciamento de operações comerciais de empresas de manufatura/produção. O sistema implementa uma arquitetura **multi-tenant** com isolamento completo de dados por tenant, permitindo que múltiplas empresas usem a mesma plataforma com dados completamente isolados.

**Status:** Em desenvolvimento ativo
**Última atualização:** 14 de Setembro de 2026
**Versão:** 1.0.0

---

## 🏗️ Arquitetura Geral

### Visão de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                   Port: 3000 (dev)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages (25 páginas)                                   │  │
│  │ Components (30+ componentes)                         │  │
│  │ Services (API integration)                           │  │
│  │ Contexts (Auth, Theme)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)                  │
│                   Port: 3000 (prod)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Controllers (13)                                     │  │
│  │ Services (13)                                        │  │
│  │ Repositories (11)                                    │  │
│  │ Middlewares (Auth, Error Handler, CORS)             │  │
│  │ Routes (12 grupos de rotas)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL (Multi-Tenant)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Schema: public                                       │  │
│  │   └─ Tenants (registro de empresas)                 │  │
│  │                                                      │  │
│  │ Schema: tenant_<id> (dinâmico por tenant)           │  │
│  │   ├─ Users, Orders, Products, Clients              │  │
│  │   ├─ Invoices, FinancialTransactions               │  │
│  │   ├─ Suppliers, Supplies, Production               │  │
│  │   └─ ... (todas as tabelas de negócio)             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Stack Tecnológico

### Frontend
| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| React | 19.3.0 | Framework UI |
| React Router | 7.18.3 | Roteamento |
| Bootstrap | 5.3.8 | Styling/UI Components |
| Testing Library | 16.3.3 | Testes |

### Backend
| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Node.js | - | Runtime |
| TypeScript | 5.9.3 | Linguagem |
| Express | 5.2.1 | Framework Web |
| TypeORM | 1.1.1 | ORM |
| PostgreSQL | 8.23.0 | Banco de Dados |
| JWT | 9.0.3 | Autenticação |
| Bcryptjs | 3.0.3 | Hash de Senhas |
| Mailjet | 6.0.11 | Email |

---

## 📁 Estrutura do Projeto

### Frontend (`/frontend`)

```
frontend/
├── public/
├── src/
│   ├── pages/                    # 25 páginas da aplicação
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   ├── OrdersPage.js
│   │   ├── InvoicesPage.js
│   │   ├── FinancialPage.js
│   │   ├── ProductsPage.js
│   │   ├── ClientsPage.js
│   │   ├── SuppliersPage.js
│   │   ├── SuppliesPage.js
│   │   ├── ProductionPage.js
│   │   ├── CashRegisterPage.js
│   │   ├── SettingsPage.js
│   │   ├── ReportsPage.js
│   │   ├── SupportPage.js
│   │   ├── CheckoutPage.js (novo)
│   │   ├── CheckoutProductsPage.js
│   │   ├── CheckoutPaymentPage.js
│   │   ├── CheckoutSummaryPage.js
│   │   └── ... (mais 6 páginas)
│   │
│   ├── components/               # 30+ componentes reutilizáveis
│   │   ├── AppLayout.js
│   │   ├── Modal.js
│   │   ├── PrivateRoute.js
│   │   ├── Icon.js
│   │   ├── *FormModal.js (formulários)
│   │   ├── *Table.js (tabelas)
│   │   ├── Delete*Modal.js (confirmação)
│   │   └── ...
│   │
│   ├── services/                 # Integração com API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   ├── invoiceService.js
│   │   └── ...
│   │
│   ├── contexts/                 # Context API
│   │   └── AuthContext.js
│   │
│   ├── hooks/                    # Custom hooks
│   │   └── ...
│   │
│   ├── utils/                    # Utilitários
│   │   └── ...
│   │
│   ├── App.js                    # Componente raiz
│   ├── App.css
│   ├── checkout.css
│   ├── checkout-dark.css
│   └── index.js
│
├── package.json
├── package-lock.json
└── README.md
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── app.ts                    # Configuração Express
│   ├── server.ts                 # Entry point
│   │
│   ├── config/                   # Configurações
│   │   └── database.ts
│   │
│   ├── controllers/              # 13 controladores
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── OrderController.ts
│   │   ├── InvoiceController.ts
│   │   ├── ProductController.ts
│   │   ├── ClientController.ts
│   │   ├── SupplierController.ts
│   │   ├── SupplyController.ts
│   │   ├── ProductionController.ts
│   │   ├── FinancialController.ts
│   │   ├── CaixaController.ts
│   │   └── ...
│   │
│   ├── services/                 # 13 serviços
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   ├── OrderService.ts
│   │   ├── InvoiceService.ts
│   │   ├── ProductService.ts
│   │   ├── ClientService.ts
│   │   ├── SupplierService.ts
│   │   ├── SupplyService.ts
│   │   ├── ProductionService.ts
│   │   ├── FinancialService.ts
│   │   ├── CaixaService.ts
│   │   └── ...
│   │
│   ├── repositories/             # 11 repositórios
│   │   ├── UserRepository.ts
│   │   ├── OrderRepository.ts
│   │   ├── InvoiceRepository.ts
│   │   ├── ProductRepository.ts
│   │   ├── ClientRepository.ts
│   │   ├── SupplierRepository.ts
│   │   ├── SupplyRepository.ts
│   │   ├── ProductionRepository.ts
│   │   ├── FinancialRepository.ts
│   │   ├── CaixaRepository.ts
│   │   └── ...
│   │
│   ├── entities/                 # Modelos de dados
│   │   ├── public/
│   │   │   └── Tenant.ts
│   │   └── tenant/
│   │       ├── User.ts
│   │       ├── Order.ts
│   │       ├── OrderItem.ts
│   │       ├── Invoice.ts
│   │       ├── Product.ts
│   │       ├── Client.ts
│   │       ├── Supplier.ts
│   │       ├── Supply.ts
│   │       ├── Production.ts
│   │       ├── FinancialTransaction.ts
│   │       └── ...
│   │
│   ├── dto/                      # Data Transfer Objects
│   │   ├── CreateUserDTO.ts
│   │   ├── CreateOrderDTO.ts
│   │   ├── CreateInvoiceDTO.ts
│   │   └── ...
│   │
│   ├── middlewares/              # Middlewares Express
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   ├── corsMiddleware.ts
│   │   └── ...
│   │
│   ├── routes/                   # 12 grupos de rotas
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── invoiceRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── clientRoutes.ts
│   │   ├── supplierRoutes.ts
│   │   ├── supplyRoutes.ts
│   │   ├── productionRoutes.ts
│   │   ├── financialRoutes.ts
│   │   ├── caixaRoutes.ts
│   │   ├── index.ts (agregador)
│   │   └── ...
│   │
│   ├── database/                 # Banco de dados
│   │   ├── data-source.ts
│   │   ├── migrations/
│   │   ├── seed-orders.ts
│   │   ├── seed-products.ts
│   │   └── ...
│   │
│   ├── utils/                    # Utilitários
│   │   ├── jwt.ts
│   │   ├── mailer.ts
│   │   ├── slug.ts
│   │   └── ...
│   │
│   └── tests/                    # Testes unitários
│       ├── auth.service.test.ts
│       ├── user.service.test.ts
│       ├── order.service.test.ts
│       ├── product.service.test.ts
│       ├── client.service.test.ts
│       ├── tenant-isolation.test.ts
│       └── user-email-uniqueness.test.ts
│
├── dist/                         # Código compilado
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── ANALISE_PROJETO.md
└── populate-products.sh
```

---

## 🔐 Sistema de Autenticação e Multi-Tenancy

### Fluxo de Registro

```
1. Usuário submete: name, email, password, tenantName
2. Backend:
   a) Cria novo Tenant com slug único
   b) Cria schema PostgreSQL (tenant_<id>)
   c) Executa migrations no novo schema
   d) Cria usuário no schema do tenant
   e) Retorna JWT com tenantId e schema
3. Frontend:
   a) Armazena JWT no localStorage
   b) Redireciona para dashboard
```

### Fluxo de Login

```
1. Usuário submete: email, password
2. Backend:
   a) Busca tenants onde email existe
   b) Se múltiplos matches → retorna lista para seleção
   c) Se único → valida credenciais
   d) Retorna JWT com tenantId e schema
3. Frontend:
   a) Armazena JWT
   b) Redireciona para dashboard
```

### Fluxo de Requisições Autenticadas

```
1. Frontend envia: Authorization: Bearer <JWT>
2. Middleware authMiddleware:
   a) Valida JWT
   b) Extrai tenantId e schema
   c) Conecta DataSource ao schema correto
   d) Passa user info para controller
3. Controller/Service:
   a) Acessa dados do schema do tenant
   b) Retorna dados isolados
```

### JWT Payload

```json
{
  "sub": "user-id-uuid",
  "tenantId": "tenant-id-uuid",
  "schema": "tenant_abc123def456",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 📊 Modelo de Dados

### Entidades Principais

#### 1. **Tenant** (Schema: public)
```typescript
{
  id: UUID (PK)
  name: string
  slug: string (UNIQUE)
  schemaName: string (UNIQUE)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 2. **User** (Schema: tenant_*)
```typescript
{
  id: UUID (PK)
  name: string
  email: string (UNIQUE)
  password: string (hashed)
  resetToken: string | null
  resetTokenExpires: timestamp | null
  createdAt: timestamp
  updatedAt: timestamp
  
  Relações:
  - orders: Order[] (1:N)
}
```

#### 3. **Order** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  clientName: string
  status: enum (awaiting_cutting, in_production, invoiced, finished, cancelled)
  notes: string | null
  deliveryDate: date | null
  createdAt: timestamp
  updatedAt: timestamp
  
  Relações:
  - createdBy: User (N:1)
  - items: OrderItem[] (1:N)
  - financialTransactions: FinancialTransaction[] (1:N)
}
```

#### 4. **OrderItem** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  quantity: number
  unitPrice: decimal
  totalPrice: decimal
  
  Relações:
  - order: Order (N:1)
  - product: Product (N:1)
}
```

#### 5. **Invoice** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  number: string (UNIQUE)
  clientName: string
  status: enum (issued, cancelled)
  issueDate: date
  total: decimal(12,2)
  notes: string | null
  createdAt: timestamp
  updatedAt: timestamp
  
  Relações:
  - order: Order (N:1, nullable)
}
```

#### 6. **Product** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  name: string
  description: string | null
  price: decimal
  quantity: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 7. **Client** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  name: string
  email: string | null
  phone: string | null
  address: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 8. **Supplier** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  name: string
  email: string | null
  phone: string | null
  address: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 9. **Supply** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  name: string
  description: string | null
  quantity: number
  unitPrice: decimal
  createdAt: timestamp
  updatedAt: timestamp
  
  Relações:
  - supplier: Supplier (N:1)
}
```

#### 10. **Production** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  description: string
  status: enum
  startDate: date
  endDate: date | null
  createdAt: timestamp
  updatedAt: timestamp
  
  Relações:
  - order: Order (N:1)
}
```

#### 11. **FinancialTransaction** (Schema: tenant_*)
```typescript
{
  id: number (PK)
  type: enum (income, expense)
  amount: decimal
  description: string
  date: date
  paymentMethod: string (novo campo)
  createdAt: timestamp
  updatedAt: timestamp
  
  Relações:
  - order: Order (N:1)
}
```

### Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────┐
│ SCHEMA: public                                          │
│                                                         │
│ Tenant                                                  │
│ ├─ id (PK)                                              │
│ ├─ name                                                 │
│ └─ schemaName (referencia schema dinâmico)             │
└─────────────────────────────────────────────────────────┘
                        │
                        │ (cada tenant tem seu schema)
                        ↓
┌─────────────────────────────────────────────────────────┐
│ SCHEMA: tenant_<id>                                     │
│                                                         │
│ User (1) ──────────────────────────────────────────┐   │
│  │                                                 │   │
│  └──> Order (N)                                   │   │
│         │                                         │   │
│         ├──> OrderItem (N) ──> Product (1)       │   │
│         │                                         │   │
│         ├──> FinancialTransaction (N)            │   │
│         │                                         │   │
│         └──> Invoice (N)                         │   │
│                                                   │   │
│ Client (N) ────────────────────────────────────────┤   │
│                                                   │   │
│ Supplier (N)                                      │   │
│  │                                                │   │
│  └──> Supply (N)                                 │   │
│                                                   │   │
│ Production (N) ──> Order (1)                      │   │
│                                                   │   │
│ FinancialTransaction (N) ──> Order (1)           │   │
│                                                   │   │
│ Todos isolados por tenant ──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 Endpoints da API

### Autenticação (`/auth`)
```
POST   /auth/register              - Registrar novo tenant + usuário
POST   /auth/login                 - Login com seleção de tenant
POST   /auth/forgot-password       - Solicitar reset de senha
POST   /auth/reset-password        - Resetar senha
```

### Usuários (`/users`)
```
GET    /users                      - Listar usuários
GET    /users/:id                  - Obter usuário
POST   /users                      - Criar usuário
PUT    /users/:id                  - Atualizar usuário
DELETE /users/:id                  - Deletar usuário
```

### Pedidos (`/orders`)
```
GET    /orders                     - Listar pedidos
GET    /orders/:id                 - Obter pedido
POST   /orders                     - Criar pedido
PUT    /orders/:id                 - Atualizar pedido
DELETE /orders/:id                 - Deletar pedido
PUT    /orders/:id/status          - Atualizar status
```

### Notas Fiscais (`/invoices`)
```
GET    /invoices                   - Listar invoices
GET    /invoices/:id               - Obter invoice
POST   /invoices                   - Criar invoice
PUT    /invoices/:id               - Atualizar invoice
DELETE /invoices/:id               - Deletar invoice
```

### Produtos (`/products`)
```
GET    /products                   - Listar produtos
GET    /products/:id               - Obter produto
POST   /products                   - Criar produto
PUT    /products/:id               - Atualizar produto
DELETE /products/:id               - Deletar produto
```

### Clientes (`/clients`)
```
GET    /clients                    - Listar clientes
GET    /clients/:id                - Obter cliente
POST   /clients                    - Criar cliente
PUT    /clients/:id                - Atualizar cliente
DELETE /clients/:id                - Deletar cliente
```

### Fornecedores (`/suppliers`)
```
GET    /suppliers                  - Listar fornecedores
GET    /suppliers/:id              - Obter fornecedor
POST   /suppliers                  - Criar fornecedor
PUT    /suppliers/:id              - Atualizar fornecedor
DELETE /suppliers/:id              - Deletar fornecedor
```

### Suprimentos (`/supplies`)
```
GET    /supplies                   - Listar suprimentos
GET    /supplies/:id               - Obter suprimento
POST   /supplies                   - Criar suprimento
PUT    /supplies/:id               - Atualizar suprimento
DELETE /supplies/:id               - Deletar suprimento
```

### Produção (`/productions`)
```
GET    /productions                - Listar produções
GET    /productions/:id            - Obter produção
POST   /productions                - Criar produção
PUT    /productions/:id            - Atualizar produção
DELETE /productions/:id            - Deletar produção
```

### Financeiro (`/financial`)
```
GET    /financial                  - Listar transações
GET    /financial/:id              - Obter transação
POST   /financial                  - Criar transação
PUT    /financial/:id              - Atualizar transação
DELETE /financial/:id              - Deletar transação
GET    /financial/reports/summary  - Relatório resumido
```

### Caixa (`/caixa`)
```
GET    /caixa                      - Obter status do caixa
POST   /caixa/open                 - Abrir caixa
POST   /caixa/close                - Fechar caixa
POST   /caixa/transaction          - Registrar transação
```

---

## 🎨 Páginas do Frontend

### Autenticação
- **LoginPage** - Login com email e senha
- **RegisterPage** - Registro de novo tenant
- **ForgotPasswordPage** - Solicitar reset de senha
- **ResetPasswordPage** - Resetar senha

### Dashboard e Navegação
- **DashboardPage** - Visão geral com métricas
- **AppLayout** - Layout principal com sidebar

### Gerenciamento de Pedidos
- **OrdersPage** - Listagem e CRUD de pedidos
- **OrderDetailsPage** - Detalhes de um pedido
- **CheckoutPage** - Checkout de pedidos (novo)
- **CheckoutProductsPage** - Seleção de produtos
- **CheckoutPaymentPage** - Processamento de pagamento
- **CheckoutSummaryPage** - Resumo do checkout

### Gerenciamento Financeiro
- **InvoicesPage** - Listagem e CRUD de notas fiscais
- **InvoiceDetailsPage** - Detalhes de uma invoice
- **FinancialPage** - Transações financeiras
- **CashRegisterPage** - Gerenciamento de caixa
- **ReportsPage** - Relatórios financeiros

### Gerenciamento de Dados
- **ProductsPage** - Listagem e CRUD de produtos
- **ClientsPage** - Listagem e CRUD de clientes
- **SuppliersPage** - Listagem e CRUD de fornecedores
- **SuppliesPage** - Listagem e CRUD de suprimentos
- **ProductionPage** - Listagem e CRUD de produção

### Configurações
- **SettingsPage** - Configurações da aplicação
- **UsersPage** - Gerenciamento de usuários
- **SupportPage** - Página de suporte
- **ComingSoonPage** - Página placeholder

---

## 🧪 Testes

### Testes Existentes

1. **auth.service.test.ts** - Testes de autenticação
   - Registro de usuário
   - Login
   - Reset de senha
   - Validação de credenciais

2. **user.service.test.ts** - Testes de usuários
   - CRUD de usuários
   - Validação de email único

3. **order.service.test.ts** - Testes de pedidos
   - CRUD de pedidos
   - Gerenciamento de status

4. **product.service.test.ts** - Testes de produtos
   - CRUD de produtos

5. **client.service.test.ts** - Testes de clientes
   - CRUD de clientes

6. **tenant-isolation.test.ts** - Testes de isolamento
   - Verifica isolamento de dados entre tenants

7. **user-email-uniqueness.test.ts** - Testes de unicidade
   - Verifica unicidade de email por tenant

### Executar Testes

```bash
cd backend
npm test
```

---

## 🚀 Scripts Disponíveis

### Frontend
```bash
npm start                    # Inicia servidor de desenvolvimento (port 3000)
npm run build                # Build para produção
npm test                     # Executa testes
npm run eject                # Eject do Create React App (irreversível)
```

### Backend
```bash
npm run dev                  # Inicia servidor com watch mode (port 3000)
npm run build                # Compila TypeScript para dist/
npm start                    # Inicia servidor compilado
npm test                     # Executa testes
npm run typeorm              # CLI do TypeORM
npm run migration:generate   # Gera migration baseada em mudanças
npm run migration:run        # Executa migrations pendentes
npm run migration:revert     # Reverte última migration
npm run seed:orders          # Popula dados de teste (orders)
npm run seed:products        # Popula dados de teste (products)
```

---

## 🔒 Segurança

### Autenticação
- **JWT** com expiração configurável (padrão: 1 dia)
- **Bcrypt** para hash de senhas (10 rounds)
- **Reset Token** com hash SHA256 e expiração

### Autorização
- **Middleware de Autenticação** valida JWT em rotas protegidas
- **Isolamento de Tenant** garante acesso apenas aos dados do tenant
- **PrivateRoute** no frontend protege rotas autenticadas

### Variáveis de Ambiente

**Backend (.env)**
```
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-change-me
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=notafacil
DB_LOGGING=false
MAILJET_API_KEY=
MAILJET_SECRET_KEY=
MAIL_FROM=no-reply@notafacil.com
MAIL_FROM_NAME=NotaFacil
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:3000
```

---

## 📦 Dependências Principais

### Frontend
| Pacote | Versão | Propósito |
|--------|--------|----------|
| react | 19.3.0 | Framework UI |
| react-dom | 19.3.0 | Renderização DOM |
| react-router-dom | 7.18.3 | Roteamento |
| bootstrap | 5.3.8 | Styling |
| @testing-library/react | 16.3.3 | Testes |

### Backend
| Pacote | Versão | Propósito |
|--------|--------|----------|
| express | 5.2.1 | Framework web |
| typeorm | 1.1.1 | ORM |
| pg | 8.23.0 | Driver PostgreSQL |
| jsonwebtoken | 9.0.3 | JWT |
| bcryptjs | 3.0.3 | Hash |
| cors | 2.8.6 | CORS |
| dotenv | 17.4.2 | Env vars |
| node-mailjet | 6.0.11 | Email |
| typescript | 5.9.3 | Linguagem |
| ts-node-dev | 2.0.0 | Dev mode |
| sinon | 22.1.0 | Mocking |

---

## 🔄 Fluxo de Desenvolvimento

### 1. Setup Local

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configurar variáveis
npm run migration:run
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm start
```

### 2. Criar Nova Feature

**Backend:**
```bash
# 1. Criar entidade em src/entities/tenant/
# 2. Criar repository em src/repositories/
# 3. Criar service em src/services/
# 4. Criar controller em src/controllers/
# 5. Criar routes em src/routes/
# 6. Adicionar rota em src/routes/index.ts
# 7. Criar testes em src/tests/
# 8. Gerar migration
npm run migration:generate -- -n NomeMigration
npm run migration:run
```

**Frontend:**
```bash
# 1. Criar página em src/pages/
# 2. Criar componentes em src/components/
# 3. Criar service em src/services/
# 4. Adicionar rota em src/App.js
```

### 3. Testes

```bash
# Backend
npm test

# Frontend
npm test
```

### 4. Build e Deploy

```bash
# Backend
npm run build
npm start

# Frontend
npm run build
# Deploy pasta build/
```

---

## 📊 Estatísticas do Projeto

### Frontend
- **Páginas:** 25
- **Componentes:** 30+
- **Serviços:** 5+
- **Contextos:** 2
- **Hooks:** 3+
- **Linhas de código:** ~5000+

### Backend
- **Controllers:** 13
- **Services:** 13
- **Repositories:** 11
- **Entidades:** 11
- **Routes:** 12 grupos
- **Testes:** 7 arquivos
- **Linhas de código:** ~8000+

### Total
- **Arquivos TypeScript/JavaScript:** ~100+
- **Commits:** 15+
- **Versão:** 1.0.0

---

## 🎯 Funcionalidades Principais

### ✅ Implementadas
1. **Multi-Tenancy** - Isolamento completo de dados
2. **Autenticação** - JWT com registro e login
3. **CRUD Completo** - Usuários, Pedidos, Invoices, Produtos, Clientes, Fornecedores, Suprimentos, Produção
4. **Gerenciamento de Pedidos** - Status, itens, rastreamento
5. **Gerenciamento Financeiro** - Transações, relatórios
6. **Gerenciamento de Caixa** - Abertura/fechamento, transações
7. **Dashboard** - Visão geral com métricas
8. **Checkout** - Fluxo de compra (novo)
9. **Reset de Senha** - Com email
10. **Testes Unitários** - Cobertura de funcionalidades críticas

### 🔄 Em Desenvolvimento
1. **Checkout** - Integração com pagamento
2. **Relatórios** - Mais detalhados
3. **Notificações** - Em tempo real

### 📋 Sugeridos
1. **Validação de DTOs** - class-validator
2. **Logging Estruturado** - winston/pino
3. **Rate Limiting** - express-rate-limit
4. **Documentação API** - Swagger/OpenAPI
5. **Cache** - Redis
6. **Auditoria** - Rastreamento de mudanças
7. **Webhooks** - Integrações externas
8. **Backup Automático** - Dados

---

## 🐛 Tratamento de Erros

### Backend
- **Error Handler Middleware** centralizado em `src/middlewares/error-handler.ts`
- Retorna respostas JSON padronizadas
- Logging de erros
- Status HTTP apropriados

### Frontend
- **Try-catch** em chamadas de API
- **Toast notifications** para feedback do usuário
- **Error boundaries** para componentes

---

## 📧 Integração com Email

- **Provedor:** Mailjet
- **Uso:** Envio de emails de reset de senha
- **Localização:** `src/utils/mailer.ts`
- **Configuração:** Variáveis de ambiente `MAILJET_API_KEY` e `MAILJET_SECRET_KEY`

---

## 🚨 Observações Importantes

1. **Secrets em Produção**
   - Alterar `JWT_SECRET` em produção
   - Usar credenciais seguras para banco de dados
   - Configurar CORS corretamente

2. **Email**
   - Configurar credenciais Mailjet para envio real
   - Testar templates de email

3. **Database**
   - Fazer backups regulares
   - Monitorar performance
   - Implementar índices conforme necessário

4. **Performance**
   - Considerar cache (Redis)
   - Otimizar queries
   - Implementar paginação

5. **Logging**
   - Adicionar logger estruturado (winston, pino)
   - Monitorar erros em produção

6. **Segurança**
   - Rate limiting
   - Validação de entrada
   - SQL injection prevention (já feito com TypeORM)
   - CSRF protection

---

## 📚 Próximos Passos Sugeridos

### Curto Prazo (1-2 semanas)
1. Completar integração de checkout com pagamento
2. Adicionar validação de DTOs com `class-validator`
3. Implementar logging estruturado
4. Melhorar cobertura de testes

### Médio Prazo (1-2 meses)
1. Adicionar documentação Swagger/OpenAPI
2. Implementar cache (Redis)
3. Adicionar rate limiting
4. Implementar auditoria de mudanças
5. Melhorar relatórios

### Longo Prazo (2-3 meses)
1. Implementar webhooks
2. Adicionar integrações externas
3. Implementar backup automático
4. Melhorar performance
5. Adicionar mobile app (React Native)

---

## 🔗 Recursos Úteis

### Documentação
- [Express.js](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)

### Ferramentas
- [Postman](https://www.postman.com/) - Testes de API
- [pgAdmin](https://www.pgadmin.org/) - Gerenciamento de BD
- [VS Code](https://code.visualstudio.com/) - Editor

---

## 📝 Histórico de Commits

```
0d4fc1c - Implementando a rota de pedidos
27b511e - Implementando o conteudo do dashboard
d0707e8 - Ajustes gerais
898f131 - Ajustes gerais
ddf3522 - Implementando o reload na pagina
3f31818 - Implementando as rotas na sidebar
75faf6f - Implementando a autenticacao de usuario no frontend
da49d56 - Implementando a injecao de dependencia em controller
2491886 - Implementando a injecao de dependencia
63c8ca6 - Implementando o auth repository
07dd6e2 - Implementando a entidade auth
8c4ed8b - Implementando algoritmo inicial para o sistema
```

---

**Última Atualização:** 14 de Setembro de 2026
**Versão:** 1.0.0
**Status:** Em Desenvolvimento Ativo
