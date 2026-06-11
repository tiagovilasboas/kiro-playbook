---
inclusion: manual
---

# Post-Mortem — Sustentação N3

## O que é um post-mortem

Um post-mortem é um registro escrito de um incidente: o que aconteceu, por que aconteceu e o que o time vai fazer para evitar recorrência. Não é punição — é aprendizado estruturado.

**Referências:**
- [Google SRE Book — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [Google SRE — Example Postmortem](https://sre.google/sre-book/example-postmortem/)
- [incident.io — SRE Postmortem Best Practices](https://incident.io/blog/sre-incident-postmortem-best-practices)

---

## Quando criar um post-mortem

Na Sustentação N3, o critério não é só tempo ou gravidade — é **padrão de falha**. Criar post-mortem quando o incidente se enquadrar em **ao menos um** destes casos:

| Critério | Contexto real | Exemplo |
|---|---|---|
| **Incidente silencioso ≥ 24h** | Bug sem Log::error, sem alerta, descoberto por chamado Freshdesk | VSUS-701: push offline 30 dias sem nenhum log |
| **Integração externa parou sem deploy nosso** | OneSignal, Pagarme, eNotas, Memberkit, Cosmos — serviço externo que parou por mudança do lado deles | VSUS-701: OneSignal passou a exigir auth sem aviso |
| **Mesmo tipo de bug aparece pela 3ª vez** | Bug de webhook, duplicata, idempotência, reembolso — se voltou, a causa raiz não foi tratada | VSUS-688: 8 bugs de webhook em 6 meses |
| **Impacto em receita ou acesso de aluno** | Venda não registrada, aluno sem acesso após pagamento, cobrança indevida | VSUS-688: aluna cobrada após cancelamento |
| **Descoberto por seller/aluno, não por nós** | Chegou via Freshdesk antes de qualquer alerta interno | VSUS-701: 9 chamados antes de qualquer log |
| **Cronjob/worker parado em PRD** | Fila travada, job silencioso, retry infinito | Cronjob de reembolso parado silenciosamente |
| **Regressão após deploy** | Deploy que quebrou algo que funcionava | Qualquer hotfix feito em < 2h após deploy |

### O que NÃO precisa de post-mortem

- Bug pontual resolvido em < 2h, sem recorrência e sem impacto financeiro
- Erro de configuração de ambiente (DEV/HML) — não é PRD
- Incidente já coberto por post-mortem anterior da mesma causa raiz

---

## Onde criar

**Confluence → Space Voomp → Post-Mortem — Sustentação N3**
- URL base: https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2800254978
- Criar sub-página com título: `Post-Mortem VSUS-XXX — [Título curto] — DD/MM/YYYY`
- Emoji da página: ☠️ (`2620-fe0f`) — identificador visual padrão de post-mortem no Confluence
- Após criar, adicionar entrada no índice da página-mãe (Post-Mortem — Sustentação N3)

---

## Estrutura obrigatória (8 seções)

Baseada no modelo Google SRE + PagerDuty. O post-mortem é **comunicação e aprendizado** — legível em 3 minutos por PM, QA e devs de outras squads.

> **Regra:** análise técnica profunda (queries, código, trechos, git diff) fica na **doc de análise** (`docs/development/analise-VSUS-XXX.md`) ou nos **comentários da task Jira**. O post-mortem referencia essas fontes via link — não duplica.

```markdown
## 1. Resumo
2-3 frases: o que quebrou, quando, por quanto tempo, quem foi afetado.

## 2. Impacto
| Métrica | Valor | Fonte |
Números com fonte. Sem query — só resultado + de onde veio.

## 3. Linha do Tempo
| Data | Marco |
Marcos principais (não cada log). Foco em:
primeiro sinal → detecção → investigação → fix → deploy → confirmação

## 4. Causa Raiz
- O que causou (1-2 frases)
- Por que existia (causas contribuintes — lista curta)
- Hipóteses descartadas (1 linha cada, com motivo)

## 5. O que funcionou / O que não funcionou
| ✅ Funcionou | ❌ Não funcionou |
Inspirado no PagerDuty — reconhecer o que deu certo também.

## 6. Lições → Mudanças de sistema
| # | Lição | Mudança concreta |
Cada lição aponta pra uma ação no sistema/processo, não na pessoa.

## 7. Ações
| Ação | Quem | Status | Jira |
Separar em: Imediatos (resolver) + Preventivos (não repetir)

## 8. Referências (links — não conteúdo)
| Recurso | Link |
Task Jira, PR, doc de análise, dashboard, doc externa.
```

### O que NÃO colocar no post-mortem

| ❌ Não colocar | ✅ Onde colocar | Por quê |
|---|---|---|
| Trechos de código (antes/depois) | Doc de análise local (`docs/development/`) | Post-mortem é pra comunicação, não debug |
| Queries SQL e resultados completos | Comentários da VSUS-XXX no Jira | Já está rastreável lá |
| Testes curl com output | Subtask DEV (VSUS-720 etc.) | Detalhe de investigação |
| Git log detalhado | Doc de análise local | Referência técnica |
| Explicação de fluxo/arquitetura | Doc de análise local | Contexto técnico pra dev |
| Diagramas de sequência | Doc de análise local | Muito técnico pro público geral |

**Filosofia:** O post-mortem no Confluence responde "O que aconteceu e o que vamos fazer". A doc local no repo responde "Como investigamos e como o código mudou". O Jira tem os comentários do dia-a-dia. Cada documento tem seu público e propósito.

### Referências entre documentos (obrigatório)

O post-mortem DEVE ter links para:
- Task Jira principal (VSUS-XXX)
- PR no Azure DevOps
- Doc de análise técnica no repo (se existir)
- Dashboard Grafana relevante
- Card SRE (se tiver dependência)

**Referências:**
- [Google SRE — Example Postmortem](https://sre.google/sre-book/example-postmortem/) — note que não tem código, queries ou trechos técnicos
- [incident.io — Template](https://incident.io/blog/sre-incident-postmortem-best-practices) — foco em summary, impact, timeline, action items

---

## Fontes de dados, links e evidências — OBRIGATÓRIO

**Todo post-mortem da Sustentação N3 deve ter evidências verificáveis.** Afirmações sem fonte não são aceitas.

### Fontes obrigatórias por seção

| Seção | Fonte exigida |
|---|---|
| Impacto (volume) | Query real no banco PRD ou Loki — com resultado numérico |
| Impacto (usuários) | `SELECT COUNT(*) / COUNT(DISTINCT user_id)` no banco ou painel externo |
| Linha do tempo | Banco PRD (webhooks), Loki, Azure Pipelines, git log — com timestamps UTC |
| Causa raiz | Evidência que confirma + evidência que descarta hipóteses alternativas |
| Hipóteses descartadas | Motivo específico com dado real (ex: "mesmo servidor, 4 min de diferença") |
| Ações corretivas | Link para PR, commit ou task do Jira |

### Fontes disponíveis na Voomp

| Fonte | Tipo | Como acessar |
|---|---|---|
| Banco PRD réplica | SQL read-only | Grafana → `ADMIN PRD REPLICA` (uid `dffty7wyygw00c`) |
| Logs PRD | Loki | Grafana → Loki (uid `P82641446A07FFD78`) |
| Pipeline history | Azure Pipelines | [dev.azure.com/kdop](https://dev.azure.com/kdop) |
| Git log | Código | `git log --format="%h %ai %s"` |
| Incidentes | Freshdesk | Links nos tickets VSUS |
| Painéis externos | OneSignal, Pagarme, etc. | Acesso direto ao painel |

### Formato de evidência no documento

Sempre registrar:
1. **A query ou comando** — exatamente como foi executado
2. **O resultado** — valor numérico ou output real
3. **A data de coleta** — pois dados mudam

```markdown
| Métrica | Valor | Fonte | Data |
|---|---|---|---|
| Total 403 em PRD | 48k+ | `SELECT COUNT(*) FROM webhooks WHERE response LIKE '%403%'` via Grafana uid dffty7wyygw00c | 02/06/2026 |
| Push/dia | 5.761 | Loki: `sum(count_over_time({container="voomp-creators-back"} |= "sendPushNotification" [24h]))` | 03/06/2026 |
```

### Regra geral

> **Se não tem fonte, não é fato — é hipótese. Hipóteses devem ser documentadas como tal.**

---

**Foco no sistema, não na pessoa.**

| ❌ Orientado a culpa | ✅ Blameless |
|---|---|
| "O dev subiu código sem testar" | "O pipeline não bloqueou o deploy com falha de lint" |
| "O on-call demorou pra responder" | "O alerta estava enterrado no ruído — threshold incorreto" |
| "Alguém desabilitou a key" | "Não havia processo para auditar mudanças no painel OneSignal" |

---

## Critérios de revisão antes de publicar

Antes de publicar, verificar:

- [ ] Dados de impacto coletados com fontes (banco, Loki, Freshdesk)
- [ ] Timeline completa com timestamps UTC
- [ ] Causa raiz suficientemente profunda (não parar no primeiro "o quê")
- [ ] Hipóteses descartadas documentadas com evidência
- [ ] Ações corretivas com dono e prazo definidos
- [ ] Lições aprendidas apontam para mudanças de sistema, não de pessoa
- [ ] Resultado compartilhado com stakeholders relevantes (PM, QA, SRE)

---

## Métricas para acompanhar

| Métrica | Meta | Sinal de alerta |
|---|---|---|
| Taxa de conclusão de action items | ≥ 80% | < 50% = post-mortem é teatro |
| Taxa de recorrência do mesmo incidente | < 5% | > 30% = aprendizado não está acontecendo |
| Tempo de publicação após resolução | < 48h | > 5 dias = contexto degradou |

---

## Repositório de Post-Mortems

Todos os post-mortems da Sustentação N3:
https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2536145099

Usar para:
- Identificar padrões recorrentes
- Onboarding de novos devs
- Referência antes de iniciar nova investigação

---

## Exemplo real

[Post-Mortem VSUS-701 — Push Notifications 30 dias offline](https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2536145099) ← criar sub-página

---

*Referências: [Google SRE Book Ch. 15](https://sre.google/sre-book/postmortem-culture/) | [incident.io Best Practices 2026](https://incident.io/blog/sre-incident-postmortem-best-practices) | Modelo Cogna AVA Moodle*
