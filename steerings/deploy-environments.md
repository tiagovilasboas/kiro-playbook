---
inclusion: auto
---

# Ambientes e Deploy — Voomp Creators

## Mapeamento extraEnv → Ambiente → URL

### seller-greenn-back (API Back)

| extraEnv | Ambiente | Cluster | URL API | Namespace |
|---|---|---|---|---|
| `none` + branch `feature/*` | DEV | aks-dev | apipay.voompcreators.dev.br | voomp-creators-back |
| `dev1` | DEV1 | aks-dev | apipay.voompcreators.dev.br (dev1) | voomp-creators-back-dev1 |
| `dev2` | DEV2 | aks-dev | apipay.voompcreators.dev.br (dev2) | voomp-creators-back-dev2 |
| `dev3` | DEV3 | aks-dev | — | voomp-creators-back-dev3 |
| `none` + branch `release/*` | HML | aks-hml | apipay.voompcreators.net.br | voomp-creators-back |
| `hml1` | HML1 | aks-hml | apipay.voompcreators.net.br (hml1) | voomp-creators-back-hml1 |
| `hml2` | HML2 | aks-hml | apipay.voompcreators.net.br (hml2) | voomp-creators-back-hml2 |
| `none` + branch `main` (trigger CI) | PRD | aks-prd | apipay.voompcreators.com.br | voomp-creators-back |

### Outros serviços

| Serviço | DEV | HML | PRD |
|---|---|---|---|
| Admin | adm.voompcreators.dev.br | adm.voompcreators.net.br | adm.voompcreators.com.br |
| ERP | erp.voompcreators.dev.br | — | erp.voompcreators.com.br |
| Play | app.voompplay.dev.br | — | app.voompplay.com.br |
| Checkout | pay.voompcreators.dev.br | pay.voompcreators.net.br | pay.voompcreators.com.br |

---

## Regras de deploy

| Branch | extraEnv | Resultado |
|---|---|---|
| `feature/*` | `none` | Deploya em **DEV** (namespace padrão) |
| `feature/*` | `dev1` | Deploya em **DEV1** (namespace dedicado) |
| `release/*` | `none` | Deploya em **HML** |
| `release/*` | `hml1` | Deploya em **HML1** |
| `main` | trigger automático | Deploya em **PRD** (sem intervenção manual) |
| `hotfix/*` | `none` | Deploya em **PRD** (manual) |

---

## Pipeline

- **Pipeline ID:** 16417
- **Nome:** `voomp-creators-back-CI`
- **Repo template:** `PlataformaCogna-MKTP-MVP/pipeline-templates`
- **Template usado:** `template_php_aks.yaml`

### Variable Groups

| Grupo | Tipo |
|---|---|
| `voomp-creators-back` | Library (variáveis não-sensíveis + prefixo por ambiente) |
| `voomp-shared-secrets` | Key Vault (secrets) |

### Convenção de variáveis na Library

- Variáveis com **mesmo valor** em todos ambientes: sem prefixo (ex: `DD_SERVICE`)
- Variáveis **por ambiente**: prefixo `DEV_`, `HML_`, `PRD_`, `DEV1_`, `DEV2_`, `HML1_` etc.
- O pipeline faz o replace automaticamente baseado no ambiente

---

## Key Vault + External Secrets

- Secrets no Azure Key Vault → injetadas como env vars via External Secrets no Kubernetes
- Toda secret no manifesto PRECISA existir no Key Vault (external secrets não cria)
- `remoteRef` = nome no Key Vault
- `secretKey` = nome da env var no container

---

## Acesso

- **DEV:** requer VPN (Akamai bloqueia acesso externo)
- **HML:** acesso público (*.net.br)
- **PRD:** acesso público (*.com.br) — deploy automático ao merge na main

---

## Healthcheck

- Rota: `GET /FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy`
- Retorna: hash, branch, environment, pod_name, redis, mysql

---

## Namespaces Kubernetes

Para extraEnv funcionar, o namespace precisa existir no cluster com label `project: voomp`.
Formato: `{namespace-base}-{extraEnv}` (ex: `voomp-creators-back-dev1`)
