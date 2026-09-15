# 📊 Análise Visual - Projeto NotaFacil

## 🎯 Visão Geral Executiva

**NotaFacil** é uma plataforma SaaS (Software as a Service) de **gerenciamento operacional** para empresas de manufatura e produção. É um sistema **multi-tenant** completo com isolamento total de dados por cliente.

| Aspecto | Detalhes |
|--------|----------|
| **Tipo** | Aplicação Web Full-Stack |
| **Modelo** | SaaS Multi-Tenant |
| **Status** | Em desenvolvimento ativo |
| **Versão** | 1.0.0 |
| **Última atualização** | 14 de Setembro de 2026 |
| **Linguagens** | TypeScript (Backend), JavaScript (Frontend) |

---

## 🏗️ Arquitetura em 3 Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                      http://localhost:3000                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • 25+ Páginas                                             │  │
│  │ • 30+ Componentes Reutilizáveis                          │  │
│  │ • Context API (Autenticação, Tema)                       │  │
│  │ • React Router v7 (Roteamento)                           │  │
│  │ • Bootstrap 5 (UI/Styling)                               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                   │
│                      http://localhost:3000                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • 13 Controllers                                          │  │
│  │ • 13 Services (Lógica de Negócio)                        │  │
│  │ • 11 Repositories (Acesso a Dados)                       │  │
│  │ • TypeORM (ORM)                                          │  │
│  │ • JWT + Bcryptjs (Segurança)                             │  │
│  │ • Mailjet (Email)                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ SQL
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Multi-Tenant)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Schema: public                                            │  │
│  │   └─ Tenants (Registro de Empresas)                      │  │
│  │                                                           │  │
│  │ Schema: tenant_<id> (Dinâmico por Tenant)               │  │
│  │   ├─ Users, Orders, Products, Clients                   │  │
│  │   ├─ Invoices, FinancialTransactions                    │  │
│  │   ├─ Suppliers, Supplies, Production                    │  │
│  │   └─ ... (Todas as tabelas de negócio)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico Detalhado

### Frontend
```
React 19.3.0
├── React Router 7.18.3 (Roteamento SPA)
├── Bootstrap 5.3.8 (UI Components)
├── Testing Library 16.3.3 (Testes)
└── Context API (State Management)
```

### Backend
```
Node.js + TypeScript 5.9.3
├── Express 5.2.1 (Framework Web)
├── TypeORM 1.1.1 (ORM)
├── PostgreSQL 8.23.0 (Driver)
├── JWT 9.0.3 (Autenticação)
├── Bcryptjs 3.0.3 (Hash de Senhas)
├── Mailjet 6.0.11 (Email)
└── Sinon 22.1.0 (Testes)
```

---

## 📁 Estrutura de Diretórios

