# Guia de Perfis

Os perfis são **sugestões de ponto de partida** para a instalação — não restrições. Qualquer membro do time pode instalar qualquer item independentemente do seu perfil.

O perfil serve para filtrar o que é mais relevante para você logo de cara, sem precisar conhecer todos os itens disponíveis.

---

## Como usar perfis

```bash
# Instalar itens recomendados para dev
./node bin/install.mjs --profile=dev

# Combinar perfis
./node bin/install.mjs --profile=dev --profile=qa

# Perfil + filtro por categoria
./node bin/install.mjs --profile=qa --only=hooks

# Ver tudo, sem filtro
./node bin/install.mjs --all-items
```

O menu interativo aparece quando você usa `--profile` sem `--only` — você verá todos os itens com os do perfil pré-marcados, e pode alterar livremente antes de confirmar.

---

## Perfil: `pm` (Product Manager)

**Foco:** Contexto de produto, requisitos, critérios de aceitação e comunicação com o time técnico.

| Item | Tipo | Por que é útil |
|---|---|---|
| `n3-domain` | Steering global | Entender o domínio de sustentação ao escrever histórias |
| `commit-conventions` | Steering global | Referenciar INC/JIRA em commits quando contribuir |
| `code-review` | Steering global | Entender os critérios de qualidade que o time usa |
| `pm-product-context` | Steering de projeto | Formato de User Stories, EARS/SHALL, Definição de Pronto |
| `triage-de-incidente` | Skill | Entender o impacto e severidade de incidentes em andamento |
| `relatorio-de-sustentacao` | Skill | Gerar relatórios de sustentação para stakeholders |
| `entregar-historia` | Skill | Acompanhar o ciclo de entrega das histórias |
| `post-commit-check` | Hook | Garantir commits com referência ao ticket |
| `pr-description-helper` | Hook | Descrições de PR padronizadas |

---

## Perfil: `qa` (Quality Assurance)

**Foco:** Estratégia de testes, validação de critérios de aceite e detecção de incidentes.

| Item | Tipo | Por que é útil |
|---|---|---|
| `n3-domain` | Steering global | Contexto de domínio para testes mais realistas |
| `commit-conventions` | Steering global | Padrão de commits ao fazer fixes de QA |
| `code-review` | Steering global | Critérios de review que impactam a qualidade |
| `qa-testing-strategy` | Steering de projeto | Tipos de teste, cobertura mínima e padrões de nomenclatura |
| `triage-de-incidente` | Skill | Classificar bugs e incidentes com severidade correta |
| `relatorio-de-sustentacao` | Skill | Incluir métricas de qualidade no relatório |
| `entregar-historia` | Skill | Validar critérios de aceite no Jira antes de marcar como Pronto |
| `post-commit-check` | Hook | Commits de QA com referência ao INC ou JIRA |
| `pr-description-helper` | Hook | Descrever o que foi testado no PR |
| `incident-file-created` | Hook | Template automático ao criar arquivo de incidente |

---

## Perfil: `dev` (Desenvolvedor)

**Foco:** Desenvolvimento, code review, convenções de código e fluxo de entrega.

| Item | Tipo | Por que é útil |
|---|---|---|
| `n3-domain` | Steering global | Contexto do domínio para sugestões mais precisas |
| `commit-conventions` | Steering global | Validação automática de commits |
| `code-review` | Steering global | Critérios e boas práticas de review |
| `triage-de-incidente` | Skill | Diagnosticar incidentes com análise de logs |
| `relatorio-de-sustentacao` | Skill | Gerar relatórios técnicos de sustentação |
| `entregar-historia` | Skill | PR + Jira + code review em um fluxo só |
| `post-commit-check` | Hook | Verificação automática de padrão de commit |
| `pr-description-helper` | Hook | Descrição padronizada de PR gerada automaticamente |
| `incident-file-created` | Hook | Preenchimento automático do template de incidente |

---

## Tag `all`

Itens marcados com `profiles: [all]` aparecem pré-selecionados em qualquer perfil. São as configurações que fazem sentido para todo o time, independente do papel.

Itens com tags específicas (ex: `[qa]`, `[pm]`) ainda podem ser instalados por qualquer membro — a tag é apenas uma sugestão de relevância.
