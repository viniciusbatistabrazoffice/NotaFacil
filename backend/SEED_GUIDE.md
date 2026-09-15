# Guia de Seed de Dados - NotaFacil Backend

## Visão Geral

Este documento descreve como popular o banco de dados com dados de teste para desenvolvimento e testes.

## Scripts de Seed Disponíveis

### 1. Seed de Produtos
```bash
npm run seed:products
```

**O que faz:**
- Cria 20 produtos de exemplo para cada tenant
- Produtos incluem: camisetas, calças, vestidos, jalecos, etc.
- Cada produto tem nome, código, categoria, preço e tamanhos

**Quando usar:**
- Na primeira configuração do projeto
- Quando você deletar todos os produtos e quiser restaurá-los

---

### 2. Seed de Pedidos
```bash
npm run seed:orders
```

**O que faz:**
- Cria 10 pedidos de exemplo para cada tenant
- Cada pedido tem:
  - Nome do cliente
  - Status (Aguardando Corte, Em Produção, Faturado, Finalizado)
  - Itens do pedido com produtos e quantidades
  - Data de entrega
  - Notas opcionais

**Quando usar:**
- Na primeira configuração do projeto
- Quando você quiser dados de pedidos para testar

---

### 3. Seed de Ordens de Produção (NOVO)
```bash
npm run seed:productions
```

**O que faz:**
- Cria ordens de produção baseadas nos pedidos existentes
- Cada ordem de produção tem:
  - Nome do cliente (do pedido associado)
  - Nome do produto (primeiro item do pedido)
  - Etapa de produção (Corte, Costura, Acabamento, Embalagem, Pronto)
  - Progresso (0-100%)
  - Data de entrega (do pedido associado)
  - Referência ao pedido original

**Quando usar:**
- Após criar os pedidos com `npm run seed:orders`
- Para popular a página `/producao` com dados

**Importante:**
- Este script depende de pedidos já existentes
- Execute `npm run seed:orders` antes de executar este script

---

## Ordem Recomendada de Execução

Para uma configuração completa do banco de dados:

```bash
# 1. Criar produtos
npm run seed:products

# 2. Criar pedidos
npm run seed:orders

# 3. Criar ordens de produção
npm run seed:productions
```

---

## Estrutura de Dados

### Produtos
- **Campos:** name, code, category, price, sizes
- **Exemplo:** 
  ```json
  {
    "name": "Camiseta Básica Algodão",
    "code": "CAM-001",
    "category": "Camisetas",
    "price": 18.90,
    "sizes": "P, M, G, GG"
  }
  ```

### Pedidos
- **Campos:** clientName, status, deliveryDate, notes, items[]
- **Statuses:** awaiting_cutting, in_production, invoiced, finished, cancelled
- **Items:** productName, quantity, unitPrice

### Ordens de Produção
- **Campos:** product, client, stage, progress, dueDate, orderId
- **Stages:** cutting, sewing, finishing, packaging, done
- **Progress:** 0-100 (%)

---

## Dados por Tenant

Os scripts de seed criam dados para todos os tenants existentes no banco:

- empresa-a
- empresa-b
- empresa-c
- empresa-d
- empresa-c-2d40
- empresa-a-a365

Se um tenant já possui dados, o script pula e não duplica.

---

## Troubleshooting

### Erro: "Tenant não encontrado"
- Certifique-se de que há tenants criados no banco
- Execute `npm run seed:orders` antes de `npm run seed:productions`

### Erro: "Já possui X produtos"
- Os scripts verificam se já existem dados
- Para recriar, você precisa deletar manualmente do banco ou criar um novo tenant

### Dados não aparecem na interface
- Certifique-se de estar logado com um usuário do tenant correto
- Verifique se o token JWT é válido
- Verifique o console do navegador para erros de API

---

## Desenvolvimento Futuro

Possíveis melhorias para os scripts de seed:

- [ ] Adicionar seed de clientes
- [ ] Adicionar seed de fornecedores
- [ ] Adicionar seed de insumos
- [ ] Adicionar seed de transações financeiras
- [ ] Criar script para limpar todos os dados
- [ ] Adicionar opções de linha de comando para customizar quantidade de dados