### Frontend (`/frontend`)
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/                    # 25+ páginas
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   ├── OrdersPage.js
│   │   ├── OrderDetailsPage.js
│   │   ├── InvoicesPage.js
│   │   ├── InvoiceDetailsPage.js
│   │   ├── ProductionPage.js
│   │   ├── ClientsPage.js
│   │   ├── ProductsPage.js
│   │   ├── SuppliesPage.js
│   │   ├── SuppliersPage.js
│   │   ├── CashRegisterPage.js
│   │   ├── FinancialPage.js
│   │   ├── ReportsPage.js
│   │   ├── SettingsPage.js
│   │   ├── UsersPage.js
│   │   ├── CheckoutPage.js
│   │   ├── CheckoutProductsPage.js
│   │   ├── CheckoutPaymentPage.js
│   │   ├── CheckoutSummaryPage.js
│   │   ├── PDVPage.js
│   │   ├── PDVProductsPage.js
│   │   ├── PDVPaymentPage.js
│   │   ├── PDVSummaryPage.js
│   │   ├── SupportPage.js
│   │   ├── ComingSoonPage.js
│   │   └── ResetPasswordPage.js
│   │
│   ├── components/               # 30+ componentes
│   │   ├── AppLayout.js
│   │   ├── PrivateRoute.js
│   │   ├── Modal.js
│   │   ├── Icon.js
│   │   ├── *FormModal.js (Formulários)
│   │   ├── *Table.js (Tabelas)
│   │   ├── Delete*Modal.js (Confirmação)
│   │   └── ...
│   │
│   ├── services/                 # API Integration
│   │   ├── api.js (Axios config)
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   ├── invoiceService.js
│   │   ├── productService.js
│   │   ├── clientService.js
│   │   ├── supplierService.js
│   │   ├── supplyService.js
│   │   ├── productionService.js
│   │   ├── financialService.js
│   │   ├── caixaService.js
│   │   └── userService.js
│   │
│   ├── contexts/                 # Context API
│   │   └── AuthContext.js
│   │
│   ├── hooks/                    # Custom Hooks
│   │   └── ...
│   │
│   ├── utils/                    # Utilitários
│   │   └── ...
│   │
│   ├── App.js                    # Componente raiz
│   ├── App.css                   # Estilos principais
│   ├── checkout.css              # Estilos checkout
│   ├── checkout-dark.css         # Tema escuro
│   ├── index.css
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
│   ├── config/
│   │   └── database.ts           # Configuração do banco
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
│   │   ├── TenantController.ts
│   │   └── ReportController.ts
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
│   │   ├── TenantService.ts
│   │   └── ReportService.ts
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
│   │   └── TenantRepository.ts
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
│   │       ├── Caixa.ts
│   │       └── CaixaTransaction.ts
│   │
│   ├── dto/                      # Data Transfer Objects
│   │   ├── CreateUserDTO.ts
│   │   ├── CreateOrderDTO.ts
│   │   ├── CreateInvoiceDTO.ts
│   │   ├── CreateProductDTO.ts
│   │   ├── CreateClientDTO.ts
│   │   ├── CreateSupplierDTO.ts
│   │   ├── CreateSupplyDTO.ts
│   │   ├── CreateProductionDTO.ts
│   │   ├── CreateFinancialDTO.ts
│   │   └── ...
│   │
│   ├── middlewares/              # Middlewares Express
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   ├── corsMiddleware.ts
│   │   ├── tenantMiddleware.ts
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
│   │   ├── reportRoutes.ts
│   │   └── index.ts (agregador)
│   │
│   ├── database/                 # Banco de dados
│   │   ├── data-source.ts        # Configuração TypeORM
│   │   ├── migrations/           # Migrações SQL
│   │   ├── seed-orders.ts
│   │   ├── seed-products.ts
│   │   ├── seed-productions.ts
│   │   └── ...
│   │
│   ├── utils/                    # Utilitários
│   │   ├── jwt.ts                # JWT utilities
│   │   ├── mailer.ts             # Email service
│   │   ├── slug.ts               # Slug generator
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
├── .env                          # Variáveis de ambiente
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── ANALISE_PROJETO.md
```

---

## 🔐 Sistema de Autenticação e Multi-Tenancy

### Fluxo de Registro (Onboarding)
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário preenche formulário                              │
│    - Nome completo                                          │
│    - Email                                                  │
│    - Senha                                                  │
│    - Nome da empresa (Tenant)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Backend processa                                         │
│    a) Cria novo Tenant com slug único                       │
│    b) Cria schema PostgreSQL (tenant_<uuid>)                │
│    c) Executa migrations no novo schema                     │
│    d) Cria usuário no schema do tenant                      │
│    e) Retorna JWT com tenantId e schema                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Frontend armazena                                        │
│    - JWT no localStorage                                    │
│    - Redireciona para dashboard                             │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Login
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário submete email + senha                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Backend busca tenants                                    │
│    - Se múltiplos matches → retorna lista para seleção      │
│    - Se único → valida credenciais                          │
│    - Retorna JWT com tenantId e schema                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Frontend armazena JWT e redireciona                      │
└─────────────────────────────────────────────────────────────┘
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

### Isolamento de Dados (Multi-Tenancy)
```
┌─────────────────────────────────────────────────────────────┐
│ PostgreSQL Database                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Schema: public                                              │
│   └─ Tenants (registro de todas as empresas)               │
│                                                             │
│ Schema: tenant_empresa1_uuid                                │
│   ├─ Users (apenas usuários da empresa 1)                  │
│   ├─ Orders (apenas pedidos da empresa 1)                  │
│   ├─ Products (apenas produtos da empresa 1)               │
│   └─ ... (todos os dados isolados)                         │
│                                                             │
│ Schema: tenant_empresa2_uuid                                │
│   ├─ Users (apenas usuários da empresa 2)                  │
│   ├─ Orders (apenas pedidos da empresa 2)                  │
│   ├─ Products (apenas produtos da empresa 2)               │
│   └─ ... (todos os dados isolados)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Modelo de Dados (ER Diagram)

