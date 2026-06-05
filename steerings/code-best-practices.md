---
inclusion: fileMatch
fileMatchPattern: "src/app/**/*.php"
---

# Boas Práticas de Código — Sustentação N3

## Princípios

**KISS** — Keep It Simple. A correção mais simples que resolve o problema é a certa. Se o fix precisa de uma nova abstraction layer, questione.

**YAGNI** — You Aren't Gonna Need It. Não adicione "por via das dúvidas". Cada linha extra em código de sustentação é uma linha que pode introduzir regressão.

**DRY** — Don't Repeat Yourself. Se você está copiando lógica de outro método, extraia para um helper. Mas só se o reuso for real — não crie abstração prematura.

**Clean Code** — Nomes descritivos valem mais que comentários. `$paidSubscriptions` é melhor que `$arr`. Métodos devem fazer uma coisa só.

## Convenções de Naming

| Contexto | Convenção | Exemplo |
|---|---|---|
| Classes | PascalCase | `RefundHelper`, `PaymentController` |
| Métodos | camelCase | `processRefund()`, `getActiveSales()` |
| Variáveis | snake_case | `$sale_id`, `$paid_at` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Tabelas MySQL | snake_case | `clients_has_contracts` |
| Colunas MySQL | snake_case | `transaction_id`, `webhook_resend_id` |

## Error Handling

```php
// ✅ Correto — exceção tipada, log com contexto, HTTP status adequado
try {
    $result = $this->gateway->charge($payload);
} catch (GatewayTimeoutException $e) {
    Log::error('gateway.timeout', ['sale_id' => $saleId, 'error' => $e->getMessage()]);
    return response()->json(['error' => 'gateway_timeout'], 504);
} catch (\Exception $e) {
    Log::error('gateway.unexpected', ['sale_id' => $saleId, 'error' => $e->getMessage()]);
    return response()->json(['error' => 'internal_error'], 500);
}

// ❌ Errado — engole exceção silenciosamente
try {
    $result = $this->gateway->charge($payload);
} catch (\Exception $e) {
    // silêncio
}
```

## Padrões MySQL

```php
// ✅ Query parametrizada — obrigatório
$sales = DB::select('SELECT id FROM sales WHERE seller_id = ? AND status = ?', [$sellerId, 'paid']);

// ❌ Concatenação — nunca
$sales = DB::select("SELECT id FROM sales WHERE seller_id = $sellerId");

// ✅ Índice: toda coluna usada em WHERE/JOIN frequente deve ter índice
// Colunas sem índice nesta codebase causaram N+1 e timeouts em PRD
// Candidatas comuns: seller_id, status, transaction_id, created_at
```

## Padrões Redis

```php
// ✅ TTL obrigatório em toda chave de cache
Cache::put("sale_status_{$saleId}", $status, now()->addMinutes(5));

// ❌ Sem TTL — key fica para sempre, causa OOM em produção
Cache::put("sale_status_{$saleId}", $status);
```

## Code Review Mental (antes de abrir PR)

- [ ] O fix resolve o problema sem introduzir side effects?
- [ ] Há teste unitário cobrindo o caso corrigido?
- [ ] Tem `Log::error` em todo caminho de falha?
- [ ] Queries novas têm índice na coluna de filtro?
- [ ] Sem `console.log`, `var_dump`, `dd()` ou código de debug?
- [ ] O impacto em outros módulos foi avaliado?
