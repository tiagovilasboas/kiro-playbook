---
inclusion: fileMatch
fileMatchPattern: "src/app/**/*.php"
---

# SOLID para PHP 7.4 — Aplicado ao Projeto

> ⚠️ **Em bug fixes:** priorizar mudança mínima sobre SOLID. Não refatorar código adjacente ao fix. Refactor vai em PR separado. Ver `minimal-change-principle.md`.

## S — Single Responsibility

**Cada classe tem UMA razão para mudar.**

```php
// ❌ PaymentController faz validação + criação + gateway + webhook + email
class PaymentController {
    public function processPay() { /* 800 linhas */ }
}

// ✅ Separar responsabilidades
class PaymentController {
    public function processPay(Request $request) {
        $validated = app(ValidatePaymentService::class)->execute($request);
        $sales = app(CreateSalesService::class)->execute($validated);
        $result = app(ProcessGatewayService::class)->execute($sales);
        return response()->json($result);
    }
}
```

**Na sustentação:** Não refatoramos o controller inteiro (risco alto). Mas ao ADICIONAR lógica, extraia para um Service.

## O — Open/Closed

**Aberto para extensão, fechado para modificação.**

```php
// ❌ Adicionar novo gateway com if/else no controller
if ($gateway === 'PAGARME') { ... }
elseif ($gateway === 'STRIPE') { ... }
elseif ($gateway === 'NOVO_GATEWAY') { ... }

// ✅ Usar interface + registry (já existe no projeto)
interface PaymentGateway {
    function pay(array $sales, $clientContracts, $request);
}
// PaymentGatewayRegistry já faz o dispatch correto
```

## L — Liskov Substitution

**Subclasses devem ser substituíveis pela classe pai.**

```php
// No projeto: CreditCardPayment, BoletoPayment, PixPayment implementam PaymentGateway
// Todas devem retornar array de $sales com status atualizado
// Se uma retorna void ou null, quebra o contrato
```

## I — Interface Segregation

**Interfaces específicas > interfaces genéricas.**

```php
// ❌ Interface gigante
interface PaymentGateway {
    function pay(...);
    function refund(...);
    function cancel(...);
    function getCharge(...);
    function createSubscription(...);
}

// ✅ Interfaces segregadas
interface Payable { function pay(...); }
interface Refundable { function refund(...); }
interface Cancellable { function cancel(...); }
```

## D — Dependency Inversion

**Dependa de abstrações, não de implementações concretas.**

```php
// ❌ Instancia diretamente
$pagarme = new PagarMe();
$response = $pagarme->createSubscription($data);

// ✅ Injeta via construtor (possibilita mock em testes)
class SubscriptionService {
    private PagarMe $gateway;
    
    public function __construct(PagarMe $gateway) {
        $this->gateway = $gateway;
    }
}
```

**Na sustentação:** O projeto instancia `new PagarMe()` direto no controller. Ao criar Services novos, use injeção de dependência para facilitar testes.

## Aplicação Prática (o que fazer vs o que não fazer)

| Cenário | NÃO faça | Faça |
|---------|----------|------|
| Novo fix no checkout | Adicionar 50 linhas no PaymentController | Criar Service e chamar do controller |
| Novo helper | Criar classe com 10 métodos estáticos | Criar classe com 1-2 métodos, injetável |
| Novo tratamento de erro | `try/catch` que loga e ignora | `try/catch` que atualiza status e propaga |
| Nova query | Raw SQL no controller | Método no Model ou Repository |
| Novo teste | Testar controller inteiro | Testar o Service isolado com mocks |