### Estrutura de Schemas

```
┌─────────────────────────────────────────────────────────────┐
│ SCHEMA: public                                              │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Tenant                                               │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: UUID (PK)                                        │   │
│ │ name: string                                         │   │
│ │ slug: string (UNIQUE)                                │   │
│ │ schemaName: string (UNIQUE)                          │   │
│ │ createdAt: timestamp                                 │   │
│ │ updatedAt: timestamp                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Dados por Tenant

```
┌─────────────────────────────────────────────────────────────┐
│ SCHEMA: tenant_<id>                                         │
│                                                             │
│ ┌──────────────────┐                                        │
│ │ User             │                                        │
│ ├──────────────────┤                                        │
│ │ id: UUID (PK)    │                                        │
│ │ name: string     │                                        │
│ │ email: string    │                                        │
│ │ password: hash   │                                        │
│ │ createdAt        │                                        │
│ └──────────────────┘                                        │
│         │                                                   │
│         │ 1:N                                               │
│         ↓                                                   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Order                                                │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: number (PK)                                      │   │
│ │ clientName: string                                   │   │
│ │ status: enum (awaiting_cutting, in_production, ...) │   │
│ │ deliveryDate: date                                   │   │
│ │ createdBy: UUID (FK → User)                          │   │
│ │ createdAt, updatedAt                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ├─ 1:N ─→ OrderItem ─→ Product                     │
│         ├─ 1:N ─→ FinancialTransaction                      │
│         └─ 1:N ─→ Invoice                                  │
│                                                             │
│ ┌──────────────────┐    ┌──────────────────┐               │
│ │ Product          │    │ Client           │               │
│ ├──────────────────┤    ├──────────────────┤               │
│ │ id: number (PK)  │    │ id: number (PK)  │               │
│ │ name: string     │    │ name: string     │               │
│ │ price: decimal   │    │ email: string    │               │
│ │ quantity: number │    │ phone: string    │               │
│ │ createdAt        │    │ address: string  │               │
│ └──────────────────┘    └──────────────────┘               │
│                                                             │
│ ┌──────────────────┐    ┌──────────────────┐               │
│ │ Supplier         │    │ Supply           │               │
│ ├──────────────────┤    ├──────────────────┤               │
│ │ id: number (PK)  │    │ id: number (PK)  │               │
│ │ name: string     │    │ name: string     │               │
│ │ email: string    │    │ quantity: number │               │
│ │ phone: string    │    │ unitPrice: dec   │               │
│ │ address: string  │    │ supplier_id: FK  │               │
│ └──────────────────┘    └──────────────────┘               │
│         ↑                                                   │
│         └─ 1:N ─────────────────────────────────────────   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Invoice                                              │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: number (PK)                                      │   │
│ │ number: string (UNIQUE)                              │   │
│ │ clientName: string                                   │   │
│ │ status: enum (issued, cancelled)                     │   │
│ │ total: decimal(12,2)                                 │   │
│ │ order_id: number (FK → Order, nullable)              │   │
│ │ createdAt, updatedAt                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Production                                           │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: number (PK)                                      │   │
│ │ description: string                                  │   │
│ │ status: enum                                         │   │
│ │ startDate: date                                      │   │
│ │ endDate: date                                        │   │
│ │ order_id: number (FK → Order)                        │   │
│ │ createdAt, updatedAt                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ FinancialTransaction                                 │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: number (PK)                                      │   │
│ │ type: enum (income, expense)                         │   │
│ │ amount: decimal                                      │   │
│ │ description: string                                  │   │
│ │ date: date                                           │   │
│ │ paymentMethod: string                                │   │
│ │ order_id: number (FK → Order)                        │   │
│ │ createdAt, updatedAt                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Caixa (Cash Register)                                │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: number (PK)                                      │   │
│ │ status: enum (open, closed)                          │   │
│ │ openedAt: timestamp                                  │   │
│ │ closedAt: timestamp                                  │   │
│ │ initialAmount: decimal                               │   │
│ │ finalAmount: decimal                                 │   │
│ │ createdAt, updatedAt                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         └─ 1:N ─→ CaixaTransaction                         │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ CaixaTransaction                                     │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ id: number (PK)                                      │   │
│ │ type: enum (income, expense)                         │   │
│ │ amount: decimal                                      │   │
│ │ description: string                                  │   │
│ │ caixa_id: number (FK → Caixa)                        │   │
│ │ createdAt                                            │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Endpoints da API (RESTful)

