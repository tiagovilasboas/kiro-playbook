---
version: 1.0.0
profiles: [all]
description: "Documenta incidentes significativos do N3: linha do tempo, causa raiz e ações corretivas para o Confluence"
---

# Skill: Post-Mortem

## O que esta skill faz

Guia a documentação estruturada de incidentes significativos da Squad Sustentação N3. O output é um documento markdown pronto para postar no Confluence na página [Post-Mortem — Sustentação N3](https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2800254978).

Não precisa de MCP configurado — você fornece o contexto e o Kiro estrutura o documento.

## Quando usar

Criar post-mortem quando o incidente se enquadrar em **ao menos um** destes critérios:

| Critério | Exemplo |
|---|---|
| **Incidente silencioso ≥ 24h** | Incidente N3 sem Log::error, descoberto por chamado Freshdesk |
| **Integração externa parou sem deploy nosso** | OneSignal, Pagarme, eNotas mudaram API sem aviso |
| **Mesmo tipo de incidente pela 3ª vez** | Webhook duplicata, reembolso, idempotência que voltou |
| **Impacto em receita ou acesso de aluno** | Venda não registrada, aluno sem acesso após pagamento |
| **Descoberto por seller/aluno, não por nós** | Chegou via Freshdesk antes de qualquer alerta interno |
| **Cronjob/worker parado em PRD** | Fila travada, job silencioso, retry infinito |
| **Regressão após deploy** | Deploy que quebrou algo que funcionava |

### O que NÃO precisa de post-mortem
- Incidente N3 pontual resolvido em < 2h sem recorrência e sem impacto financeiro
- Erro de configuração de ambiente DEV/HML
- Incidente já coberto por post-mortem anterior da mesma causa raiz

## Como usar

```
"Preciso documentar o post-mortem do VSUS-701 — notificações push offline por 30 dias"
```

Ou com mais contexto:

```
"Quero fazer o post-mortem do incidente de push notifications.
Ficou offline de 04/05 até 03/06/2026.
Causa: OneSignal passou a exigir Authorization header sem aviso.
9 chamados no Freshdesk antes de qualquer log de erro."
```

## O Kiro vai solicitar

Se não estiver no contexto, o Kiro vai pedir:

1. **Qual incidente?** — VSUS-XXX ou descrição do problema
2. **Quando começou e quando foi detectado?** — janela de impacto
3. **Qual foi o impacto?** — usuários, revenue, chamados
4. **Linha do tempo** — o que aconteceu, quando foi detectado, quando foi resolvido
5. **Causa raiz** — o que causou de verdade (não o sintoma)
6. **O que já foi feito** — PR, branch, deploy

## Template de Output

O Kiro gera um documento com esta estrutura, pronto para o Confluence:

```markdown
# Post-Mortem: [Título do Incidente]

**Data de início:** DD/MM/YYYY  
**Data de detecção:** DD/MM/YYYY  
**Data de resolução:** DD/MM/YYYY  
**Duração total:** X dias / X horas  
**Ticket:** [VSUS-XXX](link)  
**Responsável:** Nome

---

## Impacto

| Métrica | Valor |
|---|---|
| Usuários afetados | ~X sellers / X alunos |
| Chamados Freshdesk | X |
| Receita em risco | ~R$ X (estimativa) |
| Funcionalidade | Descrição do que ficou indisponível |

---

## Linha do Tempo

| Data/Hora | Evento |
|---|---|
| DD/MM HH:MM | Incidente iniciou (causa) |
| DD/MM HH:MM | Primeiro chamado recebido |
| DD/MM HH:MM | Time N3 tomou ciência |
| DD/MM HH:MM | Causa raiz identificada |
| DD/MM HH:MM | Fix deployado em PRD |
| DD/MM HH:MM | Incidente encerrado |

---

## Causa Raiz

[Descrição técnica objetiva da causa. Não o sintoma — o porquê.]

---

## Por que não detectamos antes?

[O que nos impediu de detectar proativamente: ausência de log, alerta mal configurado, cobertura insuficiente.]

---

## Ações Corretivas

| Ação | Responsável | Prazo | Status |
|---|---|---|---|
| [O que foi feito — PR/branch] | Dev | Concluído | ✅ |
| [O que ainda precisa ser feito] | Dev | DD/MM | 🔲 |

---

## Ações Preventivas

| Ação | Por quê evita recorrência | Responsável | Prazo |
|---|---|---|---|
| [Alerta no Grafana para X] | Detectaria Y em < 5min | Tiago | DD/MM |
| [Teste de integração para Z] | Cobrira o cenário W | Dev | DD/MM |

---

*Documentado por: [Nome] em DD/MM/YYYY*
```

## Exemplos de Uso

### Exemplo 1 — Incidente de push notifications (VSUS-701)

```
Você: Post-mortem do VSUS-701. Push notifications offline de 04/05 até 03/06/2026.
      OneSignal começou a exigir Authorization header sem aviso.
      9 chamados no Freshdesk. ~4.300 sellers impactados. ~172k pushes perdidos.

Kiro: [Gera documento completo com linha do tempo, impacto e ações preventivas
       (adicionar alerta no Grafana para falhas de push + teste de integração)]
```

### Exemplo 2 — Incidente recorrente de webhook

```
Você: Mesmo incidente de webhook duplicado voltou pela 3ª vez (VSUS-688).
      Desta vez afetou 8 sellers em 6 meses.

Kiro: [Documenta padrão recorrente, identifica que a causa raiz original
       não foi tratada de forma permanente, e sugere ação de prevenção]
```
