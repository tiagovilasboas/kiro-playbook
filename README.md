# kiro-playbook

> Kiro é uma ferramenta pessoal. Este repositório não é uma receita de bolo — é um ponto de partida para você criar os seus próprios superpoderes.

---

## A ideia

Não existe configuração de Kiro que funcione para todo mundo. O que funciona para um dev pode não fazer sentido para outro. O valor real do Kiro vem de como **você** o configura para **o seu contexto** — não de instalar um pacote pronto e esperar mágica.

Este repositório compartilha o que funciona para o time N3 como ponto de partida. Alguns artefatos refletem padrões do time (fluxo Jira, critérios de severidade, arquitetura de pagamentos) — esses fazem sentido para todo mundo aqui. Mas a maioria das configurações mais valiosas que você vai usar são as que **você mesmo criar**, adaptadas ao seu jeito de trabalhar e aos problemas que você resolve todo dia.

> **Padronização de Kiro é um mito. A melhor configuração é a que resolve o seu problema.**

Os artefatos deste repo são um espelho do conhecimento coletivo do time N3. Eles existem para você aprender o padrão e depois superá-lo — não para te prender a ele.

---

## O que está incluído e por quê

Estão aqui apenas os artefatos que:
1. Refletem padrões **reais do time** (não opinião de um dev) — fluxo Jira, critérios N3, stack da plataforma
2. Funcionam **sem MCP** — qualquer dev usa no primeiro clone, sem configuração extra
3. Geram **valor imediato** — o dev percebe o ganho na primeira semana

O que não está aqui também é uma decisão. Se não entrou, é porque ou depende de MCP (virou prompt) ou ainda não foi validado como padrão do time.

---

## Instalação

```bash
git clone https://github.com/cogna/kiro-playbook.git
cd kiro-playbook
node bin/install.mjs
```

O que já existe na sua máquina é preservado.

```bash
node bin/install.mjs --update          # Atualiza após git pull (faz backup automático)
node bin/install.mjs --dry-run         # Simula antes de instalar
node bin/install.mjs --target=workspace  # Instala no projeto atual (hooks visíveis no painel)
```

> Em `--update`, os arquivos existentes são copiados para `~/.kiro/.backup/` antes de serem sobrescritos. Para restaurar, copie o arquivo de volta.

---

## O que está incluído

### 14 steerings — contexto do time N3

Carregadas automaticamente ou ao abrir arquivos específicos. São as steerings reais que o time usa no dia a dia.

| Steering | Inclusão | O que ensina ao Kiro |
|---|---|---|
| `project-context` | auto | Stack, repositórios, frentes de atuação, fluxo operacional |
| `jira-support` | auto | Board VSUS, campos obrigatórios, estrutura de subtasks, transições |
| `jira-issue-naming` | always | Padrão de nomenclatura de bugs, histórias e subtasks |
| `deploy-environments` | auto | DEV/HML/PRD, branches, pipeline 16417, clusters AKS |
| `code-review-routing` | always | Mapa de squads, regra de aprovação, quem revisar por domínio |
| `dor-dod-support` | auto | Definition of Ready e Done do time N3 |
| `payment-resilience` | fileMatch `*Payment*.php` | 6 regras de ouro para código financeiro |
| `solid-php` | fileMatch `src/app/**/*.php` | SOLID aplicado ao projeto com exemplos reais |
| `unit-tests` | fileMatch `*Test.php` | PHPUnit, comandos Docker, convenções PHP 7.4 |
| `grafana` | manual | Dashboard, queries, datasources, runbook de investigação |
| `onesignal-safe-testing` | manual | Regras de teste seguro — evita push acidental em PRD |
| `post-mortem-support` | manual | Template e critérios de quando criar post-mortem |
| `war-room` | manual | Fluxo de consolidação de branches para deploy PRD |
| `kiro-artifact-conventions` | always | Padrões para criar hooks, steerings e skills no Kiro |

### 2 skills — capacidades especializadas do N3

| Skill | Como acionar |
|---|---|
| `incident-triage` | `"Preciso triar este incidente: [contexto/logs]"` |
| `post-mortem` | `"Preciso documentar o post-mortem do VSUS-XXX"` |

### 2 hooks — automações que o time usa todo dia

| Hook | Trigger | O que faz |
|---|---|---|
| `php-lint-on-save` | Salvar `*.php` em `src/app` | Verifica sintaxe com `php -l` |
| `scaffold-teste` | Criar `*Test.php` | Gera estrutura PHPUnit básica |

> `scaffold-php` e os hooks `incident-investigation` e `jira-close-task` existem em `hooks/dev/` mas não são instalados pelo script. Os dois últimos dependem de MCP — use os prompts equivalentes em `docs/prompts/`.

### 7 prompts — fluxos com MCP (cole no chat)

Funcionam com ou sem MCP configurado. Com MCP, o Kiro executa as ações. Sem MCP, orienta os passos manuais.

| Prompt | O que faz |
|---|---|
| `investigate-incident` | Jira → Grafana → Logs → Código → Banco → Hipóteses |
| `triage-incident` | Interpretar chamado Freshdesk e criar card VSUS |
| `close-task` | Causa Raiz + Resolução + horas em subtask + mover status |
| `deliver-story` | PR + Jira + sub-testes QA + transição de status |
| `generate-pr` | Gerar descrição de PR a partir do git diff |
| `war-room-status` | Relatório de tasks prontas + branches + pipeline |
| `health-check` | Status dos ambientes HML e PRD |

---

## O que realmente importa: crie os seus

Os artefatos acima cobrem os padrões do time. Mas os mais valiosos para você são os que só você vai criar — porque refletem **como você trabalha**, não como o time trabalha em média.

Alguns exemplos do que pode valer muito mais do que qualquer coisa neste repo:

- Uma steering com os módulos que você mais toca e as armadilhas que você já caiu
- Um hook que dispara quando você abre um arquivo de um sistema específico que você suporta
- Um prompt para um tipo de análise que você faz toda semana
- Uma skill que documenta um fluxo que só você conhece bem

**Como criar:** veja o [`CONTRIBUTING.md`](CONTRIBUTING.md) — tem exemplos reais e o passo a passo para cada tipo de artefato.

Se o que você criou funciona e faz sentido para o time, abre um PR. Mas não espere ter algo "perfeito" para começar — a primeira versão sempre é uma versão que funciona só para você, e está tudo bem.

---

## MCPs

O instalador não configura MCPs. Consulte [`docs/mcp-guide.md`](docs/mcp-guide.md) para snippets prontos de Jira, Azure DevOps, Grafana e MySQL.

---

## Testes

```bash
npm test
```

Usa `node:test` nativo — zero dependências. Cobre o script de instalação: parsing de flags, resolução de paths em macOS/Linux/Windows, lógica de backup, comportamento em dry-run e erros de filesystem.

---

## Estrutura

```
kiro-playbook/
├── steerings/        14 arquivos — contexto do time N3
├── skills/           2 arquivos — capacidades especializadas
├── hooks/dev/        5 arquivos — 2 no MVP + 3 opcionais/legados
├── docs/prompts/     7 arquivos — fluxos com MCP como prompts
├── docs/             mcp-guide.md, profiles-guide.md
├── bin/install.mjs
├── manifest.json
├── CONTRIBUTING.md   ← como criar os seus próprios artefatos
└── CHANGELOG.md
```
