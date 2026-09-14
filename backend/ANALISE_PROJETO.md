# Análise do Projeto NotaFacil - Backend

## 📋 Visão Geral

**NotaFacil** é um sistema backend desenvolvido em **Node.js com TypeScript** que gerencia operações comerciais de uma empresa de manufatura/produção. O projeto implementa uma arquitetura **multi-tenant** com isolamento de dados por schema PostgreSQL.

**Stack Tecnológico:**
- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework Web:** Express.js v5.2.1
- **ORM:** TypeORM v1.1.1
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (jsonwebtoken)
- **Criptografia:** bcryptjs
- **Email:** Mailjet
- **Testes:** Node.js built-in test runner com Sinon

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/
├── app.ts                 # Configuração Express
├── server.ts              # Entry point da aplicação
├── config/                # Configurações (env)
├── controllers/           # Controladores (13 arquivos)
├── database/              # DataSource e migrations
├── dto/                   # Data Transfer Objects
├── entities/              # Entidades TypeORM
│   ├── public/           # Entidades públicas (Tenant)
│   └── tenant/           # Entidades por tenant (User, Order, etc)
├── middlewares/           # Middlewares Express
├── repositories/          # Repositories (acesso a dados)
├── routes/                # Definição de rotas
├── services/              # Lógica de negócio
├── tests/                 # Testes unitários
└── utils/                 # Utilitários (JWT, mailer, slug)
```

### Padrão Arquitetural: MVC + Repository

A aplicação segue o padrão **MVC com Repository Pattern**:

```
Request → Routes → Controller → Service → Repository → Database
                                  ↓
                            Business Logic
```

**Fluxo de Dados:**
1. **Routes** - Definem endpoints e aplicam middlewares
2. **Controllers** - Recebem requisições e chamam serviços
3. **Services** - Contêm lógica de negócio
4. **Repositories** - Abstraem acesso ao banco de dados
5. **Entities** - Modelos de dados com decoradores TypeORM

---

## 🔐 Multi-Tenancy

### Implementação

O sistema implementa **multi-tenancy por schema PostgreSQL**:

**Tabelas Públicas (Schema `public`):**
- `tenants` - Registro de empresas/tenants

**Tabelas por Tenant (Schema dinâmico):**
- Cada tenant tem seu próprio schema (ex: `tenant_abc123`)
- Contém todas as tabelas de negócio isoladas

### Fluxo de Autenticação

```
1. Registro (Register)
   ├─ Cria novo Tenant
   ├─ Cria schema PostgreSQL
   └─ Cria usuário no schema do tenant

2. Login
   ├─ Busca tenants onde email existe
   ├─ Se múltiplos matches → requer seleção
   ├─ Valida credenciais
   └─ Retorna JWT com schema do tenant

3. Requisições Autenticadas
   ├─ Middleware extrai JWT
   ├─ Obtém schema do tenant
   └─ Conecta ao schema correto para operações
```

### JWT Payload

```typescript
{
  sub: string;        // User ID
  tenantId: string;   // Tenant ID
  schema: string;     // Schema name (ex: "tenant_abc123")
}
```

---

## 📊 Entidades Principais

### 1. **Tenant** (Public Schema)
```typescript
- id: UUID
- name: string
- slug: string (único)
- schemaName: string (único)
- createdAt, updatedAt
```

### 2. **User** (Tenant Schema)
```typescript
- id: UUID
- name: string
- email: string (único)
- password: string (hashed)
- resetToken: string | null
- resetTokenExpires: Date | null
- orders: Order[] (relação 1:N)
- createdAt, updatedAt
```

### 3. **Order** (Tenant Schema)
```typescript
- id: number
- clientName: string
- status: OrderStatus (enum)
  - awaiting_cutting
  - in_production
  - invoiced
  - finished
  - cancelled
