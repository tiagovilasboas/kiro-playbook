---
version: 2.0.0
profiles: [all]
description: "Tria incidentes N3 da Voomp Creators: classifica P1-P4, identifica componentes afetados, levanta hipóteses e sugere próximos passos"
---

# Skill: Triagem de Incidente N3

## O que esta skill faz

Analisa o contexto de um incidente escalado pelo N2, classifica a severidade (P1–P4) com base nos critérios reais da Voomp Creators, identifica os componentes afetados, levanta hipóteses de causa raiz ordenadas por probabilidade e sugere próximos passos para contenção.

O primeiro passo é sempre consultar o dashboard Grafana `voomp-sustentacao-l3` antes de qualquer outra fonte.

## Como usar

```
"Preciso triar este incidente: [cole o contexto/logs/chamado aqui]"
```

## Entrada esperada

- **Chamado Freshdesk** — número, descrição, seller afetado
- **Logs** — Loki via Grafana, stack trace, output de monitoramento
- **Comportamento observado** — o que está falhando, o que está degradado
- **Horário de início** — quando foi detectado
- **Volume** — erros/min, sellers afetados, chamados abertos
- **Ações já realizadas** — o que foi tentado

> Forneça o que tiver. A skill indica o que ainda falta coletar.

---

## Tabela de severidades — Voomp Creators N3

| Severidade | Critério | SLA | Exemplos reais |
|---|---|---|---|
| **P1** | Checkout/pagamento fora do ar · Recorrência parada em massa · Perda de dados em PRD | 2h | Erros 500 em `/checkout/payment`, `clients_has_contracts` não gerando |
| **P2** | Webhooks com falha ≥50% do volume · Reembolsos não processando · Acesso a alunos não sendo removido/liberado · Notificações push offline | 2h | VSUS-701 (push offline), VSUS-688 (webhooks), VSUS-490 (acesso Play não removido) |
| **P3** | Relatórios com dados incorretos · Admin degradado sem perda financeira imediata · E-mails transacionais não disparando para casos pontuais | 8h | VSUS-709 (export charges), VSUS-624 (e-mail chargeback), VSUS-649 (boleto assinatura) |
| **P4** | Incidente visual · Edge case de baixo volume · Workaround disponível | Agendamento normal | Divergência de layout, caso isolado de 1 seller sem impacto financeiro |

---

## Mapeamento de componentes → severidade padrão

| Frente | Componentes principais | Severidade padrão |
|---|---|---|
| **Checkout & Pagamentos** | `PaymentController`, `CreditCardPayment`, `BoletoPayment`, `GreennGatewayHelper` | P1 se checkout fora do ar, P2 se parcial |
| **Recorrência & Contratos** | `clients_has_contracts`, `SubscriptionPayment`, cronjobs de cobrança | P1 se renovações paradas, P2 se casos isolados |
| **Webhooks & Integrações** | `WebhookController`, `GreennWebhook`, Memberkit, Cosmos, eNotas | P2 se taxa entrega caiu, P3 se integração específica |
| **Financeiro & Reembolso** | `RefundHelper`, `refund_solicitations`, ERP, conciliação Pagar.me | P2 se reembolsos parados, P3 se casos pontuais |
| **Relatórios & Admin** | `ExportService`, `FutureSalesProjection`, sub-usuários, e-mails | P3 geralmente, P2 se impacto financeiro direto |
| **Acesso Play/Club** | `seller-club-back`, `course_class_students`, `ReleaseRuleHelper` | P2 se alunos com acesso indevido ou sem acesso após pagamento |
| **Push Notifications** | `OneSignal`, `users_has_devices`, app iOS/Android | P2 (impacto em engajamento dos sellers) |

---

## Primeiro passo: Grafana `voomp-sustentacao-l3`

Antes de qualquer outra fonte, verificar:

| Seção | Query relevante | O que detecta |
|---|---|---|
| **KPIs gerais** | `COUNT(*) WHERE status='paid'` vs tentativas | Taxa de conversão caiu? |
| **Vendas Perdidas** | `\|= "LogMiddleware.response" \|= "status\":500"` em endpoints de checkout | Apagão de pagamento |
| **Webhooks** | `JSON_EXTRACT(response,'$.statusCode') NOT LIKE '2%'` | Taxa de entrega e top domínios falhando |
| **Logs de Erro** | `{namespace="voomp-creators-back"} \|~ "(ERROR\|Exception)"` | Exceções recentes na API |
| **Assinaturas** | `status IN ('unpaid','pending_payment')` em `clients_has_contracts` | Inadimplência subindo |
| **Reembolsos** | `status='pending'` em `refund_solicitations` | Cronjob de reembolso parado |

---

## Saída esperada da skill

1. **Severidade** (P1–P4) com justificativa baseada nos critérios da Voomp
2. **Componentes afetados** — serviços, tabelas, endpoints identificados
3. **Hipóteses de causa raiz** — ordenadas por probabilidade com raciocínio
4. **Próximos passos** — contenção imediata e investigação
5. **Informações faltantes** — o que ainda precisa ser coletado

---

## Exemplos reais

### Exemplo 1: Push notifications não chegando (VSUS-701)

```
Preciso triar este incidente:
9 chamados de sellers reclamando que não recebem notificações push no app.
E-mails chegam normalmente. Início: há ~30 dias (04/05/2026).
Serviço: app Voomp Creator (iOS e Android).
```

**Triagem esperada:**

- **Severidade: P2** — notificações push offline impactam engajamento de ~4.300 sellers, mas não bloqueia vendas
- **Componente:** integração OneSignal → `users_has_devices` → app
- **Hipótese [Alta]:** OneSignal passou a exigir `Authorization` header sem aviso — e-mail funciona (gateway diferente), push não (SDK OneSignal)
- **Próximos passos:** verificar Loki para logs da chamada OneSignal, checar se `Authorization` header está presente nas requests
- **Faltando:** data exata do início, logs Loki do serviço de notificações

---

### Exemplo 2: Exportação de vendas falhando (VSUS-709)

```
Preciso triar:
Sellers não conseguem exportar relatório de vendas com "Exportar próximas faturas" ativado.
Job vai para FAILED. Sem a flag, funciona. 13 falhas em 7 dias.
```

**Triagem esperada:**

- **Severidade: P3** — relatório incorreto, sem perda financeira imediata, workaround disponível (desativar flag)
- **Componente:** `FutureSalesProjection`, `ExportService`, `users_queues`
- **Hipótese [Alta]:** `Carbon::parse(NULL)` em `paid_at` quando boleto ainda não foi pago — exception não tratada seta job como FAILED
- **Próximos passos:** query em `users_queues WHERE status='FAILED' AND export_charges=true`, verificar vendas com `paid_at IS NULL` e `type='SUBSCRIPTION'`
