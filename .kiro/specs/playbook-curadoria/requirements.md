# Requirements Document

## Introduction

O `kiro-playbook` é o repositório de artefatos Kiro da Squad Sustentação N3 da plataforma **Voomp Creators** (edtech/fintech). Seu papel é distribuir steerings, skills e hooks que aumentam a produtividade do time na investigação de bugs, entregas de features e gestão de incidentes.

Esta spec define os requisitos para a **curadoria completa do playbook** com foco em MVP: o que o script instala funciona pra qualquer dev, com ou sem MCP configurado. Tudo que depende de MCP (Jira, Grafana, Azure DevOps) vira um **prompt** — texto que o dev cola no chat e funciona independente de configuração.

**Critério de corte:** um artefato vai para o script de instalação se e somente se funcionar sem nenhum MCP ativo. Caso contrário, vira prompt em `docs/prompts/`.

**Estado atual:** 3 steerings · 2 skills · 2 hooks
**Estado alvo MVP:** 7 steerings · 2 skills · 3 hooks (instalados pelo script) + 7 prompts (em `docs/prompts/`)

---

## Glossary

- **Playbook**: O repositório `kiro-playbook` contendo steerings, skills, hooks e prompts do time N3.
- **Steering**: Arquivo markdown com contexto de domínio. Tipos: `auto` (sempre ativo), `fileMatch` (ativo ao abrir arquivo específico), `manual` (ativado via `#` no chat).
- **Skill**: Arquivo markdown que define uma capacidade especializada ativada por linguagem natural no chat.
- **Hook**: Arquivo `.kiro.hook` (JSON) que dispara ações automáticas em eventos do IDE.
- **Prompt**: Arquivo markdown em `docs/prompts/` com instruções prontas para colar no chat — funciona sem MCP.
- **MVP**: Conjunto mínimo de artefatos instalados pelo script sem dependência de MCP.
- **MCP**: Model Context Protocol — integração com Jira, Grafana, Azure DevOps. Necessário para hooks e skills que consultam sistemas externos.
- **VSUS**: Projeto Jira da Squad Sustentação N3 em `cogna.atlassian.net`.
- **N3**: Última linha de defesa técnica — resolve bugs de produção escalados pelo N2.
- **Freshdesk**: Sistema de chamados do N2 que gera tickets escalados para o N3.
- **Causa_Raiz**: Campo customizado `customfield_10169` no Jira com formato padronizado.
- **Descrição_Resolução**: Campo customizado `customfield_10168` no Jira com formato padronizado.

---

## Requirements

### Requisito 1 — Correção da Steering `jira-workflows.md`

**User Story:** Como desenvolvedor N3, quero que a steering `jira-workflows.md` reflita o estado real do board VSUS para que o Kiro gere orientações corretas sem que eu precise corrigir manualmente.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL listar os quatro labels ativos do VSUS — `Refinado`, `Pendente_Produto`, `Pendente_Tech` e `Chamado_Fresh_Fechado` — com descrição de quando aplicar cada um.
2. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL documentar os nove status do board 2477 com categoria: `Backlog` (pendente), `Em Andamento`, `Em teste`, `Em espera`, `Bloqueado` (em andamento), `Pendente de Produção`, `Em produção`, `Concluído`, `Aceito` (concluídos).
3. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL conter seção de estrutura de subtasks com três tipos: `Subtarefa` (DEV — análise e implementação), `Sub-teste` (QA — planejamento e execução), `Sub-bug` (bug descoberto durante desenvolvimento).
4. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL listar os quatro títulos padrão de subtasks: `"Análise de caso"` (Subtarefa), `"[DEV] Análise, investigação de causa raiz, implementação e PR"` (Subtarefa), `"[QA] Planejar cenário de testes"` (Sub-teste), `"[QA] Executar cenário de testes"` (Sub-teste).
5. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL mencionar os três boards com nome e tipo: 2477 "Suporte Voomp" (kanban), 1365 "[VSUS] Desenvolvimento" (scrum), 1366 "[VSUS] Epicos" (kanban).
6. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL instruir que toda nova task deve ter Fix Version `[VSUS] PI 2/26` antes de mover para `Em Andamento`.
7. WHEN o Playbook for instalado, THE `jira-workflows.md` SHALL usar `"Em Andamento"` como segundo status da transição e não conter `"Em desenvolvimento"`.

