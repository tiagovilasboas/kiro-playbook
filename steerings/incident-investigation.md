---
inclusion: auto
---

# Investigação de Incidentes N3 — Sustentação

## Fluxo de investigação

1. **Criar subtask "Análise de caso"** — abrir subtask no Jira antes de qualquer consulta técnica
2. **Entender o incidente** — ler o chamado Freshdesk/Jira, identificar seller, produto, venda
3. **Observabilidade** — verificar dashboard Grafana `voomp-sustentacao-l3` nas seções: KPIs gerais (taxa de conversão), Vendas Perdidas (erros 500 em checkout), Webhooks com erro (taxa de entrega, top domínios), Logs de Erro (query Loki)
4. **Reproduzir** — verificar no banco (DEV/HML) ou logs (Grafana/Loki)
5. **Identificar causa raiz** — analisar código, commits recentes, PRs que podem ter sobrescrito
6. **Implementar fix** — branch `feature/fix/VSUS-XXX_descricao`
7. **Testar** — testes unitários + validação manual
8. **Documentar** — preencher Causa Raiz e Resolução no Jira

## Queries úteis (MySQL)

### Vendas duplicadas (últimos 90 dias)
```sql
SELECT client_email, product_id, amount, COUNT(*) as total,
  MIN(created_at) as primeira, MAX(created_at) as ultima,
  TIMESTAMPDIFF(SECOND, MIN(created_at), MAX(created_at)) as diff_s,
  GROUP_CONCAT(id ORDER BY id) as sale_ids
FROM sales
WHERE status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY client_email, product_id, amount
HAVING COUNT(*) > 1 AND diff_s < 300
ORDER BY primeira DESC;
```

### Vendas sem transaction_id
```sql
SELECT id, product_id, status, method, type, created_at
FROM sales
WHERE transaction_id IS NULL AND status = 'waiting_payment'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;
```

### Reembolsos pendentes
```sql
SELECT id, sale_id, status, motive, created_at
FROM refund_solicitations
WHERE status = 'pending'
ORDER BY created_at DESC LIMIT 50;
```

## Logs úteis (Loki via Grafana)

```
# Erros do back principal
{namespace="voomp-creators-back"} |~ "(ERROR|error|Exception)" !~ "\"error\":null"

# Duplicatas bloqueadas pelo middleware
{namespace=~"voomp-creators-.*"} |= "Duplicate request"

# Webhooks com falha
{namespace=~"voomp-creators-.*"} |~ "(?i)webhook" |~ "(error|fail|timeout)"

# Admin Front (sub-usuários, links, permissões)
{namespace="voomp-creators-adm"} |~ "(ERROR|error|Exception)" !~ "\"error\":null"

# Serviço Club/Play (acesso a cursos, cancelamentos)
{namespace="seller-club-back"} |~ "(ERROR|error|Exception)" !~ "\"error\":null"
```

## Verificar se um commit sobrescreveu um fix de incidente

```bash
# Listar commits que alteraram um arquivo específico após uma data
git log origin/main --since="2026-04-27" --all -- "src/app/Helpers/RefundHelper.php"

# Verificar se uma branch está na main
git branch -r --merged origin/main | grep "origin/feature/fix/VSUS-XXX"
```

## Arquitetura de pagamentos (referência rápida)

| Tipo | Gateway | Fluxo |
|------|---------|-------|
| TRANSACTION (venda única) | Gateway V2 (GreennGatewayHelper::pay()) | Checkout → Gateway → Pagarme v5 |
| SUBSCRIPTION (1ª compra) | SDK Pagarme direta ($pagarme->createSubscription()) | Checkout → SDK → Pagarme v4 |
| Renovação automática | Pagarme v4 nativo | Não passa pelo checkout |
| Upsell | Gateway V2 | POST /api/upsell (sem middleware idempotência) |
