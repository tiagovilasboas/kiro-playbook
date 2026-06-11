---
inclusion: fileMatch
fileMatchPattern: "*Test.php"
---

# Testes Unitários — seller-greenn-back

## Ambiente
- PHP 7.4.33 (mesma versão de produção)
- PHPUnit 8.5.52
- Container Docker: `voomp-back-php`

## Comandos

```bash
# Rodar todos os testes
docker exec voomp-back-php php vendor/bin/phpunit --no-coverage

# Rodar testes de um arquivo específico
docker exec voomp-back-php php vendor/bin/phpunit --filter="IdempotencyPayMiddlewareTest" --no-coverage

# Rodar testes de múltiplas classes
docker exec voomp-back-php php vendor/bin/phpunit --filter="ClassA|ClassB" --no-coverage
```

## Convenções

- Testes ficam em `src/tests/Unit/`
- Nomenclatura: `[Classe]Test.php` (ex: `IdempotencyPayMiddlewareTest.php`)
- Métodos: `test_[cenário]_[resultado_esperado]` (ex: `test_duplicate_request_returns_409`)
- Usar mocks para dependências externas (Cache, DB, HTTP)

## Compatibilidade PHP 7.4

Não usar:
- Named arguments (`fn(name: 'value')`)
- Match expressions (`match($x) { ... }`)
- Union types (`int|string`)
- Nullsafe operator (`$obj?->method()`)
- `str_contains()`, `str_starts_with()`, `str_ends_with()`

Usar em vez disso:
- Arrays associativos para parâmetros
- Switch/if-else
- Type hints simples ou PHPDoc
- `strpos() !== false`, `substr() === 0`

## Ao criar testes para um fix

1. Cobrir o cenário que causou o bug (caso de regressão)
2. Cobrir cenários adjacentes (variações do mesmo fluxo)
3. Cobrir o "caminho feliz" (comportamento normal não deve quebrar)
4. Usar `@dataProvider` para múltiplas variações do mesmo teste
