---
inclusion: auto
---

# Jira — Sustentação N3

## Contexto

- **Projeto:** VSUS ([Voomp] Sustentação)
- **Board principal:** 2477 — "Suporte Voomp" (Kanban)
- **Boards adicionais:** 1365 — "[VSUS] Desenvolvimento" (Scrum) · 1366 — "[VSUS] Epicos" (Kanban)
- **Fix Version ativa:** `[VSUS] PI 2/26` — toda nova task deve ter essa versão antes de mover para Em Andamento
- **Org Atlassian:** cogna.atlassian.net

---

## Status do board 2477

| Status | Categoria | Quando usar |
|---|---|---|
| `Backlog` | Pendente | Incidente recebido, ainda não iniciado |
| `Em Andamento` | Em andamento | Dev está investigando ou implementando |
| `Em teste` | Em andamento | Em validação de QA |
| `Em espera` | Em andamento | Bloqueado por dependência externa (produto, tech, seller) |
| `Bloqueado` | Em andamento | Impedimento técnico interno |
| `Pendente de Produção` | Concluído | PR aprovado + QA validado em HML — aguarda war room |
| `Em produção` | Concluído | Deploy PRD realizado |
| `Concluído` | Concluído | Encerrado sem deploy (duplicata, não reproduzível, etc.) |
| `Aceito` | Concluído | Aceito pelo QA — subtask concluída |

**Fluxo principal:** `Backlog → Em Andamento → Em teste → Pendente de Produção → Em produção`

---

## Labels

| Label | Quando aplicar |
|---|---|
| `Refinado` | Incidente refinado pelo time — descrição completa, impacto mapeado |
| `Pendente_Produto` | Aguardando decisão ou insumo do time de Produto |
| `Pendente_Tech` | Bloqueado por dependência técnica de outro time |
| `Chamado_Fresh_Fechado` | Chamado Freshdesk correspondente já foi fechado pelo N2 |

---

## Estrutura de subtasks

Todo incidente VSUS deve ter subtasks criadas conforme o fluxo:

| Tipo | Responsável | Título padrão |
|---|---|---|
| `Subtarefa` | DEV | `Análise de caso` |
| `Subtarefa` | DEV | `[DEV] Análise, investigação de causa raiz, implementação e PR` |
| `Sub-teste` | QA | `[QA] Planejar cenário de testes` |
| `Sub-teste` | QA | `[QA] Executar cenário de testes` |
| `Sub-bug` | DEV ou QA | Título livre — incidente descoberto durante o desenvolvimento |

> **Regra:** sempre criar a subtask `Análise de caso` ao iniciar a investigação, antes de qualquer consulta técnica.

---

## Campos obrigatórios para incidentes N3

- **Descrição:** contexto do incidente, evidências, impacto, comportamento esperado
- **Causa Raiz** (`customfield_10169`): preencher após análise — objetivo, sem código extenso
- **Descrição da Resolução** (`customfield_10168`): o que foi feito, arquivos alterados, PR e branch

### Formato padrão da descrição de incidente

```
| ID Seller | CNPJ | Nome | Email |
| --- | --- | --- | --- |

[Descrição do incidente]

### Impacto
[O que está sendo afetado — sellers, alunos, funcionalidade, volume]

### Comportamento esperado
[O que deveria acontecer]

### Riscos identificados
- [Risco 1]
- [Risco 2]
```

### Formato padrão da Causa Raiz

```
O [componente] no endpoint [rota] tinha [N] problemas:
1. [Problema 1] — [consequência]
2. [Problema 2] — [consequência]

Cenário: [descrição do cenário que causou o incidente]
```

### Formato padrão da Resolução

```
1. [Correção 1]
2. [Correção 2]

Arquivos: [lista de arquivos alterados]
PR: #[número] | Branch: [nome da branch]
```

---

## Registro de horas

- Horas devem ser registradas em **subtasks** (Subtarefa, Sub-bug, Sub-teste)
- **NUNCA** registrar worklog diretamente no incidente pai — automation do Jira rejeita
- Título da subtask de horas DEV: `[DEV] [descrição da atividade]`

---

## Transições de status

```
Backlog → Em Andamento (ao iniciar investigação — criar subtask "Análise de caso")
Em Andamento → Em teste (ao criar PR e subtasks de QA)
Em teste → Pendente de Produção (PR aprovado + QA validado em HML)
Pendente de Produção → Em produção (após deploy PRD via war room)
```

> Ao deployar em PRD: campo "Descrição da Resolução" deve estar preenchido.
