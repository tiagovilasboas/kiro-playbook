# Prompt: War Room Status

**Quando usar:** Antes ou durante o war room de deploy para ter uma visão consolidada do que está pronto para ir para PRD.

**Requer MCP:** Jira + Azure DevOps Pipeline

---

## Prompt

Cole no chat do Kiro:

```
Gere o relatório de status do war room:

1. TASKS PRONTAS PARA PRD:
   Busque no Jira todas as tasks VSUS com status "Pendente de Produção"
   Para cada uma: VSUS-XXX, título, dev responsável, PR criado?

2. BRANCHES PRONTAS:
   Liste as branches locais/remotas com padrão feature/fix/VSUS-*
   que já têm PR aprovado e estão prontas para merge

3. PIPELINE:
   Status atual do pipeline 16417 (voomp-creators-back-CI)
   Último build: sucesso ou falha?

4. CHECKLIST PRÉ-DEPLOY:
   - [ ] Todas as tasks em "Pendente de Produção" têm Causa Raiz preenchida?
   - [ ] Todas têm sub-testes QA "Aceitos"?
   - [ ] Alguma task tem dependência de outra?
   - [ ] Rollback plan definido para alguma alteração de risco?

5. TEMPLATE DE REPORT (para postar no canal do time):
   🚀 War Room — [data]
   
   Deploy inclui:
   - VSUS-XXX: [título] (@dev)
   - VSUS-XXX: [título] (@dev)
   
   Rollback: [como reverter se necessário]
   
   Status: ✅ Go / ⚠️ Aguardando [X]
```
