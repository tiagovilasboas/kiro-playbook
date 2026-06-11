---
inclusion: manual
---

# War Room — Fluxo de Consolidação e Deploy

## O que é
War room é uma branch consolidada (`feature/VSUS_war-room-qa`) que agrupa múltiplos fixes para validação conjunta em DEV antes de subir individualmente para PRD.

## Fluxo

1. Criar branch `feature/VSUS_war-room-qa` a partir da `main` atualizada
2. Mergear cada branch de fix na war-room (sem PR, merge direto)
3. Rodar testes unitários no Docker (`voomp-back-php`)
4. Rodar pipeline em DEV (branch `feature/*` → DEV)
5. QA valida em DEV
6. Cada fix aprovado abre PR individual para `main`
7. Após merge na main, pipeline deploya em PRD automaticamente

## Comandos típicos

```bash
# Criar war-room a partir da main
git checkout main && git pull && git checkout -b feature/VSUS_war-room-qa

# Mergear uma branch
git fetch origin feature/fix/VSUS-XXX
git merge origin/feature/fix/VSUS-XXX --no-edit

# Atualizar war-room com main (manter sincronizada)
git fetch origin main && git merge origin/main --no-edit

# Push
git push -u origin feature/VSUS_war-room-qa
```

## Verificar status das branches

```bash
# Checar quais branches já estão na main (prod)
git branch -r --merged origin/main | grep "origin/feature/fix/VSUS"
```

## Regras
- `composer.lock` — ignorar conflitos, não priorizar
- Ordem de merge: começar pelas branches com menos arquivos alterados
- Sempre atualizar com `origin/main` antes de mergear novas branches
- Após deploy em PRD: deletar a branch war-room (`git push origin --delete`)

## Report de War Room

Formato padrão para comunicar o que subiu:

```
**ENV:** PRD
**BACK:** https://dev.azure.com/kdop/PlataformaCogna-MKTP-MVP/_git/seller-greenn-back/pullrequest/[ID]
**TASK:** https://cogna.atlassian.net/browse/VSUS-[ID]
**Descrição:** [descrição objetiva do fix]
**DEV:** [nome do desenvolvedor]
```