- notes: string | null
- deliveryDate: date | null
- createdBy: User (relação N:1)
- items: OrderItem[] (relação 1:N)
- financialTransactions: FinancialTransaction[] (relação 1:N)
- createdAt, updatedAt
```

### 4. **OrderItem** (Tenant Schema)
- Itens individuais de uma Order
- Referencia Product

### 5. **Invoice** (Tenant Schema)
```typescript
- id: number
- number: string (único)
- clientName: string
- status: InvoiceStatus (issued | cancelled)
- issueDate: date
- total: decimal(12,2)
- notes: string | null
- order: Order | null (relação N:1)
- createdAt, updatedAt
```

### 6. **Product** (Tenant Schema)
- Produtos disponíveis para pedidos

### 7. **Client** (Tenant Schema)
- Clientes da empresa

### 8. **Supplier** (Tenant Schema)
- Fornecedores

### 9. **Supply** (Tenant Schema)
- Suprimentos/insumos

### 10. **Production** (Tenant Schema)
- Registros de produção

### 11. **FinancialTransaction** (Tenant Schema)
- Transações financeiras
- Recentemente adicionado: campo `paymentMethod`

---

## 🔌 Endpoints Principais

### Autenticação (`/auth`)
- `POST /auth/register` - Registrar novo tenant + usuário
- `POST /auth/login` - Login com seleção de tenant
- `POST /auth/forgot-password` - Solicitar reset de senha
- `POST /auth/reset-password` - Resetar senha

### Usuários (`/users`)
- CRUD de usuários

### Pedidos (`/orders`)
- CRUD de pedidos
- Gerenciamento de status

### Invoices (`/invoices`)
- CRUD de notas fiscais
- Emissão e cancelamento

### Financeiro (`/financial`)
- Transações financeiras
- Relatórios

### Produtos (`/products`)
- CRUD de produtos

### Clientes (`/clients`)
- CRUD de clientes

### Fornecedores (`/suppliers`)
- CRUD de fornecedores

### Suprimentos (`/supplies`)
- CRUD de suprimentos

### Produção (`/productions`)
- Registros de produção

### Caixa (`/caixa`)
- Gerenciamento de caixa/fluxo de caixa

---

## 🔒 Segurança

### Autenticação
- **JWT** com expiração configurável (padrão: 1 dia)
- **Bcrypt** para hash de senhas (10 rounds)
- **Reset Token** com hash SHA256 e expiração

### Autorização
- **Middleware de Autenticação** valida JWT em rotas protegidas
- **Isolamento de Tenant** garante que usuários acessem apenas seus dados

### Variáveis de Ambiente
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

---

## 📦 Dependências Principais

### Produção
| Pacote | Versão | Propósito |
|--------|--------|----------|
| express | ^5.2.1 | Framework web |
| typeorm | ^1.1.1 | ORM para PostgreSQL |
| pg | ^8.23.0 | Driver PostgreSQL |
| jsonwebtoken | ^9.0.3 | Autenticação JWT |
| bcryptjs | ^3.0.3 | Hash de senhas |
| cors | ^2.8.6 | CORS middleware |
| dotenv | ^17.4.2 | Variáveis de ambiente |
| node-mailjet | ^6.0.11 | Envio de emails |
| reflect-metadata | ^0.2.2 | Decoradores TypeScript |

### Desenvolvimento
| Pacote | Versão | Propósito |
|--------|--------|----------|
| typescript | ^5.9.3 | Compilação TypeScript |
| ts-node | ^10.9.2 | Execução TypeScript |
| ts-node-dev | ^2.0.0 | Watch mode com reload |
| sinon | ^22.1.0 | Mocking para testes |
| @types/* | Várias | Type definitions |

---

## 🧪 Testes

### Estrutura de Testes
- **Framework:** Node.js built-in test runner
- **Mocking:** Sinon
- **Localização:** `src/tests/`

### Testes Existentes
1. `auth.service.test.ts` - Testes de autenticação
2. `client.service.test.ts` - Testes de clientes
3. `order.service.test.ts` - Testes de pedidos
4. `product.service.test.ts` - Testes de produtos
5. `user.service.test.ts` - Testes de usuários
6. `tenant-isolation.test.ts` - Testes de isolamento de tenant
7. `user-email-uniqueness.test.ts` - Testes de unicidade de email

### Executar Testes
```bash
npm test
```

---

## 🚀 Scripts Disponíveis

```bash
npm run dev                    # Inicia servidor em modo desenvolvimento com watch
npm run build                  # Compila TypeScript para dist/
npm start                      # Inicia servidor compilado
npm run typeorm               # CLI do TypeORM
npm run seed:orders           # Popula dados de teste (orders)
npm run migration:generate    # Gera migration baseada em mudanças
npm run migration:run         # Executa migrations pendentes
npm run migration:revert      # Reverte última migration
npm test                      # Executa testes
```

---

## 📝 Configuração TypeScript

- **Target:** ES2022
- **Module:** CommonJS
- **Strict Mode:** Habilitado
- **Decorators:** Habilitados (para TypeORM)
- **Emit Metadata:** Habilitado (para TypeORM)

---

## 🔄 Fluxo de Desenvolvimento

### 1. Desenvolvimento Local
```bash
npm install
# Configurar .env
npm run dev
```

### 2. Criar Nova Feature
```bash
# 1. Criar entidade em src/entities/tenant/
# 2. Criar repository em src/repositories/
# 3. Criar service em src/services/
# 4. Criar controller em src/controllers/
# 5. Criar routes em src/routes/
# 6. Adicionar rota em src/routes/index.ts
# 7. Criar testes em src/tests/
```

### 3. Migrations
```bash
# Após alterar entidades:
npm run migration:generate -- -n NomeMigration
npm run migration:run
```

### 4. Build e Deploy
```bash
npm run build
npm start
```

---

## 🐛 Tratamento de Erros

- **Error Handler Middleware** centralizado em `src/middlewares/error-handler.ts`
- Retorna respostas JSON padronizadas
- Logging de erros

---

## 📧 Integração com Email

- **Provedor:** Mailjet
- **Uso:** Envio de emails de reset de senha
- **Localização:** `src/utils/mailer.ts`

---

## 🔗 Relacionamentos de Dados

```
Tenant (1) ──────────────────────────────────────────────────────────┐
                                                                      │
                                                                      │