### Autenticação (`/auth`)
```
POST   /auth/register              Registrar novo tenant + usuário
POST   /auth/login                 Login com seleção de tenant
POST   /auth/forgot-password       Solicitar reset de senha
POST   /auth/reset-password        Resetar senha
```

### Usuários (`/users`)
```
GET    /users                      Listar usuários
GET    /users/:id                  Obter usuário específico
POST   /users                      Criar novo usuário
PUT    /users/:id                  Atualizar usuário
DELETE /users/:id                  Deletar usuário
```

### Pedidos (`/orders`)
```
GET    /orders                     Listar todos os pedidos
GET    /orders/:id                 Obter pedido específico
POST   /orders                     Criar novo pedido
PUT    /orders/:id                 Atualizar pedido
DELETE /orders/:id                 Deletar pedido
PUT    /orders/:id/status          Atualizar status do pedido
```

### Notas Fiscais (`/invoices`)
```
GET    /invoices                   Listar invoices
GET    /invoices/:id               Obter invoice específica
POST   /invoices                   Criar nova invoice
PUT    /invoices/:id               Atualizar invoice
DELETE /invoices/:id               Deletar invoice
```

### Produtos (`/products`)
```
GET    /products                   Listar produtos
GET    /products/:id               Obter produto específico
POST   /products                   Criar novo produto
PUT    /products/:id               Atualizar produto
DELETE /products/:id               Deletar produto
```

### Clientes (`/clients`)
```
GET    /clients                    Listar clientes
GET    /clients/:id                Obter cliente específico
POST   /clients                    Criar novo cliente
PUT    /clients/:id                Atualizar cliente
DELETE /clients/:id                Deletar cliente
```

### Fornecedores (`/suppliers`)
```
GET    /suppliers                  Listar fornecedores
GET    /suppliers/:id              Obter fornecedor específico
POST   /suppliers                  Criar novo fornecedor
PUT    /suppliers/:id              Atualizar fornecedor
DELETE /suppliers/:id              Deletar fornecedor
```

### Suprimentos (`/supplies`)
```
GET    /supplies                   Listar suprimentos
GET    /supplies/:id               Obter suprimento específico
POST   /supplies                   Criar novo suprimento
PUT    /supplies/:id               Atualizar suprimento
DELETE /supplies/:id               Deletar suprimento
```

### Produção (`/productions`)
```
GET    /productions                Listar produções
GET    /productions/:id            Obter produção específica
POST   /productions                Criar nova produção
PUT    /productions/:id            Atualizar produção
DELETE /productions/:id            Deletar produção
```

### Financeiro (`/financial`)
```
GET    /financial                  Listar transações
GET    /financial/:id              Obter transação específica
POST   /financial                  Criar nova transação
PUT    /financial/:id              Atualizar transação
DELETE /financial/:id              Deletar transação
GET    /financial/reports/summary  Relatório resumido
```

### Caixa (`/caixa`)
```
GET    /caixa                      Obter status do caixa
POST   /caixa/open                 Abrir caixa
POST   /caixa/close                Fechar caixa
POST   /caixa/transaction          Registrar transação
```

---

## 🎨 Páginas do Frontend

### Autenticação (Públicas)
| Página | Rota | Descrição |
|--------|------|-----------|
| LoginPage | `/login` | Login com email e senha |
| RegisterPage | `/register` | Registro de novo tenant |
| ForgotPasswordPage | `/forgot-password` | Solicitar reset de senha |
| ResetPasswordPage | `/reset-password` | Resetar senha |

