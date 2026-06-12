---
inclusion: manual
---

# Estrutura do Confluence — Sustentação N3

## Localização

**Space:** Voomp  
**Pasta raiz:** [Sustentação](https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2337308717)

---

## Estrutura de pastas

```
📁 Sustentação (2337308717)
├── 📁 🚀 Onboarding & Setup (2799927300)
│   └── 📄 Onboarding — Squad Sustentação N3 (2765881423)
│
├── 📁 🔧 Ferramentas & Workflow (2799009814)
│   ├── 📄 Playbook Grafana — Sustentação N3 (2773942278)
│   ├── 📄 Modelos de IA no Kiro - Guia de Uso (2767224836)
│   ├── 📄 Agent Hooks - Automações Sustentação N3 (2777514016)
│   └── 📄 Steerings e Skills - Contexto Inteligente (2777514037)
│
├── 📁 🔍 Investigações & Análises (2800025604)
│   └── 📄 VSUS-688 — Webhook Pagar.me (2789834861)
│       ├── 📄 Cross-Squads (2788196476)
│       └── 📄 VSUS-688 — Plano de Ação (2787901517)
│
└── 📁 💀 Post-Mortem — Sustentação N3 (2800254978)
    └── 📄 Post-Mortem VSUS-701 (2799435783)
```

---

## Regra para cada sub-pasta

**Toda sub-pasta DEVE ter uma página inicial (index) com:**
1. Descrição do propósito da pasta
2. Lista de páginas filhas com link e descrição curta
3. Critério de quando adicionar nova página nessa pasta

**Exemplo de estrutura da página inicial:**

```markdown
> Breve descrição do que esta pasta contém.

## Páginas nesta seção

| Página | O que contém |
|---|---|
| [Nome da página](link) | Descrição curta |

## Quando adicionar aqui
- Critério 1
- Critério 2
```

---

## Critério por pasta

### 🚀 Onboarding & Setup
Adicionar aqui quando: guia de setup, configuração de ambiente, checklist de integração para novos membros.

### 🔧 Ferramentas & Workflow
Adicionar aqui quando: runbook de ferramenta (Grafana, Kiro, pipeline), guia de uso, automações.

### 🔍 Investigações & Análises
Adicionar aqui quando: análise técnica de um bug/incidente, RFC, ADR, plano de ação. Nomear como `VSUS-XXX — Título curto`.

### 💀 Post-Mortem
Adicionar aqui quando: incidente que se enquadra nos critérios do post-mortem (ver steering `post-mortem-sustentacao.md`). Nomear como `Post-Mortem VSUS-XXX — Título — DD/MM/YYYY`.

---

## Quando criar nova sub-pasta

Criar nova sub-pasta quando uma categoria nova acumular **3+ páginas** que não se encaixam nas pastas existentes. Exemplos possíveis no futuro:
- `📋 Processos & Runbooks` — se runbooks específicos de processo se acumularem
- `🧪 QA & Testes` — se cenários de teste documentados crescerem

Não criar pastas para 1-2 páginas — colocar diretamente na raiz da pasta mais próxima.

---

## Links rápidos

| Pasta | Link |
|---|---|
| Sustentação (raiz) | https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2337308717 |
| 🚀 Onboarding & Setup | https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2799927300 |
| 🔧 Ferramentas & Workflow | https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2799009814 |
| 🔍 Investigações & Análises | https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2800025604 |
| 💀 Post-Mortem | https://cogna.atlassian.net/wiki/spaces/Voomp/pages/2800254978 |
