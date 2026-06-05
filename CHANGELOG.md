# Changelog

Todas as mudanças relevantes neste repositório são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) e este projeto adota [Versionamento Semântico](https://semver.org/).

---

## [v3.0.0] — 2026-06-05

Curadoria completa do playbook. Filosofia revisada: script instala apenas artefatos sem dependência de MCP. Fluxos com MCP viram prompts.

### Adicionado

**Steerings**
- `project-context.md` — stack, repositórios, frentes de atuação, fluxo operacional, equipe N3
- `code-best-practices.md` (fileMatch `*.php`) — KISS, YAGNI, DRY, naming, error handling, MySQL, Redis
- `payment-resilience.md` (fileMatch `*Payment*.php`) — 6 regras de ouro para código financeiro, arquitetura dos 4 fluxos de pagamento
- `unit-tests.md` (fileMatch `*Test.php`) — PHPUnit, comandos Docker, convenções PHP 7.4

**Skills**
- `post-mortem.md` — documenta incidentes N3 com os 7 critérios do time, template completo para Confluence

**Hooks automáticos (sem MCP)**
- `php-lint-on-save.kiro.hook` — `php -l` ao salvar `*.php` em `src/app`
- `scaffold-php.kiro.hook` — gera estrutura de classe ao criar `*.php`
- `scaffold-teste.kiro.hook` — gera estrutura PHPUnit ao criar `*Test.php`

**Prompts** (`docs/prompts/`)
- `investigate-incident.md` — Jira → Grafana → Logs → Código → Banco → Hipóteses
- `triage-incident.md` — interpretar chamado Freshdesk e criar card VSUS
- `close-task.md` — Causa Raiz + Resolução + horas em subtask + mover status
- `deliver-story.md` — PR + Jira + sub-testes QA + transição de status
- `generate-pr.md` — descrição de PR a partir do git diff
- `war-room-status.md` — relatório de tasks prontas + branches + pipeline
- `health-check.md` — status dos ambientes HML e PRD

### Alterado

- `incident-investigation.md` — renomeado de `bug-investigation.md`, fluxo atualizado com Grafana e subtask "Análise de caso" como etapa 1
- `jira-workflows.md` — reescrito: 9 status reais, 4 labels, estrutura completa de subtasks com títulos padrão, 3 boards, Fix Version, transições corretas
- `environments-deploy.md` — adicionados clusters AKS reais, resource groups e namespaces de serviços adjacentes
- `incident-triage.md` — reescrita completa com critérios P1–P4 reais da Voomp, mapeamento de componentes, queries Grafana e exemplos VSUS reais
- `deliver-story.md` — corrigido para VSUS (era ACV2), transições corretas, exemplos reais, referências de arquivo corretas
- `install.mjs` — reescrito sem dependências externas, só módulos nativos Node.js
- `manifest.json` — v3, apenas itens sem MCP, campo `mcp_required: false`
- Todos os nomes de arquivo migrados para inglês (kebab-case)

### Removido

- Hooks `bug-investigation` e `jira-close-task` do script de instalação — viraram prompts em `docs/prompts/`
- Skill `deliver-story` do script de instalação — virou prompt (depende de MCP para funcionar completamente)
- Dependência `@inquirer/prompts` do `package.json`
- Flags `--profile`, `--only`, `--all-items` do script (simplificação MVP)

---

## [v2.0.0] — 2026-05-29

### Adicionado

- Steerings: `jira-workflows.md`, `environments-deploy.md`, `bug-investigation.md`
- Skills: `incident-triage.md`, `deliver-story.md`
- Hooks: `bug-investigation.kiro.hook`, `jira-close-task.kiro.hook`
- Script `bin/install.mjs` com suporte a `--profile`, `--target`, `--dry-run`, `--update`
- `manifest.json` v2

---

## [v1.0.0] — 2025-07-18

Versão inicial com steerings globais, skills e hooks para perfis dev/qa/pm.

<!-- Links de referência -->
[v3.0.0]: https://github.com/cogna/kiro-playbook/releases/tag/v3.0.0
[v2.0.0]: https://github.com/cogna/kiro-playbook/releases/tag/v2.0.0
[v1.0.0]: https://github.com/cogna/kiro-playbook/releases/tag/v1.0.0
