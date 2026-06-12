---
inclusion: always
---

# Sem afirmação sem fonte

## Regra

Nunca afirmar como fato algo que não foi confirmado por evidência direta (log, query, teste, documentação oficial, ou confirmação verbal do responsável).

## Na prática

| Situação | Correto | Errado |
|---|---|---|
| Não verifiquei o acesso de DEV | "Acesso a DEV: a confirmar" | "DEV requer VPN" |
| Vi no stacktrace que é PHP 8 | "PRD roda PHP 8 (fonte: stacktrace VSUS-709)" | "O projeto usa PHP 8" (sem dizer de onde veio) |
| Alguém me disse mas não testei | "Segundo [pessoa], funciona assim — não verificado" | Afirmar como fato |
| Query retornou vazio | "Não encontrado no banco" | "Não existe" (pode ser outra tabela, outro schema) |

## Ao documentar (Confluence, Jira, steerings)

- Se confirmado: afirma + cita fonte (log, query, data, quem confirmou)
- Se não confirmado: marca como hipótese ou remove
- Se desatualizado: atualizar ou marcar "⚠️ não revalidado desde [data]"

## Ao responder perguntas

- Se não sei: "não tenho essa informação" — não inventar
- Se é provável mas não confirmado: "provavelmente X, mas não confirmei — quer que eu verifique?"
