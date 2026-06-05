# Prompt: Investigate Incident N3

**Quando usar:** Ao receber um chamado do N2 e precisar investigar a causa raiz do incidente.

**Requer MCP:** Jira + Grafana (opcional — sem MCP, o Kiro orienta os passos manuais)

---

## Prompt

Cole no chat do Kiro:

```
Preciso investigar um incidente N3. Execute este workflow completo:

1. IDENTIFICAR: Qual a task VSUS? (ex: VSUS-701) ou descreva o sintoma
2. CONTEXTO JIRA: Busque no Jira a descrição, comentários, sellers afetados e volumetria
3. OBSERVABILIDADE (Grafana dashboard voomp-sustentacao-l3):
   - KPIs gerais: taxa de conversão caiu?
   - Vendas Perdidas: erros 500 no checkout?
   - Webhooks: taxa de entrega caiu? top domínios com falha?
   - Logs de Erro: exceções recentes?
4. CÓDIGO: Identifique arquivos relevantes baseado no sintoma:
   - Checkout → PaymentController, CreditCardPayment, BoletoPayment, PixPayment
   - Webhooks → GreennWebhook, WebhookController
   - Assinaturas → clients_has_contracts, SubscriptionPayment
   - Reembolso → RefundHelper, refund_solicitations
   - Admin/Sub-usuários → SubUserHelper, SubUserMiddleware
5. BANCO: Sugira queries MySQL para validar hipóteses
6. HIPÓTESES: Liste 2-3 causas raiz ordenadas por probabilidade com raciocínio
7. PLANO: Próximos passos para confirmar e corrigir

Stack: PHP 7.4/Lumen | MySQL | Redis | Pagarme v4/v5 | Gateway V2 | Kafka
Tabelas chave: sales, clients_has_contracts, webhooks, refund_solicitations
```

---

## Sem MCP configurado

O Kiro vai orientar os passos manuais:
- Como acessar o Jira pelo browser
- Queries SQL para rodar no DBeaver (banco DEV: 10.84.0.85)
- Como navegar no Grafana manualmente para cada seção do dashboard `voomp-sustentacao-l3`
