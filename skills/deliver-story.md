---
version: 1.0.0
profiles: [all]
description: "Guia para ciclo completo de entrega de história: PR, Jira, QA e code review"
---

# Skill: Deliver Story

## O que esta skill faz

Skill criada pelo time N3 para guiar o ciclo completo de entrega de uma história de usuário: criação do PR, preenchimento do Jira, vinculação de incidentes e transição de status.

Ao ativar esta skill, o Kiro assume o ciclo completo de entrega: cria o PR com a descrição no template do time, preenche os campos obrigatórios no Jira, comenta no ticket com link para o PR e orienta o próximo passo (revisão de código ou QA).

## Como usar

Diga ao assistente para ativar a skill:

> "Entregar história [VSUS-XXXX]"

Ou com mais contexto:

> "Quero entregar a história VSUS-1234 — as mudanças estão na branch `feature/fix/VSUS-1234_descricao`"

O assistente irá:

1. Verificar o status atual da branch e commits pendentes
2. Criar o PR com o template do time preenchido
3. Vincular o PR ao ticket Jira correspondente
4. Preencher os campos obrigatórios no Jira (critérios de aceite, INC vinculado se houver)
5. Adicionar comentário no Jira com o link do PR e status
6. Orientar os próximos passos (quem deve revisar, o que QA precisa testar)

## Customizações N3

### Template de PR do time

Todo PR do time N3 deve seguir este template na descrição:

```markdown
## Sumário

[Descrição objetiva do que foi alterado e por quê]

## Motivação

[Contexto do problema que esta mudança resolve — referenciar INC-XXXX ou JIRA-XXXX se houver]

## Como testar

[Passos para o revisor ou QA validar a mudança]
1. ...
2. ...

## Checklist

- [ ] Testes unitários escritos/atualizados
- [ ] Sem console.log / código de debug esquecido
- [ ] Variáveis de ambiente documentadas (se aplicável)
- [ ] Critérios de aceite do Jira verificados
- [ ] Impacto em outros sistemas avaliado

## Referências

- Jira: [JIRA-XXXX](link)
- Incidente relacionado: [INC-XXXX](link) _(se aplicável)_
```

### Campos Jira obrigatórios

Antes de marcar uma história como pronta para review ou QA, os seguintes campos devem estar preenchidos no ticket Jira:

| Campo | Obrigatoriedade | Descrição |
|---|---|---|
| **Critérios de aceite** | Obrigatório | Todos os critérios devem estar listados e verificados |
| **Incidente vinculado** | Obrigatório se aplicável | Se a história corrige ou deriva de um incidente, o INC-XXXX deve estar linkado no campo "Relates to" |
| **Assignee** | Obrigatório | Deve estar atribuído ao desenvolvedor responsável |
| **Sprint** | Obrigatório | Deve estar na sprint correta antes de mover para "Em Review" |
| **Fix Version** | Recomendado | Preencher se a entrega está associada a uma release específica |

### Fluxo de transição Jira

```
Em Andamento → Pendente de Produção (PR aprovado + QA validado em HML)
Pendente de Produção → Em produção (após deploy PRD via war room)
```

> A skill atualiza automaticamente o status do Jira ao longo do fluxo quando acionada em cada etapa.

## Pré-requisitos

Para que a skill funcione completamente, o MCP do Jira (ou Azure DevOps) deve estar configurado na sua máquina. Sem o MCP, o Kiro ainda consegue criar o PR e orientar os passos, mas não atualiza o Jira automaticamente.

Consulte o guia de MCPs em [`docs/mcp-guide.md`](../docs/mcp-guide.md) para instruções de configuração.

Além disso:
- Você deve estar em uma branch de feature (não `main` ou `develop`)
- O ticket Jira deve existir e ser acessível pela sua conta

## Exemplos de uso

### Exemplo 1: Entrega simples de história

```
Você: Entregar história VSUS-890
Kiro: Encontrei a branch feature/fix/VSUS-890_ajuste-relatorio com 3 commits. Vou criar o PR agora.

[Cria PR #247 com template preenchido]
[Vincula PR ao VSUS-890 no Jira]
[Move ticket para "Em Andamento"]

✅ PR criado: https://dev.azure.com/kdop/PlataformaCogna-MKTP-MVP/_git/seller-greenn-back/pullrequest/247
✅ Jira atualizado: VSUS-890 — PR vinculado
✅ Comentário adicionado no Jira com link do PR

Próximo passo: aguardar aprovação de 1 revisor. Após aprovação e QA em HML → mover para "Pendente de Produção".
```

### Exemplo 2: Entrega com incidente vinculado

```
Você: Quero entregar a VSUS-912 — ela corrige o incidente #60600
Kiro: Vou criar o PR com referência ao incidente #60600.

[Cria PR com seção "Referências" preenchida com o chamado Freshdesk]
[Vincula incidente no campo "Relates to" do Jira]
[Preenche Causa Raiz e Resolução a partir da análise]

⚠️ Nota: Critérios de aceite em branco. Preenchi com base na descrição, mas revise antes de enviar para QA.
```

### Exemplo 3: Orientação sem MCP configurado

```
Você: Entregar história VSUS-855
Kiro: Não tenho acesso ao Jira/Azure configurado. Vou criar o PR e te passar os passos manuais.

[Gera a descrição de PR com o template preenchido]

Para completar manualmente:
1. Crie o PR no Azure DevOps com a descrição gerada
2. Acesse VSUS-855 no Jira
3. Preencha customfield_10169 (Causa Raiz) e customfield_10168 (Resolução)
4. Crie as subtasks: [QA] Planejar cenário de testes e [QA] Executar cenário de testes
5. Mova para "Pendente de Produção" após aprovação + QA
```
