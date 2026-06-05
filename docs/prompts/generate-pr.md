# Prompt: Generate PR Description

**Quando usar:** Após o desenvolvimento, para gerar a descrição do PR no template do time automaticamente a partir do git diff.

**Requer MCP:** Azure DevOps (opcional — sem MCP, você cria o PR manualmente com a descrição gerada)

---

## Prompt

Cole no chat do Kiro:

```
Gere a descrição do PR para a branch atual.

Analise:
1. O git diff da branch atual em relação à main
2. O ticket VSUS vinculado (baseado no nome da branch ou me informe: VSUS-XXX)
3. Os arquivos alterados e o que cada mudança faz

Gere a descrição no template do time:

## Sumário
[Descrição objetiva do que foi alterado e por quê]

## Motivação
[Contexto do problema — referenciar VSUS-XXX e chamado Freshdesk #XXXXX]

## Como testar
1. [Passo específico]
2. [Passo específico]

## Checklist
- [ ] Testes unitários escritos/atualizados
- [ ] Sem console.log / código de debug esquecido
- [ ] Variáveis de ambiente documentadas (se aplicável)
- [ ] Critérios de aceite do Jira verificados
- [ ] Impacto em outros módulos avaliado

## Jira — Campos obrigatórios
Causa Raiz (customfield_10169): O [componente] no endpoint [rota] tinha [N] problemas:
1. [Problema] — [consequência]
Cenário: [descrição]

Resolução (customfield_10168): 1. [Correção]. Arquivos: [lista]. PR: #[número] | Branch: [nome]

## Referências
- Jira: [VSUS-XXX](link)
- Freshdesk: [#XXXXX](link)
```