User (N) ──────────────────────────────────────────────────────────┐ │
  │                                                                 │ │
  └──> Order (N)                                                   │ │
         │                                                         │ │
         ├──> OrderItem (N) ──> Product (1)                       │ │
         │                                                         │ │
         └──> FinancialTransaction (N)                            │ │
                                                                   │ │
Client (N) ────────────────────────────────────────────────────────┤ │
                                                                   │ │
Supplier (N) ──────────────────────────────────────────────────────┤ │
                                                                   │ │
Supply (N) ────────────────────────────────────────────────────────┤ │
                                                                   │ │
Production (N) ────────────────────────────────────────────────────┤ │
                                                                   │ │
Invoice (N) ──> Order (1)                                         │ │
                                                                   │ │
FinancialTransaction (N) ──> Order (1)                            │ │
                                                                   │ │
Todos os acima estão no schema do Tenant ────────────────────────┘ │
                                                                    │
Tenant está no schema public ──────────────────────────────────────┘
```

---

## 📊 Estatísticas do Projeto

- **Arquivos TypeScript:** ~70 arquivos
- **Controllers:** 13
- **Services:** 13
- **Repositories:** 11
- **Entidades:** 11
- **Routes:** 12
- **Testes:** 7 arquivos de teste

---

## 🎯 Pontos-Chave da Arquitetura

1. **Multi-Tenancy Robusta** - Isolamento por schema PostgreSQL
2. **Separação de Responsabilidades** - Controllers, Services, Repositories bem definidos
3. **Type Safety** - TypeScript strict mode
4. **Autenticação Segura** - JWT + Bcrypt
5. **Testes Unitários** - Cobertura de funcionalidades críticas
6. **Migrations Versionadas** - Controle de schema com TypeORM
7. **Tratamento Centralizado de Erros** - Middleware de erro
8. **Configuração por Ambiente** - Suporte a .env

---

## 🚨 Observações Importantes

1. **Secrets em Produção:** Alterar `JWT_SECRET` em produção
2. **Email:** Configurar credenciais Mailjet para envio real
3. **Database:** Usar credenciais seguras em produção
4. **CORS:** Configurar `FRONTEND_URL` corretamente
5. **Logging:** Considerar adicionar logger estruturado (winston, pino)
6. **Rate Limiting:** Considerar adicionar rate limiting em produção
7. **Validação:** Considerar adicionar validação de DTOs com class-validator

---

## 📚 Próximos Passos Sugeridos

1. Adicionar validação de DTOs com `class-validator`
2. Implementar logging estruturado
3. Adicionar rate limiting
4. Melhorar cobertura de testes
5. Adicionar documentação Swagger/OpenAPI
6. Implementar cache (Redis)
7. Adicionar health checks mais robustos
8. Implementar auditoria de mudanças

---

**Última Atualização:** 14 de Setembro de 2026
**Versão do Projeto:** 1.0.0