---

### Requisito 2 — Correção da Steering `environments-deploy.md`

**User Story:** Como desenvolvedor N3, quero que a steering `environments-deploy.md` documente os clusters AKS reais e namespaces de serviços adjacentes.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `environments-deploy.md` SHALL documentar os dois clusters AKS: `aks-voomp-shd-eu-1` (DEV/HML — East US) e `aks-voomp-prd-bs-1` (PRD — Brazil South).
2. WHEN o Playbook for instalado, THE `environments-deploy.md` SHALL documentar os resource groups: `rg-voomp-shd-eu` (DEV/HML) e `rg-voomp-prd-bs` (PRD).
3. WHEN o Playbook for instalado, THE `environments-deploy.md` SHALL listar os namespaces dos serviços adjacentes: `voomp-creators-adm` (Admin Front) e `seller-club-back` (Club/Play), indicando o cluster de cada um.

---

### Requisito 3 — Correção da Steering `incident-investigation.md`

**User Story:** Como desenvolvedor N3, quero que a steering `incident-investigation.md` referencie o dashboard Grafana e inclua a criação de subtask como primeira etapa formal.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `incident-investigation.md` SHALL incluir como **etapa 1** do fluxo a criação da subtask `"Análise de caso"` no Jira antes de qualquer consulta técnica.
2. WHEN o Playbook for instalado, THE `incident-investigation.md` SHALL referenciar o dashboard `voomp-sustentacao-l3` com as quatro seções: KPIs gerais, Vendas Perdidas (erros 500), Webhooks com erro e Logs de Erro.
3. WHEN o Playbook for instalado, THE `incident-investigation.md` SHALL incluir queries Loki com exemplos de namespace para `voomp-creators-adm` e `seller-club-back`.

---

### Requisito 4 — Criação da Steering `contexto-projeto.md`

**User Story:** Como desenvolvedor N3, quero uma steering com a visão completa da stack, repositórios e frentes de atuação para que o Kiro tenha contexto desde o primeiro uso.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `contexto-projeto.md` SHALL ser configurada com `inclusion: auto`.
2. WHEN o Playbook for instalado, THE `contexto-projeto.md` SHALL documentar a stack com versões: PHP 7.4/Lumen, MySQL, Redis, AKS, Pagarme v4/v5, Gateway V2, Vue.js, Kafka.
3. WHEN o Playbook for instalado, THE `contexto-projeto.md` SHALL listar os repositórios com linguagem e responsabilidade: `seller-greenn-back` (PHP/Lumen — API Back), `seller-greenn-adm` (Vue.js — Admin Front), `seller-greenn-queues` (PHP — Consumers/Kafka).
4. WHEN o Playbook for instalado, THE `contexto-projeto.md` SHALL descrever as cinco frentes de atuação com pelo menos dois exemplos VSUS-XXX por frente.
5. WHEN o Playbook for instalado, THE `contexto-projeto.md` SHALL descrever o fluxo operacional: `Chamado N2 (Freshdesk) → Triagem → Análise N3 → Implementação → Testes → Validação HML → Deploy PRD via war room`.

---

### Requisito 5 — Criação da Steering `boas-praticas-codigo.md`

**User Story:** Como desenvolvedor N3, quero uma steering que carregue os padrões de código ao editar PHP para que o Kiro os aplique automaticamente.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `boas-praticas-codigo.md` SHALL ser configurada com `inclusion: fileMatch` para `src/app/**/*.php`.
2. WHEN o Playbook for instalado, THE `boas-praticas-codigo.md` SHALL documentar KISS, YAGNI, DRY e Clean Code com exemplos em PHP/Lumen.
3. WHEN o Playbook for instalado, THE `boas-praticas-codigo.md` SHALL definir convenções de naming: classes PascalCase, métodos camelCase, variáveis snake_case, constantes UPPER_SNAKE_CASE.
4. WHEN o Playbook for instalado, THE `boas-praticas-codigo.md` SHALL descrever error handling: exceções tipadas, log estruturado, HTTP status correto.
5. WHEN o Playbook for instalado, THE `boas-praticas-codigo.md` SHALL documentar padrões MySQL (queries parametrizadas) e Redis (TTL obrigatório).

