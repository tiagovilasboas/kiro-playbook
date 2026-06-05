# Prompt: Deliver Story

**Quando usar:** Ao finalizar o desenvolvimento de um bug/feature e precisar criar o PR, atualizar o Jira e garantir que o ciclo de entrega está completo.

**Requer MCP:** Azure DevOps (PR) + Jira (opcional — sem MCP, o Kiro gera tudo para fazer manualmente)

---

## Prompt

Cole no chat do Kiro:

```
Quero entregar a história [VSUS-XXX]. Faça o ciclo completo:

1. Crie o PR com este template:
   ## Sumário
   [O que foi alterado e por quê]

   ## Motivação
   [Contexto do problema — referenciar VSUS-XXX e chamado Freshdesk #XXXXX]

   ## Como testar
   1. [Passo 1]
   2. [Passo 2]

   ## Checklist
   - [ ] Testes unitários escritos/atualizados
   - [ ] Sem console.log / código de debug
   - [ ] Critérios de aceite do Jira verificados
   - [ ] Impacto em outros módulos avaliado

   ## Jira — Campos obrigatórios
   Causa Raiz (customfield_10169): O [componente] no endpoint [rota] tinha [N] problemas:
   1. [Problema] — [consequência]
   Cenário: [descrição]

   Resolução (customfield_10168): 1. [Correção]. Arquivos: [lista]. PR: #[número] | Branch: [nome]

   ## Referências
   - Jira: [VSUS-XXX](link)
   - Freshdesk: [#XXXXX](link)

2. Preencha customfield_10169 e customfield_10168 no Jira
3. Crie as subtasks de QA se não existirem:
   - [QA] Planejar cenário de testes
   - [QA] Executar cenário de testes
4. Mova a task para "Em Andamento" → "Pendente de Produção" (após PR aprovado + QA validado em HML)

Branch atual: [nome da branch]
```

---

## Fluxo de Status

```
Em Andamento → Pendente de Produção (PR aprovado + QA validado em HML)
Pendente de Produção → Em produção (após deploy em PRD via war room)
```
