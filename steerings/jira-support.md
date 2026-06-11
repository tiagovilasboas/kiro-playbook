---
inclusion: auto
---

# Jira — Sustentação N3

## Contexto
- Projeto: VSUS ([Voomp] Sustentação)
- Board: 2477 (Kanban)
- Fix Version: [VSUS] PI 2/26
- Org Atlassian: cogna.atlassian.net

## Ao criar ou atualizar tasks VSUS

### Campos obrigatórios para bugs
- **Descrição:** contexto do problema, evidências, impacto, comportamento esperado
- **Causa Raiz** (customfield_10169): preencher após análise — objetivo, sem código extenso
- **Descrição da Resolução** (customfield_10168): o que foi feito, arquivos alterados, PR e branch

### Formato padrão da descrição de bug
```
| ID Seller | CNPJ | Nome | Email |
| --- | --- | --- | --- |

[Descrição do problema]

### Impacto
[O que está sendo afetado]

### Comportamento esperado
[O que deveria acontecer]

### Riscos identificados
- [Risco 1]
- [Risco 2]
```

### Formato padrão da Causa Raiz
```
O [componente] no endpoint [rota] tinha [N] problemas:
1. [Problema 1] — [consequência]
2. [Problema 2] — [consequência]

Cenário: [descrição do cenário que causou o bug]
```

### Formato padrão da Resolução
```
1. [Correção 1]
2. [Correção 2]
3. [Correção 3]

Arquivos: [lista de arquivos alterados]
PR: #[número] | Branch: [nome da branch]
```

## Registro de horas
- Horas devem ser registradas em **subtasks** (Subtarefa, Sub-bug, Sub-teste)
- NUNCA registrar worklog diretamente no bug pai
- Criar subtask com título: `[DEV] [descrição da atividade]`

## Transições de status

### Fluxo completo do workflow VSUS
```
Backlog → Em Andamento → Em desenvolvimento → Revisão de código → Em teste → Concluído → Aceito → Pendente de Produção → Em produção
```

### Campos obrigatórios por transição
| Transição | Campo obrigatório |
|-----------|-------------------|
| → Em Andamento | `Estimativa Original` (ex: "2h", "4h", "1d") |
| → Em produção | `Descrição da Resolução` (customfield_10168) |

### Para mover de "Em produção" de volta (reabertura)
- **Não existe transição direta** de "Em produção" → qualquer status anterior
- Única opção disponível via API: "🚩 Impedir item"
- Para reabrir: coordenação precisa fazer manualmente pelo board

### Fluxo para colocar em "Revisão de código" a partir do Backlog
1. Backlog → Em Andamento (precisa de `Estimativa Original`)
2. Em Andamento → Em desenvolvimento
3. Em desenvolvimento → Revisão de código

### Fluxo normal de desenvolvimento (IDs sequenciais)
```
11 → 21 → 51 → 91
(Em Andamento) → (Em desenvolvimento) → (Enviar para testes) → (Concluir item)
```

### Tabela completa de IDs de transição

| ID | Nome | De qual status | Para qual status |
|----|------|---------------|-----------------|
| 11 | Em andamento | Backlog | Em Andamento |
| 21 | Iniciar desenvolvimento | Em Andamento | Em desenvolvimento |
| 51 | Enviar para testes | Revisão de código | Em teste |
| 71 | Bloquear item | Vários | Bloqueado |
| 91 | Concluir item | Vários | Concluído |
| 121 | Solicitar ajustes | Revisão de código | Volta pra dev |
| 131 | Início indevido | Em Andamento | Backlog |
| 161 | Implantar item | Pendente de Produção | Em produção |
| 171 | Pausar atividade | Em Andamento | Em espera |
| 221 | Cancelar item | Vários | Cancelado |
| 301 | 🚩 Impedir item | Qualquer | Flag de impedimento |

### Subtasks (workflow diferente)
| ID | Nome |
|----|------|
| 11 | Em Andamento |
| 21 | Item bloqueado |
| 41 | Item concluído |
| 61 | Em espera |
| 91 | Início indevido |
| 101 | Subtask Aceita |
| 71 | Item cancelado |

### Campos obrigatórios por transição
| Transição | Campo obrigatório |
|-----------|-------------------|
| → Em Andamento (11) | `Estimativa Original` (setar via update antes de transicionar) |
| → Em produção (161) | `Descrição da Resolução` (customfield_10168) |
| → Bloquear item (71) | Campo "comentar" no formato Atlassian Document |

**Nota:** Sempre usar `get_transitions` antes de transicionar — os IDs disponíveis mudam conforme o status atual.

---

## Bloqueios e Flags

### Como marcar um bloqueio

Quando uma task está impedida por dependência externa:

```
Campo: customfield_10021 (Flagged)
Valor: [{"value": "Impediment"}]
```

### Formato de comentário de bloqueio

```markdown
## 🚫 BLOQUEADO — DD/MM/YYYY

### Motivo do bloqueio
[Descrição clara do impedimento]

### O que depende do desbloqueio
- [Item 1]

### Quem pode desbloquear
| Ação | Responsável | Status |
|---|---|---|
| [Ação] | [Pessoa] | ⏳ Aguardando |

### Estimativa após desbloqueio
[Tempo estimado]
```

### Ao desbloquear

1. Remover flag: `customfield_10021 = null`
2. Comentário: `## ✅ DESBLOQUEADO — DD/MM/YYYY`
3. Seguir com próximo passo

### Quando usar flag

| Situação | Flag? |
|---|---|
| Aguardando acesso externo | ✅ |
| Aguardando billing/financeiro | ✅ |
| Aguardando outra squad | ✅ |
| Aguardando SRE | ✅ |
| PR aguardando review | ❌ (fluxo normal) |
| QA não começou | ❌ (sequência normal) |