---

### Requisito 6 — Criação da Steering `resiliencia-pagamentos.md`

**User Story:** Como desenvolvedor N3, quero uma steering com as regras de ouro do código financeiro ativada ao abrir arquivos de pagamento.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `resiliencia-pagamentos.md` SHALL ser configurada com `inclusion: fileMatch` para `*Payment*.php` e `*Gateway*.php`.
2. WHEN o Playbook for instalado, THE `resiliencia-pagamentos.md` SHALL documentar seis regras de ouro: idempotência obrigatória, log antes/depois de chamadas externas, never fail silently, rollback explícito em transações compostas, validar resposta do gateway antes de confirmar venda, retry com backoff exponencial.
3. WHEN o Playbook for instalado, THE `resiliencia-pagamentos.md` SHALL descrever os quatro fluxos de pagamento: TRANSACTION via Gateway V2, SUBSCRIPTION via SDK Pagarme v4, renovação automática via Pagarme v4 nativo, Upsell via Gateway V2.

---

### Requisito 7 — Criação da Steering `testes-unitarios.md`

**User Story:** Como desenvolvedor N3, quero uma steering com convenções de PHPUnit ativada ao editar testes.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `testes-unitarios.md` SHALL ser configurada com `inclusion: fileMatch` para `*Test.php`.
2. WHEN o Playbook for instalado, THE `testes-unitarios.md` SHALL documentar o framework PHPUnit com comandos Docker para execução local.
3. WHEN o Playbook for instalado, THE `testes-unitarios.md` SHALL definir convenções PHP 7.4: prefixo `test_` em snake_case, uso de `setUp()`/`tearDown()`, mocks via `createMock()`.

---

### Requisito 8 — Correção da Skill `incident-triage.md`

**User Story:** Como desenvolvedor N3, quero que a skill de triagem use critérios específicos da Voomp e referencie o Grafana como fonte primária.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `incident-triage.md` SHALL conter tabela de severidade com critério Voomp e SLA: P1 (checkout/pagamento fora do ar, SLA 2h), P2 (webhooks em lote ≥50% falha ou reembolsos parados, SLA 2h), P3 (relatórios incorretos/admin degradado, SLA 8h), P4 (bugs visuais/edge cases, agendamento normal).
2. WHEN o Playbook for instalado, THE `incident-triage.md` SHALL instruir consulta ao dashboard `voomp-sustentacao-l3` como primeira ação, com ao menos uma query Loki por frente de atuação.
3. WHEN o Playbook for instalado, THE `incident-triage.md` SHALL mapear componentes a severidades: Checkout & Pagamentos → P1/P2; Recorrência & Contratos → P1/P2; Webhooks & Integrações → P2/P3; Financeiro & Reembolso → P2/P3; Relatórios & Admin → P3/P4.

---

### Requisito 9 — Criação da Skill `post-mortem.md`

**User Story:** Como desenvolvedor N3, quero uma skill de post-mortem para documentar incidentes significativos e acumular contexto vivo da plataforma no time.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `post-mortem.md` SHALL ser instalada pelo script (não depende de MCP — output é markdown que o dev posta no Confluence).
2. WHEN o Playbook for instalado, THE `post-mortem.md` SHALL documentar os sete critérios de quando criar post-mortem: incidente silencioso ≥24h, integração externa parou sem deploy nosso, mesmo tipo de bug pela 3ª vez, impacto em receita ou acesso de aluno, descoberto por seller/aluno antes de alerta interno, cronjob/worker parado em PRD, regressão após deploy.
3. WHEN o Playbook for instalado, THE `post-mortem.md` SHALL definir o template de output com seções: data/duração, impacto (usuários/receita), linha do tempo, causa raiz, ações corretivas e itens de prevenção.
4. WHEN o dev acionar a skill, THE skill SHALL solicitar: contexto do incidente, logs disponíveis, linha do tempo conhecida e impacto estimado, e gerar o documento estruturado pronto para postar no Confluence.

---

### Requisito 10 — Criação de Hooks Automáticos PHP (sem MCP)

**User Story:** Como desenvolvedor N3, quero hooks automáticos de qualidade de código que funcionem sem nenhuma dependência externa.

