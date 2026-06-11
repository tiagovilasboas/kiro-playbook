---
inclusion: always
---

# Code Review Routing — Voomp Creators

## Quem sou eu

- **Tiago de Carvalho Vilas Boas** — TL / Dev de Sustentação e Staff da Voomp
- **Squad:** Sustentação N3 (VSUS)
- **Coordenador:** Elvis Barbosa Martins

---

## Regra de Aprovação (seller-greenn-back)

| Ambiente | Quem aprova |
|----------|-------------|
| DEV | Devs da Squad |
| HML / PRD | **Tech Lead + Tech Lead Interino** |

**Para PRD, sempre acionar:**
- Eric Rodrigues Prates (TL) — eric.prates@cogna.com.br
- Carlos Eduardo Salles Mineiro Silva (TL Interino) — carlos.silva-sol@parceirosedu.com.br

---

## Mapa de Squads e Responsáveis

### Squad Gateway (VGAT)
| Papel | Nome | Email |
|-------|------|-------|
| Tech Lead | Elias Da Rosa | elias.rosa@cogna.com.br |
| PM | Fernando Melo Bedendo | — |
| QA | Lucas Rangel | — |
| Dev | Pedro Rago Da Silva | — |
| Dev | Filipe Lopes Gervasio | — |
| Dev | Gabriel da Silva Oliveira | — |
| Dev | Allan da Silva Ferreira | — |

**Repos:** api-gateway2, api-subscription2, api-gateway (legado)
**Domínio:** Pagamentos, assinaturas recorrentes, split de receita, pipeline-templates

### Squad Admin (VADM)
| Papel | Nome | Email |
|-------|------|-------|
| Tech Lead | Eric Rodrigues Prates | eric.prates@cogna.com.br |
| TL Interino | Carlos Eduardo Salles Mineiro Silva | carlos.silva-sol@parceirosedu.com.br |
| Dev | Tiago Bernardon | A483360@somoseducacao.com.br |
| Dev | Edeson Costa Azevedo | edeson.azevedo-k2p@parceirosedu.com.br |
| Dev | Kevin Nacipe Pereira Pessoa | kevin.pessoa-k2p@parceirosedu.com.br |
| Dev | Iago Costa de Macedo Puzer | iago.puzer-sol@parceirosedu.com.br |
| Dev | Allan Maia Gomes | allan.gomes-sol@parceirosedu.com.br |
| Dev | Vitor Fernando Crispim Arfelli | vitor.arfelli-k2p@parceirosedu.com.br |

**Repos:** seller-greenn-back, seller-greenn-adm, voomp-creators-adm, voomp-creators-adm-bff, voomp-creators-adm-root
**Domínio:** Painel admin, vendas, contratos, relatórios, financeiro, KYC

### Squad Sustentação N3 (VSUS)
| Papel | Nome | Email |
|-------|------|-------|
| Coordenador | Elvis Barbosa Martins | elvis.martins@cogna.com.br |
| TL / Staff | Tiago de Carvalho Vilas Boas | tiago.boas-k2p@cogna.parceirosedu.com.br |
| Dev | Marcos Vinicius Santos Nery | marcos.nery-k2p@cogna.parceirosedu.com.br |
| Dev | Fabio dos Santos Martins | fabio.martins-sol@cogna.parceirosedu.com.br |
| Dev | Luis Augusto Pardini (Guto) | — |
| Dev | Renata Maçãs Lopez | renata.lopez-sol@cogna.parceirosedu.com.br |
| QA | Vanessa Duso | vanessa.duso-sol@cogna.parceirosedu.com.br |

**Repo principal:** seller-greenn-back (compartilhado com Admin)
**Domínio:** Bugfix produção, investigação, sustentação, observabilidade

---

## Quem acionar por domínio

| Domínio do PR | Reviewer ideal | Alternativa |
|---------------|----------------|-------------|
| Checkout / Pagamentos / Recorrência | Eric Rodrigues Prates | Elias Da Rosa (se envolver gateway) |
| Financeiro / Split / Reembolso | Edeson Costa Azevedo | Allan Maia Gomes |
| Admin / Export / Relatórios | Carlos Eduardo Salles Mineiro Silva | Tiago Bernardon |
| Push / Webhooks / Integrações | Eric Rodrigues Prates | — |
| Pipeline / CI/CD / Infra | Elias Da Rosa | Eric Rodrigues Prates |
| Frontend Admin v2 | Kevin Nacipe | Vitor Arfelli |

---

## Template de solicitação de Code Review

Formato padrão para enviar no canal "[Voomp] Admin - Daily":

```
ENV: <DEV | HML | PRD>
BACK: <link do PR>
TASK: <link da task Jira>
DESCRIÇÃO: <título da task>
NEW ENVIROMENTS:
- <variáveis novas se houver>
COMMANDS:
- <comandos pós-deploy se houver>
REVIEWERS:
<nomes dos reviewers conforme regra acima>
```

---

## Regras

1. PRs para PRD **sempre** precisam de Eric + Carlos
2. PRs para DEV podem ser aprovados por qualquer dev da squad
3. Sustentação (VSUS) mergea na main do seller-greenn-back — segue regra de PRD
4. Hotfixes urgentes: Eric pode aprovar sozinho com justificativa no PR
5. Se o PR envolve domínio do Gateway (payment, subscription): adicionar Elias como reviewer