### Dashboard e Navegação (Privadas)
| Página | Rota | Descrição |
|--------|------|-----------|
| DashboardPage | `/` | Visão geral com métricas |
| AppLayout | - | Layout principal com sidebar |

### Gerenciamento de Pedidos
| Página | Rota | Descrição |
|--------|------|-----------|
| OrdersPage | `/pedidos` | Listagem e CRUD de pedidos |
| OrderDetailsPage | `/pedidos/:id` | Detalhes de um pedido |
| CheckoutPage | `/checkout` | Checkout de pedidos |
| CheckoutProductsPage | `/checkout/produtos` | Seleção de produtos |
| CheckoutPaymentPage | `/checkout/pagamento` | Processamento de pagamento |
| CheckoutSummaryPage | `/checkout/resumo` | Resumo do checkout |

### PDV (Ponto de Venda)
| Página | Rota | Descrição |
|--------|------|-----------|
| PDVPage | `/pdv` | PDV principal |
| PDVProductsPage | `/pdv/produtos` | Seleção de produtos |
| PDVPaymentPage | `/pdv/pagamento` | Processamento de pagamento |
| PDVSummaryPage | `/pdv/resumo` | Resumo da venda |

### Gerenciamento Financeiro
| Página | Rota | Descrição |
|--------|------|-----------|
| InvoicesPage | `/notas-fiscais` | Listagem e CRUD de invoices |
| InvoiceDetailsPage | `/notas-fiscais/:id` | Detalhes de uma invoice |
| FinancialPage | `/financeiro` | Transações financeiras |
| CashRegisterPage | `/caixa` | Gerenciamento de caixa |
| ReportsPage | `/relatorios` | Relatórios financeiros |

### Gerenciamento de Dados
| Página | Rota | Descrição |
|--------|------|-----------|
| ProductsPage | `/produtos` | Listagem e CRUD de produtos |
| ClientsPage | `/clientes` | Listagem e CRUD de clientes |
| SuppliersPage | `/fornecedores` | Listagem e CRUD de fornecedores |
| SuppliesPage | `/insumos` | Listagem e CRUD de suprimentos |
| ProductionPage | `/producao` | Listagem e CRUD de produção |

### Configurações
| Página | Rota | Descrição |
|--------|------|-----------|
| SettingsPage | `/configuracoes` | Configurações da aplicação |
| UsersPage | `/usuarios` | Gerenciamento de usuários |
| SupportPage | `/ajuda` | Página de suporte |
| ComingSoonPage | `/perfil` | Placeholder para futuras features |

---

## 🧪 Testes Implementados

### Testes Unitários Backend
```
src/tests/
├── auth.service.test.ts
│   ├── Registro de usuário
│   ├── Login
│   ├── Reset de senha
│   └── Validação de credenciais
│
├── user.service.test.ts
│   ├── CRUD de usuários
│   └── Validação de email único
│
├── order.service.test.ts
│   ├── CRUD de pedidos
│   └── Gerenciamento de status
│
├── product.service.test.ts
│   ├── CRUD de produtos
│   └── Validação de dados
│
├── client.service.test.ts
│   ├── CRUD de clientes
│   └── Validação de dados
│
├── tenant-isolation.test.ts
│   └── Validação de isolamento de dados
│
└── user-email-uniqueness.test.ts
    └── Validação de email único por tenant
```

### Testes Frontend
```
Frontend usa Testing Library + Jest
- Testes de componentes
- Testes de integração
```

---

## 📈 Fluxo de Dados Completo