#### Critérios de Aceite

1. WHEN um arquivo `*.php` em `src/app` for salvo, THE `php-lint-on-save.kiro.hook` SHALL executar `php -l` no arquivo e reportar erros de sintaxe.
2. WHEN um novo arquivo `*.php` for criado em `src/app`, THE `scaffold-php.kiro.hook` SHALL gerar namespace, docblock e estrutura básica de classe conforme convenções de `boas-praticas-codigo.md`.
3. WHEN um novo arquivo `*Test.php` for criado, THE `scaffold-teste.kiro.hook` SHALL gerar estrutura PHPUnit básica: `extends TestCase`, `setUp()`, método de teste de exemplo.

---

### Requisito 11 — Criação de Prompts para Fluxos com MCP

**User Story:** Como desenvolvedor N3, quero prompts prontos para os fluxos que dependem de MCP, para que eu possa colá-los no chat e executá-los independente de como meu ambiente está configurado.

#### Critérios de Aceite

1. WHEN o Playbook for instalado, THE `docs/prompts/` SHALL conter os seguintes prompts em markdown, cada um com título, contexto de uso e o prompt completo para colar no chat:
   - `investigate-incident.md` — workflow Freshdesk → Jira → Grafana → Logs → Código → Hipóteses (substitui hook `incident-investigation` como fallback sem MCP)
   - `close-task.md` — preencher Causa Raiz + Resolução + horas em subtask + mover status (substitui hook `jira-close-task`)
   - `deliver-story.md` — criar PR + atualizar Jira + sub-testes QA + transição de status
   - `generate-pr.md` — gerar descrição de PR a partir do git diff
   - `war-room-status.md` — gerar relatório de tasks em Pendente de Produção + branches + pipeline
   - `triage-incident.md` — interpretar chamado Freshdesk, identificar sellers afetados, classificar severidade e criar card VSUS
   - `health-check.md` — verificar status dos ambientes HML e PRD via healthcheck
2. WHEN o dev colar um prompt no chat, THE Prompt SHALL funcionar mesmo sem MCP configurado, produzindo orientações passo a passo para execução manual.
3. WHEN o dev colar um prompt no chat com MCP configurado, THE Prompt SHALL usar os MCPs disponíveis automaticamente para executar as ações.

---

### Requisito 12 — Script de Instalação MVP

**User Story:** Como dev do time N3, quero um script de instalação simples que instale apenas o que funciona sem MCP, para que qualquer membro do time possa usar o playbook imediatamente após o clone.

#### Critérios de Aceite

1. WHEN o dev executar `node bin/install.mjs`, THE Script SHALL instalar apenas os itens sem dependência de MCP: 8 steerings, 3 skills e 3 hooks — e exibir o que foi instalado.
2. WHEN o dev executar `node bin/install.mjs --dry-run`, THE Script SHALL listar o que seria instalado sem modificar nenhum arquivo.
3. WHEN o dev executar `node bin/install.mjs --update`, THE Script SHALL atualizar os itens já instalados com a versão do repo.
4. WHEN o dev executar `node bin/install.mjs --target=workspace`, THE Script SHALL instalar em `.kiro/` do projeto atual em vez de `~/.kiro/`.
5. THE Script SHALL ter zero dependências externas em runtime — usar apenas módulos nativos do Node.js (fs, path, os, url).
6. THE Script SHALL preservar itens existentes sem sobrescrever, exceto quando `--update` for passado.
7. WHEN a instalação concluir, THE Script SHALL exibir o caminho para `docs/prompts/` lembrando o dev dos prompts disponíveis para fluxos com MCP.

---

### Requisito 13 — Atualização do `manifest.json`

**User Story:** Como mantenedor do playbook, quero que o manifest reflita exatamente os itens instalados pelo script MVP.

#### Critérios de Aceite

1. THE `manifest.json` SHALL conter entradas para todos os 12 itens MVP: 7 steerings + 2 skills + 3 hooks.
2. THE `manifest.json` SHALL ter campo `"mcp_required": false` em cada item, confirmando que nenhum item instalado depende de MCP.
   3. THE `manifest.json` SHALL remover as entradas de `deliver-story`, `incident-investigation-hook` e `jira-close-task` como itens instalados (esses viram prompts).
