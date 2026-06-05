---
inclusion: fileMatch
fileMatchPattern: "*Payment*.php,*Gateway*.php"
---

# Resiliência em Pagamentos — 6 Regras de Ouro

> Você está editando código financeiro. Cada linha errada aqui pode resultar em venda duplicada, reembolso não processado ou cobrança indevida. Leia antes de modificar.

## Regra 1 — Idempotência Obrigatória

Todo endpoint de pagamento deve ser idempotente. Se o cliente retentar, o resultado deve ser o mesmo.

```php
// O IdempotencyPayMiddleware já cobre POST /checkout/payment
// Upsell (POST /api/upsell) NÃO tem middleware de idempotência — atenção redobrada
// Ao modificar lógica de upsell, verificar duplicatas manualmente
```

## Regra 2 — Log Antes e Depois de Chamadas Externas

```php
// ✅ Toda chamada ao gateway deve ter log de entrada e saída
Log::info('gateway.charge.request', ['sale_id' => $id, 'amount' => $amount, 'method' => $method]);
$response = $this->gateway->charge($payload);
Log::info('gateway.charge.response', ['sale_id' => $id, 'status' => $response['status']]);
```

Sem isso, quando algo der errado em PRD, não há como investigar.

## Regra 3 — Never Fail Silently

```php
// ❌ Nunca — esconde falhas de gateway
if ($response['status'] === 'error') {
    return null;
}

// ✅ Sempre — loga, lança exceção ou retorna erro explícito
if ($response['status'] === 'error') {
    Log::error('gateway.charge.failed', ['response' => $response]);
    throw new GatewayChargeException($response['message']);
}
```

## Regra 4 — Rollback Explícito em Transações Compostas

```php
// ✅ Toda operação multi-step deve ter rollback
DB::beginTransaction();
try {
    $sale = Sale::create($data);
    $contract = Contract::create(['sale_id' => $sale->id]);
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    Log::error('sale.create.failed', ['error' => $e->getMessage()]);
    throw $e;
}
```

## Regra 5 — Validar Resposta do Gateway Antes de Confirmar

```php
// ✅ Checar campos não-null ANTES de salvar
if (empty($response['transaction_id']) || empty($response['status'])) {
    Log::error('gateway.response.invalid', ['response' => $response]);
    throw new InvalidGatewayResponseException();
}
// Só depois salvar no banco
$sale->update(['transaction_id' => $response['transaction_id'], 'status' => 'paid']);
```

## Regra 6 — Retry com Backoff Exponencial para Timeouts

```php
// ✅ Para chamadas externas com timeout
$attempt = 0;
$maxAttempts = 3;
while ($attempt < $maxAttempts) {
    try {
        return $this->gateway->charge($payload);
    } catch (GatewayTimeoutException $e) {
        $attempt++;
        if ($attempt >= $maxAttempts) throw $e;
        sleep(pow(2, $attempt)); // 2s, 4s, 8s
    }
}
```

---

## Arquitetura de Pagamentos (Referência)

| Tipo | Gateway | Fluxo | Arquivo principal |
|---|---|---|---|
| TRANSACTION (venda única) | Gateway V2 | Checkout → `GreennGatewayHelper::pay()` → Pagarme v5 | `CreditCardPayment.php`, `BoletoPayment.php` |
| SUBSCRIPTION (1ª compra) | SDK Pagarme v4 direto | `$pagarme->createSubscription()` | `SubscriptionPayment.php` |
| Renovação automática | Pagarme v4 nativo | Não passa pelo checkout | `clients_has_contracts` |
| Upsell | Gateway V2 | POST /api/upsell — **sem middleware de idempotência** | `UpsellController.php` |

## Campos Críticos na Tabela `sales`

| Campo | Nunca pode ser | Motivo |
|---|---|---|
| `transaction_id` | NULL em status `paid` | Sem tx_id não dá pra rastrear no gateway |
| `status` | string arbitrária | Deve ser enum: `paid`, `refused`, `waiting_payment`, `refunded`, `chargedback` |
| `contract_id` | NULL em SUBSCRIPTION | Quebra o fluxo de recorrência |
