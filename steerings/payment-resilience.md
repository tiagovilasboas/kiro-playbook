---
inclusion: fileMatch
fileMatchPattern: "*Payment*.php,*Gateway*.php,*PagarMe*.php"
---

# Resiliência em Pagamentos — Padrões Obrigatórios

## Contexto

Este arquivo é carregado automaticamente quando qualquer arquivo de pagamento/gateway é aberto. O checkout da Voomp processa dinheiro real — erros silenciosos geram cobrança dupla, perda de venda ou chargeback.

## Regras de Ouro

### 1. Nunca engolir exception de gateway

```php
// ❌ PROIBIDO — venda fica com transaction_id = NULL
try {
    $response = $pagarme->createSubscription($data);
} catch (\Throwable $e) {
    Log::error('erro', [$e->getMessage()]);
}

// ✅ OBRIGATÓRIO — atualiza status e propaga
try {
    $response = $pagarme->createSubscription($data);
    if (empty($response->id)) {
        throw new \RuntimeException('Gateway returned empty response');
    }
} catch (\Throwable $e) {
    Log::error(__METHOD__ . ' failed', [
        'sale_id' => $sale->id,
        'error' => $e->getMessage()
    ]);
    $sale->update(['status' => 'refused', 'error_code' => $e->getCode()]);
    throw $e;
}
```

### 2. Sempre verificar resposta do gateway

```php
// ❌ Assume que response tem os campos
$sale->transaction_id = $response->charge_id;

// ✅ Valida antes de usar
$chargeId = $response->charge_id ?? null;
if (!$chargeId) {
    Log::error('Gateway response missing charge_id', ['sale_id' => $sale->id]);
    // tratar o cenário
}
$sale->transaction_id = $chargeId;
```

### 3. Idempotência em endpoints de pagamento

Qualquer endpoint que cria venda ou cobrança DEVE ter proteção contra duplicatas:
- `POST /payment` → tem `idempotencyPay` ✅
- `POST /upsell` → ⚠️ PRECISA adicionar
- `POST /extern/payment` → avaliar necessidade

### 4. Timeout explícito em chamadas externas

```php
// ❌ Sem timeout — pode travar 30s no default do PHP
Http::post($url, $data);

// ✅ Timeout explícito
Http::timeout(10)->post($url, $data);
```

### 5. DB Transaction para operações multi-step

```php
// ❌ Sem transaction — estado parcial se falhar no meio
$sale = Sale::create([...]);
$contract = Contract::create([...]);
$clientHasContract = ClientHasContracts::create([...]);

// ✅ Tudo ou nada
DB::beginTransaction();
try {
    $sale = Sale::create([...]);
    $contract = Contract::create([...]);
    $clientHasContract = ClientHasContracts::create([...]);
    DB::commit();
} catch (\Throwable $e) {
    DB::rollBack();
    throw $e;
}
```

### 6. Logging com contexto financeiro

Logs em código de pagamento DEVEM ter no mínimo:
- `sale_id`
- `product_id` ou `contract_id`
- `client_id`
- `amount` (quando relevante)
- `gateway` / `method`

## Checklist para Code Review de Pagamentos

- [ ] Exception não é engolida silenciosamente
- [ ] Resposta do gateway é validada (campos não-null)
- [ ] Timeout explícito em chamadas HTTP externas
- [ ] Log tem contexto suficiente (sale_id, amount, etc.)
- [ ] Não cria estado parcial (DB transaction se multi-step)
- [ ] Idempotência protege contra double-click
- [ ] Status da venda é atualizado em caso de falha (não fica 'created' eternamente)
