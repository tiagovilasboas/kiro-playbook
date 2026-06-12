---
inclusion: manual
---

# Decisões Arquiteturais — Trade-offs Documentados

## Formato ADR (Architecture Decision Record)

Quando tomar uma decisão técnica não-óbvia, registrar aqui com:

```
### [Data] — [Decisão]
**Contexto:** Por que precisamos decidir algo
**Opções consideradas:** A, B, C
**Decisão:** Qual escolhemos
**Trade-off aceito:** O que perdemos com essa escolha
**Risco:** O que pode dar errado
```

---

## Decisões registradas

### 2026-06-02 — Janela de idempotência: 60s (não 120s, não 30s)

**Contexto:** Middleware de idempotência com janela de 10s era insuficiente (VSUS-679)
**Opções:** 30s (pode não pegar refresh lento), 60s (cobre 99% dos cenários), 120s (pode bloquear compra legítima)
**Decisão:** 60s
**Trade-off:** Comprador que demora exatamente 61-119s pode duplicar (raro). Compra legítima após 60s passa normalmente.
**Risco:** Se o checkout tem latência > 60s por timeout de gateway, o comprador pode tentar novamente e ser bloqueado incorretamente.

### 2026-06-02 — Formato auth OneSignal: `key` com fallback silencioso

**Contexto:** Endpoint OneSignal exige auth, mas variável pode não estar provisionada em todos os ambientes
**Opções:** Fail hard (throw exception se key ausente), Fallback gracioso (envia sem auth + Log::warning)
**Decisão:** Fallback gracioso
**Trade-off:** Se a key não estiver provisionada e o enforcement ativar, push falha silenciosamente (mas com Log::warning agora). Zero risco de regressão no deploy.
**Risco:** Dev pode não perceber que a key está ausente se não monitora logs de warning.

### 2026-06-08 — Export: trocar chave `amount` → `total` (não usar null coalescing)

**Contexto:** VSUS-709 — `$sale->amount` não existe. Opções: `$sale->amount ?? ''` ou trocar pra `$sale->offer_amount` com chave `total`
**Opções:** Null coalescing (mantém chave amount, valor vazio se não existir), Correção semântica (chave + valor corretos)
**Decisão:** Correção semântica — chave `total` + valor `offer_amount`
**Trade-off:** Muda o campo no CSV gerado (de `amount` para `total`). Se alguma integração downstream consumia o campo `amount`, pode quebrar.
**Risco:** Baixo — `$future_column_names` já mapeia `total` → "Valor a pagar". O campo `amount` nunca funcionou (era sempre undefined).

### 2026-06-08 — Cleanup de jobs stuck: 30 minutos (não 15, não 60)

**Contexto:** Jobs de export travados em RUNNING bloqueiam seller permanentemente
**Opções:** 15 min (pode matar job legítimo em processamento lento), 30 min (seguro pra maioria), 60 min (muito lento pra desbloquear)
**Decisão:** 30 minutos
**Trade-off:** Se existir um export legítimo que demora mais de 30 min (seller com 100k+ vendas), será marcado como FAILED incorretamente. Seller pode tentar de novo.
**Risco:** Falso positivo em sellers com volume muito alto. Mitigação: parametrizar via `--minutes` no command.
