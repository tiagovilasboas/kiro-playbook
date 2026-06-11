---
inclusion: always
---

# DOR e DOD — Sustentação N3

## DOR — Definition of Ready (pra entrar em desenvolvimento)

A task está pronta quando tem:

| # | Critério |
|---|---|
| 1 | Descrição com contexto do problema |
| 2 | Evidências (prints, queries, links Freshdesk) |
| 3 | Impacto descrito (quem afeta, quantos incidentes) |
| 4 | Comportamento esperado claro |
| 5 | Seller/usuário de referência pra reproduzir (tabela ID/CNPJ/Email) |
| 6 | Ambiente onde reproduzir identificado |
| 7 | Prioridade definida |
| 8 | Assignee definido |

Se faltar algum item, devolver pra PM com comentário especificando o que falta.

### Exceção: Tasks de Infra/CI/CD

Para tasks que **não alteram código de aplicação** (pipelines, configurações de CI/CD, steerings, manifests, etc.):
- Critérios 5 e 6 **não se aplicam** (não há seller/usuário afetado nem ambiente para reproduzir)
- Marcar como "N/A" no checklist e prosseguir
- Critérios 1-4, 7 e 8 continuam obrigatórios

---

## DOD — Definition of Done (pra ir pra "Em produção")

| # | Critério | Onde |
|---|---|---|
| 1 | Causa Raiz preenchida | customfield_10169 |
| 2 | Descrição da Resolução preenchida (arquivos, branch, PR) | customfield_10168 |
| 3 | Subtask DEV criada com worklog (horas + descrição) | Subtarefa |
| 4 | Subtasks QA criadas (planejar + executar) | Sub-teste |
| 5 | PR aberto com descrição completa (contexto, mudanças, o que não muda, cenários) | Azure DevOps |
| 6 | PR aprovado por reviewer | Azure DevOps |
| 7 | Testes passando (unitários ou validação manual documentada) | PR ou comentário |
| 8 | Deploy validado em DEV/HML antes de PRD (ou justificativa se direto) | Comentário |
| 9 | Critérios de aceite validados por QA | Subtask QA "Aceito" |
| 10 | Merge na main | Azure DevOps |
| 11 | Observabilidade: se bug era silencioso, `Log::error` adicionado | Código |
| 12 | Comentário final com evidência de funcionamento em PRD | Comentário |

---

## Resumo rápido

**DOR:** "Eu consigo começar a trabalhar nisso sem precisar perguntar nada?"
**DOD:** "Qualquer pessoa do time consegue verificar que isso foi feito, testado e documentado?"
