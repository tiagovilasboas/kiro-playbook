# Prompt: Triage Incident (Freshdesk)

**Quando usar:** Ao receber um chamado do N2 e precisar interpretá-lo, classificar a severidade e criar o card VSUS.

**Requer MCP:** Jira (para criar o card) — sem MCP, o Kiro gera o card formatado para colar manualmente.

---

## Prompt

Cole no chat do Kiro (cole o conteúdo do chamado junto):

```
Preciso triar este chamado Freshdesk:

[Cole aqui o conteúdo do chamado — título, descrição, seller afetado, prints se disponíveis]

Faça a triagem completa:

1. CLASSIFICAÇÃO: Qual a severidade? P1/P2/P3/P4?
   - P1: checkout/pagamento fora do ar ou recorrência parada (SLA 2h)
   - P2: webhooks com falha em lote ≥50% ou reembolsos parados (SLA 2h)
   - P3: relatórios incorretos ou admin degradado sem perda financeira imediata (SLA 8h)
   - P4: bugs visuais ou edge cases de baixo volume (agendamento normal)

2. CONTEXTO: Identifique seller(s) afetado(s), produto, volumetria

3. FRENTE: Checkout & Pagamentos / Recorrência / Webhooks / Financeiro / Admin?

4. CRIAR CARD VSUS com:
   - Título: "[Nº chamado] [Plataforma] [Categoria] Descrição objetiva"
   - Descrição no formato:
     | ID Seller | CNPJ | Nome | Email |
     | --- | --- | --- | --- |

     [Descrição do problema]

     ### Impacto
     [O que está sendo afetado]

     ### Comportamento esperado
     [O que deveria acontecer]

     ### Riscos identificados
     - [Risco 1]

   - Assignee: [dev responsável pela frente]
   - Fix Version: [VSUS] PI 2/26
   - Criar subtask "Análise de caso"

5. PRÓXIMOS PASSOS: O que investigar primeiro?
```

---

## Nomenclatura padrão de bugs VSUS

```
59633 [ADM] [Boleto] E-mail de boleto não sendo disparado
60971 [ADM] [Permissões] Sub-usuário não consegue alterar links
61145 [ADM] [Vendas] Falha na sincronização com Pagar.me
```

Formato: `[Nº Freshdesk] [Plataforma] [Categoria] Descrição objetiva`
