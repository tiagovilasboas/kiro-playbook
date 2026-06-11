---
inclusion: always
---

# Contexto do Projeto — seller-greenn-back

## Stack
- **Linguagem:** PHP 8 em PRD (confirmado via stacktrace — Warning convertido em exception). PHP 7.4.33 no Docker local (ver `php.Dockerfile`). Versão exata de DEV/HML não confirmada.
- **Framework:** Lumen (Laravel micro-framework)
- **Banco:** MySQL (voompcreators_back_[env])
- **Cache:** Redis (provavelmente compartilhado entre pods — confirmado via teste de idempotência, não verificado diretamente em infra)
- **Infra:** AKS (Azure Kubernetes Service)
- **Gateway:** Pagarme v4 (assinaturas) + Gateway V2/Pagarme v5 (transações) — fonte: Confluence spike migração, não revalidado
- **Mensageria:** Kafka (via consumers — repo seller-greenn-queues, não verificado se ainda ativo)
- **CI/CD:** Azure Pipelines (YAML)

## Estrutura principal

```
src/
├── app/
│   ├── Http/Controllers/     # Controllers (PaymentController, SaleController, etc.)
│   ├── Http/Middleware/       # Middlewares (IdempotencyPayMiddleware, LogMiddleware, etc.)
│   ├── PaymentGateways/      # Gateways de pagamento (CreditCardPayment, BoletoPayment, PixPayment)
│   ├── Helpers/              # Utilitários (SaleUtils, RefundHelper, PagarMe, Email, Export)
│   ├── Services/             # Serviços de domínio
│   └── Enums/                # Enums (SaleStatusEnum, SaleMethodEnum, etc.)
├── routes/web.php            # Todas as rotas da API
├── config/                   # Configurações (database, pagarme, kafka, etc.)
└── tests/Unit/               # Testes unitários
```

## Rotas importantes

| Rota | Middleware | Uso |
|------|-----------|-----|
| `POST /api/payment` | `idempotencyPay` | Checkout (pagamento principal) |
| `POST /api/upsell` | — | Order bump / upsell |
| `POST /api/extern/payment` | — | Pagamento via parceiros |
| `POST /gateway/webhook` | — | Webhook do gateway |
| `POST /webhook/pix` | — | Webhook PIX |
| `GET /FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy` | — | Healthcheck (status + pod_name) |

## Tabelas principais (MySQL)

| Tabela | Uso |
|--------|-----|
| `sales` | Vendas (status, amount, method, transaction_id, bump_id) |
| `clients_has_contracts` | Assinaturas (subscription_id, status, card_id) |
| `products` | Produtos (name, slug, type, bump_description) |
| `webhooks` | Registro de webhooks enviados/recebidos |
| `refund_solicitations` | Solicitações de reembolso |
| `leads` | Leads do checkout (abandono, conversão) |
| `antecipation_requests` | Antecipações financeiras |

## Docker local

```bash
# Subir o ambiente
docker-compose -f docker-compose.local.yml up -d

# Container PHP
docker exec -it voomp-back-php bash

# Rodar testes
docker exec voomp-back-php php vendor/bin/phpunit --no-coverage
```

## Equipe

| Nome | Foco principal |
|------|---------------|
| Tiago Vilas Boas (TL) | Checkout, idempotência, observabilidade, investigação |
| Luis Augusto Pardini (Guto) | Export, relatórios, serviços |
| Fabio Martins | Recorrência, contratos, reembolso |
| Marcos Nery | Checkout, order bumps, boleto, emails |
| Wisandro Prates | Gateway, Cosmos, reconciliação |
| Vanessa Duso | QA — cenários de teste, validação |
| Glenda Cassettari | Coordenação |
