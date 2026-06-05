---
inclusion: auto
---

# Contexto do Projeto — Voomp Creators / Squad Sustentação N3

## Quem Somos

A Squad Sustentação N3 é a **última linha de defesa técnica** da plataforma Voomp Creators — edtech/fintech brasileira que conecta infoprodutores (sellers) e compradores (alunos).

Somos responsáveis pela investigação, diagnóstico e correção de bugs em produção escalados pelo N2 via Freshdesk.

**Fluxo operacional:**
> Chamado N2 (Freshdesk) → Triagem → Análise técnica N3 → Implementação → Testes unitários → Validação HML → Deploy PRD via war room

## Stack Técnica

| Tecnologia | Versão | Uso |
|---|---|---|
| PHP | 7.4 | Linguagem principal do back |
| Lumen | ~8 | Framework do back (micro Laravel) |
| MySQL | 5.7/8 | Banco principal |
| Redis | 6 | Cache e filas |
| Vue.js | 2 | Admin Front |
| Kafka | — | Mensageria entre serviços |
| AKS | — | Kubernetes na Azure |
| Pagarme | v4 + v5 | Gateway de pagamentos |
| Gateway V2 | interno | Abstração sobre Pagarme |

## Repositórios

| Repo | Stack | Responsabilidade |
|---|---|---|
| `seller-greenn-back` | PHP 7.4 / Lumen | API Back principal — checkout, pagamentos, webhooks, reembolsos |
| `seller-greenn-adm` | Vue.js | Admin Front — painel do seller |
| `seller-greenn-queues` | PHP | Consumers Kafka — processamento assíncrono |
| `seller-club-back` | PHP | Serviço de acesso ao Club / Voomp Play |
| `marketplace-login` | Next.js | Login Unificado (front) |

Org: `kdop` · Projeto: `PlataformaCogna-MKTP-MVP`

## Frentes de Atuação

| Frente | O que resolvemos | Exemplos reais |
|---|---|---|
| **Checkout & Pagamentos** | Duplicatas, order bumps, idempotência, venda inteligente | VSUS-679, VSUS-650, VSUS-701 |
| **Recorrência & Contratos** | Boleto de assinatura, troca de cartão, ciclos, next_billing | VSUS-628, VSUS-649, VSUS-665 |
| **Webhooks & Integrações** | Memberkit, Cosmos, ActiveCampaign, Anhanguera, Pagarme | VSUS-666, VSUS-688, VSUS-572 |
| **Financeiro & Reembolso** | Estorno ERP, reconciliação, saldo negativo, split | VSUS-715, VSUS-546, VSUS-332 |
| **Relatórios & Admin** | Export charges, dashboard, sub-usuários, e-mails | VSUS-709, VSUS-624, VSUS-700 |

## Tabelas MySQL Principais

| Tabela | O que guarda |
|---|---|
| `sales` | Todas as vendas (tipo, status, gateway, seller) |
| `clients_has_contracts` | Contratos de assinatura recorrente |
| `webhooks` | Disparos de webhooks para integrações |
| `refund_solicitations` | Solicitações de reembolso |
| `products` | Produtos dos sellers |
| `users` | Sellers e compradores |
| `users_has_devices` | Dispositivos para push notification |

## Arquitetura de Pagamentos

| Tipo | Gateway | Fluxo |
|---|---|---|
| TRANSACTION (venda única) | Gateway V2 | Checkout → Gateway → Pagarme v5 |
| SUBSCRIPTION (1ª compra) | SDK Pagarme v4 direto | Checkout → SDK → Pagarme v4 |
| Renovação automática | Pagarme v4 nativo | Não passa pelo checkout |
| Upsell | Gateway V2 | POST /api/upsell |

## Convenção de Branches

| Branch | Resultado |
|---|---|
| `feature/*` | Deploy em DEV automático |
| `feature/fix/VSUS-XXX_descricao` | Padrão para correção de bug |
| `release/*` | Deploy em HML |
| `main` | Deploy em PRD (automático) |
| `hotfix/*` | Deploy em PRD (manual) |

## Time

| Dev | Foco principal | Repo primário |
|---|---|---|
| Tiago Boas | Gateway, push notifications, arquitetura | seller-greenn-back |
| Wisandro Prates | Sub-usuários, Play, Club | seller-greenn-back / seller-club-back |
| Marcos Nery | E-mail, relatórios, webhooks | seller-greenn-back |
| Renata Lopez | Relatórios, export, admin | seller-greenn-back |
| Vanessa Duso | QA — planejamento e execução de testes | todos |
