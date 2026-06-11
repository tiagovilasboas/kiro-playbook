---
inclusion: always
---

# Padrão de Nomenclatura — Issues VSUS

## Bugs

```
{ticket_freshdesk} [{sistema}] [{módulo}] {descrição do problema} (REABERTURA)?
```

| Campo | Exemplos |
|-------|----------|
| `ticket_freshdesk` | Número do chamado Freshdesk (ex: `61145`, `53488`) |
| `sistema` | ADM, PLAY, CHECKOUT, ERP, DMH, CROSS |
| `módulo` | Vendas, Recorrência, Relatório, Contratos, Split, Reembolso, App, Webhook, Financeiro, Permissões, Navegação, Exportação, E-mail, Boleto, Vitrine |
| `descrição` | Descrição curta do sintoma/problema |
| `(REABERTURA)` | Adicionar quando for reabertura de bug já resolvido anteriormente |

Exemplos reais:
- `61145 [ADM] [Vendas] Falha na sincronização de vendas/cobranças Pagar.me`
- `53488 [ADM] [Relatório] Exportação de vendas falha com "Exportar próximas faturas" (REABERTURA)`
- `60600 [ADM] [App] Falha nas notificações push para sellers`
- `62354 [ADM] [Financeiro] Falha na conciliação de reembolsos/estornos - Integração Pagar.me`

## Histórias

```
[{sistema}] [{módulo}] {descrição da funcionalidade}
```

Exemplos reais:
- `[ADM] [Recorrência] Ao trocar o cartão sistema deve cobrar imediatamente`
- `[CHECKOUT] [Recorrência] Cancelar contrato anterior ao gerar novo de mesmo produto/oferta`
- `[RECORRÊNCIA] Motor de retentativa de cobrança`

Para Histórias de infra/CI que não tem sistema/módulo:
- `{descrição da funcionalidade} - {repositório}`
- Ex: `Adicionar pipeline de validação de PR (PR Validation Gate) - seller-greenn-back`

## Subtasks

```
[{tipo}] {descrição da ação}
```

| Tipo | Quando usar |
|------|-------------|
| `[DEV]` | Implementação de código |
| `[QA]` | Planejamento ou execução de testes |
| `[INFRA]` | Configuração de infra/pipeline/deploy |

Exemplos reais:
- `[DEV] Implementar cleanup automático de jobs de export presos`
- `[DEV] Configurar alertas Datadog para erros OneSignal, SendGrid e Postmark`
- `[QA] Executar cenários de teste — VSUS-709 Export Charges`
- `[QA] Planejar cenários de teste — VSUS-709 Export Charges`

## Regras gerais

1. Sempre em português
2. Sistemas e módulos em CAPS dentro de colchetes
3. Descrição começa com verbo no infinitivo (subtasks) ou substantivo (bugs/histórias)
4. Bugs SEMPRE começam com número do ticket Freshdesk
5. Reabertura indicada com sufixo `(REABERTURA)`
6. Subtasks de QA sempre referenciam a task pai (ex: `— VSUS-709`)
