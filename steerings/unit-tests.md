---
inclusion: fileMatch
fileMatchPattern: "*Test.php"
---

# Testes Unitários — PHPUnit / Sustentação N3

## Framework

**PHPUnit** — versão compatível com PHP 7.4. Arquivos de teste seguem a convenção `*Test.php` em `tests/`.

## Comandos Docker

```bash
# Rodar todos os testes
docker exec voomp-back-php php artisan test

# Rodar um arquivo específico
docker exec voomp-back-php php artisan test tests/Unit/RefundHelperTest.php

# Rodar com filtro por método
docker exec voomp-back-php php artisan test --filter test_refund_marks_sale_as_refunded

# Rodar com coverage (lento — só quando necessário)
docker exec voomp-back-php php artisan test --coverage
```

## Convenções PHP 7.4

```php
<?php

namespace Tests\Unit;

use App\Helpers\RefundHelper;
use App\Models\Sale;
use Tests\TestCase;

class RefundHelperTest extends TestCase
{
    private RefundHelper $helper;
    private $saleMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->saleMock = $this->createMock(Sale::class);
        $this->helper = new RefundHelper($this->saleMock);
    }

    public function test_refund_marks_sale_as_refunded(): void
    {
        // Arrange
        $this->saleMock->expects($this->once())
            ->method('update')
            ->with(['status' => 'refunded']);

        // Act
        $result = $this->helper->processRefund('ch_abc123');

        // Assert
        $this->assertTrue($result);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        // Limpar estado se necessário
    }
}
```

## Padrões

| Convenção | Regra |
|---|---|
| Nome do método | `test_` + descrição em snake_case |
| Estrutura | Arrange / Act / Assert — sempre os três |
| Mocks | Via `createMock()` ou `getMockBuilder()` — não usar Mockery |
| Data providers | `@dataProvider` para múltiplos cenários do mesmo teste |
| Fixtures | Factories ou arrays inline — não usar dados de PRD |

## O que Testar em Sustentação

Todo fix de bug deve ter um teste que:
1. Reproduz o cenário exato do bug (usando os dados do chamado como referência)
2. Confirma que o bug não ocorre após o fix
3. Confirma que o comportamento esperado funciona

```php
// Exemplo real: bug de reembolso não removendo acesso ao Play
public function test_refund_removes_play_access_when_origin_is_transaction(): void
{
    // Arrange — cenário do VSUS-490
    $sale = $this->createMock(Sale::class);
    $sale->method('getAttribute')->with('type')->willReturn('TRANSACTION');

    // Act
    $result = $this->helper->saleRefunded($sale);

    // Assert — acesso deve ser removido
    $this->assertTrue($result['play_access_removed']);
}
```
