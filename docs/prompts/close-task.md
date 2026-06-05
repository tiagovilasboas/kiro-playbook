# Prompt: Close Task (Jira)

**Quando usar:** Após implementar o fix e ter o PR pronto, para preencher Causa Raiz, Resolução, registrar horas e mover o status.

**Requer MCP:** Jira (sem MCP, o Kiro gera os textos prontos para colar manualmente)

---

## Prompt

Cole no chat do Kiro:

```
Preciso fechar a task [VSUS-XXX]. Me ajude a:

1. Preencher a Causa Raiz (customfield_10169) no formato:
   "O [componente] no endpoint [rota] tinha [N] problemas:
   1. [Problema 1] — [consequência]
   2. [Problema 2] — [consequência]
   Cenário: [descrição do que causou o incidente]"

2. Preencher a Descrição da Resolução (customfield_10168) no formato:
   "1. [Correção 1]
   2. [Correção 2]
   Arquivos: [lista de arquivos alterados]
   PR: #[número] | Branch: [nome da branch]"

3. Criar subtask "[DEV] Implementação VSUS-XXX" se não existir
4. Registrar [X] horas NA SUBTASK (NUNCA no pai — automation do Jira rejeita)
5. Mover a task para "Pendente de Produção"

Contexto: [descreva o que foi feito, arquivos alterados, PR criado]
```

---

## Regras importantes

- **Horas sempre na subtask** — registrar worklog no incidente pai é rejeitado pela automation do Jira
- **Causa Raiz antes de mover** — o campo `customfield_10169` deve estar preenchido para mover para "Pendente de Produção"
- **Sub-testes criados?** — confirme que `[QA] Planejar cenário de testes` e `[QA] Executar cenário de testes` existem antes de fechar