### Exemplo: Criar um Pedido

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Frontend (React)                                         │
│    - Usuário preenche formulário de pedido                  │
│    - Clica em "Salvar"                                      │
│    - OrderFormModal.js dispara POST /orders                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. API Request                                              │
│    POST /orders                                             │
│    Headers:                                                 │
│      Authorization: Bearer <JWT>                            │
│      Content-Type: application/json                         │
│    Body: {                                                  │
│      clientName: "Cliente X",                               │
│      status: "awaiting_cutting",                            │
│      items: [...]                                           │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend (Express)                                        │
│    - authMiddleware valida JWT                              │
│    - Extrai tenantId e schema                               │
│    - Conecta DataSource ao schema correto                   │
│    - Passa para OrderController.create()                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Controller (OrderController)                             │
│    - Recebe dados do request                                │
│    - Chama OrderService.create()                            │
│    - Retorna resposta HTTP                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Service (OrderService)                                   │
│    - Valida dados                                           │
│    - Chama OrderRepository.create()                         │
│    - Retorna Order criado                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Repository (OrderRepository)                             │
│    - Usa TypeORM para salvar no banco                       │
│    - Executa INSERT no schema do tenant                     │
│    - Retorna Order com ID                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Database (PostgreSQL)                                    │
│    INSERT INTO tenant_<id>.orders (...)                     │
│    VALUES (...)                                             │
│    RETURNING *;                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Response volta para Frontend                             │
│    HTTP 201 Created                                         │
│    {                                                        │
│      id: 1,                                                 │
│      clientName: "Cliente X",                               │
│      status: "awaiting_cutting",                            │
│      createdAt: "2026-09-15T10:30:00Z"                      │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend atualiza estado                                 │
│    - Adiciona novo pedido à lista                           │
│    - Fecha modal                                            │
│    - Exibe mensagem de sucesso                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL (v12+)
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run dev          # Desenvolvimento
npm run build        # Build
npm start            # Produção
npm test             # Testes
```

### Frontend
```bash
cd frontend
npm install
npm start            # Desenvolvimento (port 3000)
npm run build        # Build
npm test             # Testes
```

---

## 📊 Estatísticas do Projeto

| Métrica | Quantidade |
|---------|-----------|
| Páginas Frontend | 25+ |
| Componentes | 30+ |
| Controllers | 13 |
| Services | 13 |
| Repositories | 11 |
| Entidades | 12+ |
| Endpoints API | 50+ |
| Testes | 7+ |
| Linhas de Código | ~10,000+ |

---

## 🔒 Segurança

### Implementado
- ✅ JWT para autenticação
- ✅ Bcryptjs para hash de senhas
- ✅ CORS configurado
- ✅ Isolamento de dados por tenant
- ✅ Validação de entrada
- ✅ Error handling

### Recomendações
- 🔄 Implementar rate limiting
- 🔄 Adicionar HTTPS em produção
- 🔄 Implementar 2FA (Two-Factor Authentication)
- 🔄 Adicionar logging e auditoria
- 🔄 Implementar backup automático

---

## 📝 Histórico de Commits Recentes

```
09a196d - feat: Add production orders seeding and populate /producao page
2463948 - new realease
0d4fc1c - Implementando a rota de pedidos
27b511e - Implementando o conteudo do dashboard
d0707e8 - -.-
898f131 - -.-
ddf3522 - Implementando o realod na pagina
3f31818 - Implementando as rotas na sidebar
75faf6f - Implementando a autenticacao de usuairo no frontend
da49d56 - Implementando a injecao de dependencia em controller
```

---

## 🎯 Próximos Passos Sugeridos

1. **Melhorias de UX/UI**
   - Implementar dark mode completo
   - Melhorar responsividade mobile
   - Adicionar animações e transições

2. **Funcionalidades**
   - Implementar sistema de permissões (RBAC)
   - Adicionar notificações em tempo real (WebSocket)
   - Implementar relatórios avançados
   - Adicionar integração com sistemas de pagamento

3. **Performance**
   - Implementar cache (Redis)
   - Otimizar queries do banco
   - Implementar paginação
   - Adicionar compressão de dados

4. **Testes**
   - Aumentar cobertura de testes
   - Implementar testes E2E
   - Adicionar testes de performance

5. **DevOps**
   - Containerizar com Docker
   - Implementar CI/CD
   - Configurar monitoring e alertas
   - Implementar backup automático

---

## 📞 Contato e Suporte

- **Repositório**: Git local
- **Status**: Em desenvolvimento ativo
- **Última atualização**: 15 de Setembro de 2026

---

**Análise gerada em**: 15 de Setembro de 2026
**Versão do documento**: 1.0
