---
inclusion: manual
---

# Grafana — Observabilidade & Queries (Sustentação N3)

## Dashboard principal
- URL: https://monitoring.voompcreators.com.br/d/voomp-sustentacao-l3
- UID: voomp-sustentacao-l3

## Datasources

| Nome | UID | Tipo | Ambiente | Uso |
|------|-----|------|----------|-----|
| ADMIN PRD REPLICA | dffty7wyygw00c | MySQL | PRD | Queries banco PRD (read-only) |
| Loki - Dev | P23B868E2F845ACEC | Loki | DEV | Logs de aplicação em DEV |
| Loki - Hml | PECD81ACA3B4E83B5 | Loki | HML | Logs de aplicação em HML |
| Loki - Prd | P82641446A07FFD78 | Loki | PRD | Logs de aplicação em PRD |
| loki - str | bflsa38540kjkf | Loki | STR | Logs de aplicação em STR |
| Prometheus | P25C19437FC9843A9 | Prometheus | — | Métricas de infra |

### Qual Loki usar

| Situação | Datasource | UID |
|----------|------------|-----|
| Investigar bug em PRD | Loki - Prd | `P82641446A07FFD78` |
| Validar fix deployado em DEV | Loki - Dev | `P23B868E2F845ACEC` |
| Validar fix em HML antes de PRD | Loki - Hml | `PECD81ACA3B4E83B5` |
| Teste de stress/carga | loki - str | `bflsa38540kjkf` |

> **IMPORTANTE:** Todos os ambientes (DEV, HML, PRD, STR) têm datasource Loki disponível no Grafana. Ao investigar logs, usar o UID do ambiente correto.

## Executar queries MySQL via API

```json
POST /api/ds/query
{
  "queries": [{
    "refId": "A",
    "datasource": {"uid": "dffty7wyygw00c", "type": "mysql"},
    "rawSql": "SELECT ... LIMIT 100",
    "format": "table"
  }],
  "from": "now-1h",
  "to": "now"
}
```

## Schema — Tabelas Principais

| Tabela | Campos-chave | Uso |
|--------|-------------|-----|
| sales | id, product_id, seller_id, status, amount, method | Vendas |
| users | id, name, email, cpf_cnpj | Sellers |
| users_has_devices | user_id, hash (player_id), active | Push |
| webhooks | url, body, response, sale_id | Webhooks |
| users_queues | user_id, status, type | Jobs export |
| clients_has_contracts | subscription_id, status, card_id | Assinaturas |

## Queries úteis

### Vendas pagas no período
```sql
SELECT COUNT(*) FROM sales WHERE created_at >= NOW() - INTERVAL 7 DAY AND status='paid'
```

### Exports com FAILED
```sql
SELECT id, user_id, status, created_at FROM users_queues WHERE status = 'FAILED' ORDER BY created_at DESC LIMIT 20
```

### Devices push ativos
```sql
SELECT COUNT(DISTINCT user_id) FROM users_has_devices WHERE active = 1
```

### Webhooks OneSignal recentes
```sql
SELECT id, response, sale_id, created_at FROM webhooks WHERE url LIKE '%onesignal%' ORDER BY id DESC LIMIT 10
```

### Duplicatas (idempotência)
```sql
SELECT client_email, product_id, amount, COUNT(*) as total, GROUP_CONCAT(id) as ids
FROM sales WHERE status='paid' AND created_at >= NOW() - INTERVAL 90 DAY
GROUP BY client_email, product_id, amount
HAVING COUNT(*) > 1 ORDER BY total DESC LIMIT 20
```

## Loki — Erros 500
```
sum(count_over_time({namespace="voomp-creators-back"} |= "\"status\":500" [$__auto]))
```

## Boas práticas
- Sempre usar `LIMIT` (tabelas grandes: sales, webhooks, account_statements)
- Filtrar por data quando possível (`WHERE created_at >= NOW() - INTERVAL X DAY`)
- Réplica é read-only (apenas SELECT)
- `$__timeFilter(created_at)` dentro de painéis Grafana
