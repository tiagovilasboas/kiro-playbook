# Contributing to kiro-playbook

Este repositório distribui artefatos Kiro para a Squad Sustentação N3. Mas antes de tudo, uma coisa precisa ficar clara.

---

## Kiro é uma ferramenta pessoal

Não existe steering, skill ou hook que seja bala de prata. O que está neste repo são **padrões do time** — fluxo Jira, critérios de severidade, convenções de código — coisas que fazem sentido para todo mundo no N3.

Mas os artefatos mais valiosos que você vai usar no dia a dia são os que **você mesmo criar**. Porque o Kiro fica poderoso quando você o ensina sobre **o seu contexto específico** — os módulos que você mais toca, as armadilhas que você já caiu, o tipo de análise que você faz toda semana.

> **O objetivo deste repositório não é te dar a configuração certa. É te ensinar a criar os seus próprios superpoderes.**

Os artefatos aqui são um ponto de partida e um espelho do conhecimento coletivo do time. Use-os, quebre-os, melhore-os. Quando algo que você criou fizer sentido para o time inteiro, abre um PR.

---

## O que entra neste repo

Só entra o que atende os três critérios:

1. **É padrão do time, não preferência de um dev** — fluxo Jira, critérios N3, stack da plataforma, DOR, DOD, boas práticas definidas coletivamente
2. **Funciona sem MCP** — qualquer dev usa no primeiro clone (se precisa de MCP, vira prompt)
3. **Foi validado na prática** — não é especulativo, alguém usou e gerou valor

O que não cabe aqui: preferências pessoais de estilo, configurações específicas de um repositório, automações que só fazem sentido para um dev.

---

## Criando uma Steering

Steerings são arquivos Markdown que o Kiro lê para entender o contexto. Nome do arquivo em inglês, kebab-case.

```bash
touch steerings/meu-contexto.md
# Nome em inglês: touch steerings/my-context.md
```

**Estrutura mínima:**

```markdown
---
inclusion: auto
---

# [Título em inglês]

[Contexto específico do time N3 — quanto mais concreto, melhor]
```

**Tipos de inclusão:**

| `inclusion` | Quando o Kiro carrega |
|---|---|
| `auto` | Sempre — use para contexto sempre relevante |
| `fileMatch` + `fileMatchPattern` | Ao abrir arquivos que batem o padrão — use para contexto específico de código |
| `manual` | Só quando referenciado via `#` no chat — use para contexto pesado e sob demanda |

**Exemplos do que colocar:**
- Contexto de domínio do time (fluxos, tabelas, componentes)
- Padrões de código e convenções
- Regras de negócio relevantes para o código

Depois adicione no `manifest.json`:

```json
{
  "id": "my-context",
  "name": "My Context",
  "type": "steering",
  "mcp_required": false,
  "source": "steerings/my-context.md",
  "destination": "~/.kiro/steering/my-context.md"
}
```

---

## Criando uma Skill

Skills definem uma capacidade especializada ativada por linguagem natural. Nome do arquivo em inglês.

```bash
touch skills/my-skill.md
```

**Estrutura:**

```markdown
---
version: 1.0.0
profiles: [all]
description: "O que a skill faz em uma frase"
---

# Skill: [Nome]

## O que esta skill faz
[Descreva o comportamento esperado]

## Como usar
> "Frase para acionar a skill"

## Entrada esperada
[O que o dev precisa fornecer]

## Saída esperada
[O que o Kiro vai retornar]

## Exemplos reais
[Exemplos com contexto real da Voomp — VSUS-XXX, sellers, endpoints]
```

**Regra:** skills só entram no playbook se não dependerem de MCP. Se precisar de Jira ou Azure DevOps, vira prompt.

---

## Criando um Hook

Hooks automáticos (sem MCP) ficam em `hooks/dev/`. Nome em inglês, kebab-case.

```bash
touch hooks/dev/my-hook.kiro.hook
```

**Estrutura:**

```json
{
  "enabled": true,
  "name": "My Hook",
  "description": "O que ele faz",
  "version": "1",
  "when": {
    "type": "fileEdited",
    "patterns": ["src/app/**/*.php"]
  },
  "then": {
    "type": "runCommand",
    "command": "php -l \"${file}\" 2>&1 | grep -v 'No syntax errors' || true"
  }
}
```

**Eventos úteis:**

| Evento | Quando dispara |
|---|---|
| `fileEdited` | Ao salvar arquivo — adicione `"patterns"` |
| `fileCreated` | Ao criar arquivo novo |
| `userTriggered` | Manualmente via painel Agent Hooks |
| `preTaskExecution` | Antes de executar task de spec |
| `postTaskExecution` | Após completar task de spec |

**Regra:** hooks que dependem de MCP (Jira, Grafana, Azure DevOps) não entram no script — vire um prompt.

---

## Criando um Prompt

Prompts ficam em `docs/prompts/`. São instruções prontas para colar no chat — funcionam com ou sem MCP.

```bash
touch docs/prompts/my-prompt.md
```

**Estrutura:**

```markdown
# Prompt: [Título em inglês]

**Quando usar:** [situação]

**Requer MCP:** [qual MCP] (opcional — sem MCP, o Kiro orienta os passos manuais)

---

## Prompt

Cole no chat do Kiro:

\```
[Instrução completa pronta para colar]
\```
```

---

## Adicionando ao manifest

Após criar o artefato, adicione no `manifest.json` (apenas steerings, skills e hooks — prompts não vão no manifest):

```json
{
  "id": "kebab-case-id",
  "name": "Title Case Name",
  "type": "steering|skill|hook",
  "mcp_required": false,
  "source": "caminho/do/arquivo.md",
  "destination": "~/.kiro/caminho/do/arquivo.md"
}
```

---

## Antes de abrir o PR

- [ ] Nome do arquivo em inglês, kebab-case
- [ ] Conteúdo usa terminologia do time N3 (incidente, não bug — VSUS, não ACV2)
- [ ] Se é steering/skill/hook: funciona sem MCP (`mcp_required: false`)
- [ ] Se precisa de MCP: está em `docs/prompts/`, não no manifest
- [ ] Exemplos são reais — VSUS-XXX reais, endpoints reais, tabelas reais
- [ ] `manifest.json` atualizado (se aplicável)
- [ ] `README.md` atualizado

---

## Criando artefatos pessoais (não precisa abrir PR)

Os mais valiosos são os que ficam só na sua máquina. Você não precisa compartilhar — só criar.

**Onde colocar:**

```
~/.kiro/steering/   → steerings pessoais (carregam em qualquer projeto)
~/.kiro/skills/     → skills pessoais
~/.kiro/hooks/      → hooks pessoais (não aparecem no painel)
```

**O que vale criar só para você:**

- Uma steering com os módulos que você mais mexe e as pegadinhas que você já caiu
- Uma steering com o contexto de um seller ou sistema específico que você suporta recorrentemente
- Um hook que dispara quando você abre um arquivo de um serviço que você conhece bem
- Um prompt para o tipo de análise que você faz toda semana mas nunca está no formato certo
- Uma skill para um fluxo que só você executa

**Quando compartilhar:** quando você usar algo por 2-3 semanas e perceber que funcionaria para qualquer dev do time, abre um PR com o artefato e uma linha explicando o valor que gerou para você.
