---
inclusion: manual
---

# n8n Workflows — Voomp Creators

## Visao Geral

- **Repo versionado:** `voomp-creators-n8n` (Azure DevOps: PlataformaCogna-MKTP-MVP) — apenas 23 workflows
- **Instancia live:** https://integration.voompcreators.net.br — **259 workflows totais**
- **Ativos:** 102 | **Inativos:** 156
- **Banco:** MySQL PRD (credential ID: `96XFirojx8r9EvxB`)
- **Integrações:** Bitrix24, Cosmos/Platos, AlpaClass, Coursera, Voomp Play, ActiveCampaign, Google Sheets, SendGrid, Hubspot, Freshdesk, Supabase, SharePoint

## Gap de Governança

| Métrica | Valor |
|---------|-------|
| Total na instância live | 259 |
| Versionados no repo Azure DevOps | 23 |
| **Sem controle de versão** | **236 (91%)** |
| Owners distintos | 16 |
| Criados por `admin@voomp.com.br` | 163 (63%) |

**Risco:** se a instância n8n cair ou precisar de restore, 236 workflows não tem backup em repo. O único backup é o workflow `Workflow and Credentials Backup` (ID: `8oxAov07p2SiZ7i0`) que é ativo.

---

## Owners

| Owner | Total | Ativos |
|-------|-------|--------|
| admin@voomp.com.br | 163 | ~70 |
| diego.massari@voomp.com.br | 33 | ~12 |
| elvis.martins@cogna.com.br | 21 | 2 |
| vinicius.teodoro@voomp.com.br | 8 | 3 |
| eric.prates@cogna.com.br | 7 | 2 |
| matheus.soto@voomp.com.br | 5 | 3 |
| gustavo.s.vieira@voomp.com.br | 4 | 0 |
| lucas.h.duarte@voomp.com.br | 4 | 0 |
| rodrigo.turco@voomp.com.br | 3 | 1 |
| amanda.aquino@voomp.com.br | 3 | 1 |
| suporte@expertintegrado.com.br | 2 | 2 |
| andre.v.oliveira-k2p | 2 | 0 |
| marcos.nery-k2p | 1 | 0 |
| kaleo.elache@voomp.com.br | 1 | 1 |
| rossywan.franca-net | 1 | 0 |

---

## Workflows Ativos por Domínio

### Integrações Educacionais — Cosmos, Play, AlpaClass, Coursera (16 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| Alunos Cosmos Manual | r2UzOv48fXABffMy | admin |
| Integração Cosmos - Automático | TOgglktSS1fTSYTe | admin |
| Ingresso Alunos Cosmos Planilha | NjJu2S7OcgMGd4iB | admin |
| Integração TMB - Cosmos | qrSqolsN8hQqh1An | admin |
| Webhook Cosmos <> USI | lXcnHcNy1zk8bbyi | admin |
| Vendas Principia - Cosmos | UpdbJv99Erkt4Bae | admin |
| Vendas Principia - Voompplay | erarGHyxVPUkUR1J | admin |
| Integração TMB - Play | ecM6mXyJn0m5X7IN | admin |
| Ingresso play - Barakat | fh4HWVKs2N6ccByh | admin |
| Ingresso play - Inglês Para Viagens e Estágios | k2vwRsF560ieKNp8 | admin |
| Cefisa Forms Play | Q9qakPAASHH6VaRW | admin |
| ERP Play - ATD | uFXwFQA8u5Jf5ms9 | admin |
| Prazo para Expirar Acesso - Play Profinho | vORZQWI1vndwUlbc | admin |
| AlpaClass DB | gkdHKev8roPNi9xs | admin |
| Integração Voomp AlpaClass - Joyce Rodrigues | f0msB5SjMY8JaBbz | diego.massari |
| Cousera | r1gLnFZME0DkDMbT | admin |

### CRM/Vendas — Bitrix, Hubspot, ActiveCampaign (10 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| CHECKOUT > PPCS | zdqsHmMMs2xGIIeQ | diego.massari |
| Voomp DB > Hubspot Partners Data | FFvvtToAjOLChnvV | diego.massari |
| Voomp DB > Hubspot Sales Data | VKS8Mwu7jjrGSRU6 | diego.massari |
| Hubspot - Clear KAM Amount (Ganho Sellers) | uYq2m60sE5HEvgFm | diego.massari |
| Ingest - Freshdesk Signup | hSQIQyTLaTxXCP9S | diego.massari |
| Ingest - Hubspot Signup | 3MjjEkGwzzTNJUoO | diego.massari |
| Ingest - Hubspot Transactional | oZmbOvV94TR6C9yS | diego.massari |
| Ingest - Hubspot Orders | NSe47jPDmafgO33a | diego.massari |
| Ingest - FreshCRM FreshChat Signup | iyZTP3NItONMlUU0 | diego.massari |
| DataLoad - Signup MasterTable | hjAU61k89UFMHVCO | diego.massari |

### Billing/Cobrança — Boleto, Retentativa, PagarMe (10 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| Boleto - Vencimento no dia | bQmnPN73DxHOWFrd | admin |
| Atualização do Boleto PagarMe Paliativo | TkwQq014opTRjPbu | admin |
| [Admin] Disparo de vencimento de boleto | ZZUlueVg6G3ASNLM | admin |
| Pix - Recorrente | NhCAZFgEeJbX8OE1 | admin |
| CRON RETENTATIVAS | CN9PTJb9Dmt20Arb | eric.prates |
| Retentativa Cartão v5 | oXBEJ7qCUSQyRo3J | rodrigo.turco |
| Retentiva manual de cobrança com novo cartão | sjhZNolxt0A0TtKw | eric.prates |
| Envio base inadimplentes - time Cobrança | RJLt9Df1TiAS3ZPa | admin |
| Envio bases Funil Cobrança | syIrbfaH9H4ETY6N | admin |
| Conciliação Oficial | tD6QRwo2kcEOg6Ir | elvis.martins |

### Freshdesk/Suporte (5 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| ERP > Ticket Freshdesk | bcwB11NkVJq47R83 | admin |
| Freshdesk - Delayed | 3FGHKL516eFfNa9X | admin |
| API - Freshdesk Catalogo de Serviço | kHRjfVLlyL4Ui8lu | admin |
| Fresh - Incidents & Problems Report | fKYxZw0PIH2dfne6 | diego.massari |
| Triagem FreshChat | 7g4DqtiDjvCAVaBo | kaleo.elache |

### Email/Disparo/Comunicação (10 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| Aviso de erro na entrega de email | 8a6e6FO9tbPhYN8g | admin |
| Disparo email Maluf - Base leads | 3FLBBmTsfi1Tq2aQ | admin |
| Disparo email com base mensal - Livia Praiero Ed.Positiva | 8XHzioCoW29fVNeC | admin |
| Disparo email diário - Extrato financeiro FPX | IlrWEtWhuL2Wvnwj | admin |
| Disparo email semanal - E-notas Nobre Investidor | bptGaZfLqlXiRBuv | admin |
| Log de Emails Cefisa | 0ltkY9u6qM9aRzG1 | admin |
| Notificação_ProdutoPos | anIevuqQweuG7aiQ | amanda.aquino |
| LEMBRETE – PROJETOS EM CAPACITAÇÃO (EXTENSÃO) | Iv1aLFOkPq4IYn6C | vinicius.teodoro |
| LEMBRETE – MASTERCLASS (EXTENSÃO) | n7VOIFpSw0s3Gyzu | vinicius.teodoro |
| Teste - email cancelamento panda | xQf4HH6BpINqnECm | admin |

### Gamificação (7 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| Atualiza Lista de Plaquinha (Gamificação) 5M | gydQPs2KljDzmaxB | admin |
| Atualiza Lista de Plaquinha (Gamificação) 100+ | 8t2kCTLtIRTzvuRM | admin |
| Atualiza Lista de Plaquinha (Gamificação) 100k | qXqcaXib4xY8f459 | admin |
| Atualiza Lista de Plaquinha (Gamificação) 500k | rGJB5CHofNXr9PZU | admin |
| Atualiza Lista de Plaquinha (Gamificação) 1M | wptu37U1pJexZGGi | admin |
| Atualiza Lista de Plaquinha (Gamificação) 10M | Je7cNkr8JjDdwLl3 | admin |
| Atualiza Lista de Plaquinha (Gamificação) 50M | O8aspbn4pwqamJ3I | admin |

### ERP/Certificados (2 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| ERP ATD | RD3IoJn0Xb9RhfPc | admin |
| ERP — Emissão Cert. Extensão: Buscar na Base de Certificados | wBSzXFA867nwaCEx | admin |

### Admin/Tools/AI (9 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| [Admin] Retry Exportar Admin | 1oOAPVRHqFR5kDDc | admin |
| [Admin] Resumo da Sprint com Cogna IA | 1BZAu3rNRALj4mRP | admin |
| [Admin] MVP RVP | PhyUVp3uM5zQGZLa | matheus.soto |
| [Admin] Adiciona usuário no beta KYC e Facelift | TYjColqUK0iT4Fty | matheus.soto |
| [AI Support] Input Classificador | uAvuQAh01dFIZWMk | admin |
| [AI Support] Conta | K8UStpoYtmlYrYMA | admin |
| Tool Box [Admin] | 2bxeI2CsJUXCqG64 | admin |
| Workflow and Credentials Backup | 8oxAov07p2SiZ7i0 | admin |
| [Produto] Relatório de bugs diário | teyCZGPOhETBZ4Oq | matheus.soto |

### Outros/Específicos de Seller (33 ativos)

| Nome | ID | Owner |
|------|-----|-------|
| Integração Acaso | 4hVX2oKCBJCcCbbw | admin |
| Me Poupe - Ação Anhanguera | 8gzkT8DSvgcx3CzD | admin |
| Me Poupe - 99 Pay | kRmLPtZovUnHA6ua | admin |
| Me Poupe - Banco Inter | lomlbbIgUTgK0JIg | admin |
| Me Poupe - Black Desenrolation | mfCUUOoVdke3r9R3 | admin |
| Me Poupe - Estácio | QuTVX9kt0cmWOmvg | admin |
| Workflow MePoupe | YieTJPfb1NPvBbRp | admin |
| Educação Positiva - Segunda/Quarta | GVVgcQUWNXgJqsBA | admin |
| AmbientalPRO - Terça | PtpNAaMtok0NUtfb | admin |
| Thiago Concer - Diário | nNmLuq8QzMyqckne | admin |
| OBFMarketing - Segunda | oA85dB4lXwy0DADR | admin |
| MetodoPAP - Segunda | obY3qL7WB8hjiCvx | admin |
| Libras - Segunda | za8FwWumjE7ar3kz | admin |
| Ação Escola Hunter | ETGTSp4Gx7QlM8r4 | admin |
| Steel Academy - Curso Gratuito | QowzpuLrUpTyfgjv | admin |
| Vitrine Anhanguera | pBXfKatKjKOBAybi | admin |
| Anhanguera - ClearSale | zIG4D8vVYXnzUUXl | admin |
| WebHook Ofertas DMH - Anhanguera | 1q9DfI7sPa1IWcmg | admin |
| HML - WebHook Ofertas DMH - Anhanguera | MUA6ejEBMX04voF6 | admin |
| Cancelamento Automático Pós - Principia | Aehbtjyd1pcelOpx | admin |
| Principia - cancelamento (Lu) | VkFqis4hhCADfmHO | admin |
| Base de importação - Pós-graduação | MIeIhgvWyUMc4CS4 | admin |
| Pós-graduação - venda sem cpf | vkaG2JVBQcYEsOba | admin |
| Consulta pós-graduação (tela) | yeYpp8sIKPMetuHn | admin |
| WF base financeiro - concat | PAT8YnReX9G7ATwp | admin |
| WH base pós - Financeiro | WaTVXIAquP4lcTkS | admin |
| Voomp - Inbound e Outbound | 8FPmvQF8pfhIay47 | suporte |
| Criação de pastas no sharepoint | H4Iy4IiKZNbjKLjz | vinicius.teodoro |
| [TESTE] Reativar Contratos Cancelados | LuZaCfZ8mGlgtkBo | elvis.martins |
| Endpoint - Gatekeeper | xrcbxb7XKEwXzso5 | admin |
| telegramteste | WapiS9LHmlZJnQxb | admin |
| 🟢 Manter Supabase Ativo | l8K8HIeUbJ2y2WkR | suporte |
| [ATD] Validação de Matricula por Seller (hash) | udgrOMm9YCrY3Sed | admin |

---

## Workflows Inativos Relevantes (seleção)

### Recorrência/PagarMe (Elvis + Eric — investigações)

| Nome | ID | Owner | Criado |
|------|-----|-------|--------|
| [TESTE] Conciliar Status Contrato - SubscriptionActive Pagarme | OS1sTvmrt7RRZuWx | elvis.martins | 2025-12 |
| [TESTE] Verificar Subscription PagarMe | NClGYTjURTSj32nQ | elvis.martins | 2025-12 |
| [TESTE] ReConciliador em Massa | QUMjbOBFclkYJXmd | elvis.martins | 2025-12 |
| [TESTE] Retentativas Cartão PagarMe | S37KufhNAoN6CaWW | elvis.martins | 2025-12 |
| [TESTE] Atualizar Boletos | KoTUcn8YhCAmHBVL | elvis.martins | 2025-12 |
| [TESTE] Migrar Boletos V5 -> V5 10 Dias | UhOKtnRTIshucI57 | elvis.martins | 2025-11 |
| [TESTE] Conciliação Pix OrderBump - Retroativo | Y4zYqTYl5p9jaNB4 | elvis.martins | 2025-12 |
| [TESTE] Conciliação Manual | xeZEwqwSQojpgCGy | elvis.martins | 2025-12 |
| [TESTE] Listar assinaturas ativas por email | ywgzXxARVdlgU7hJ | elvis.martins | 2025-12 |
| [TESTE] Criar Venda Avulsa PagarMe | G0OccJt42RnV6PP6 | elvis.martins | 2025-12 |
| Paginação PagarMe Estável | hbwWn2burHEA3pHi | elvis.martins | 2026-01 |
| [TESTE] Contratos Anuais forma Correta | C5RZFfAgBa1plcFm | elvis.martins | 2026-01 |
| Contratos | ToVE6Q0XikhaRHLx | elvis.martins | 2026-02 |
| Retentativa cobrança por falta de saldo | nZ3K9vhVzX98Gr0C | eric.prates | 2025-12 |
| Retentativa cobrança DEFINITIVO | yKnOQsMoOyk1eK63 | eric.prates | 2025-12 |
| Retry Cobranças - OTIMIZADO | XILVNRbpmvaRsrmo | eric.prates | 2025-12 |
| Fix Duplicate Sales - DRY RUN com Pagarme | rE5I9onSHKE493nR | eric.prates | 2025-12 |
| Retentativa - Pagarme | PnlOTrLN0cRNvuPG | lucas.h.duarte | 2025-12 |
| V4 > V5 | SuVr8RLShVbfh9z8 | andre.v.oliveira | 2026-02 |

### CRM/Dados (Diego — migrados ou desativados)

| Nome | ID | Owner | Motivo |
|------|-----|-------|--------|
| TPV > Bitrix | CyK6SAkXtacLDf6y | diego.massari | Substituído |
| New Signups - Bitrix Onboarding | N3fS5Egx9kCh9G1y | diego.massari | Substituído por Ingest |
| Voomp DB > Hubspot Signup Data [Movido para Ingest] | fCfwEi3KFgMSzIYG | diego.massari | Migrado |
| Hubspot <> Freshdesk | CPsCFhzGe1u45E6L | diego.massari | Desativado |
| Freshdesk > Hubspot (Webhook) | PjPwqGjXh5CzneQa | diego.massari | Desativado |
| Freshdesk Import - Movido para Voomp CRM [Ingest] | 2jUztDAl1ZcJBSJv | diego.massari | Migrado |

### Testes e utilitários descartáveis (genéricos)

| Nome | ID | Owner |
|------|-----|-------|
| My workflow 4-24 | vários | admin, gustavo, lucas, etc. |
| Teste Kaléo / Teste Turco / Teste Vendedor Online | vários | admin |
| Demo: My first AI Agent in n8n | HviYF9iYA4SzaiOT | elvis.martins |
| NAO APAGA DIDICO | 14iA0sBvHEqZPxvf | admin |

### Marcos Nery (Sustentação N3)

| Nome | ID | Owner | Contexto |
|------|-----|-------|----------|
| Correção Retroativa - Boletos Duplicados V3 COMPLETA | JkQq8oft3oau8hYe | marcos.nery | Fix pontual 2026-03 |

---

## Workflows Detalhados (Críticos para Sustentação)

### 1. Alunos Cosmos Manual (r2UzOv48fXABffMy)
- **Trigger:** Webhook POST `cadastro_alunos_cosmos`
- **Status:** Ativo
- **Switch por `form[name]`:**
  - `insere_aluno_cosmos` → POST `kroton.platosedu.io/api/service-enrollment/api/v1/voomp`
  - `cancela_aluno_cosmos` → POST `.../voomp/cancel`
  - `lote_cosmos` → Query MySQL PRD (sales paid, current_charge=1) → Loop → POST pra cada sale
- **Auth Cosmos:** X-WEBHOOK-TOKEN (bcrypt hash fixo)
- **Risco:** se o webhook falhar, matrícula não é criada/cancelada no Cosmos (silencioso, sem retry)

### 2. CHECKOUT > PPCS (zdqsHmMMs2xGIIeQ)
- **Trigger:** Webhook POST `ppc-ext` (extensão) + `ppc-mba` (MBA)
- **Status:** Ativo
- **Fluxo:** Webhook → List Contact → IF novo → Add Contact → Add Company → Add Deal → Add Product
- **Bitrix API:** `voompcreators.bitrix24.com.br/rest/68/...`
- **Risco:** se Bitrix fora, deals não criados (continueOnError habilitado, silencioso)

### 3. Boleto - Vencimento no dia (bQmnPN73DxHOWFrd)
- **Trigger:** Schedule diário
- **Status:** Ativo
- **Fluxo:** Query boletos vencendo → envia lembretes via callbacks
- **Risco:** se callback URL incorreta, seller não recebe lembrete

### 4. CRON RETENTATIVAS (CN9PTJb9Dmt20Arb)
- **Trigger:** Schedule (cron)
- **Owner:** eric.prates
- **Status:** Ativo
- **Fluxo:** Retentativa automática de cobranças recusadas
- **Contexto:** Workflow de produção do Eric para motor de retentativa

### 5. Conciliação Oficial (tD6QRwo2kcEOg6Ir)
- **Trigger:** Schedule
- **Owner:** elvis.martins
- **Status:** Ativo
- **Fluxo:** Conciliação de status entre Voomp e PagarMe
- **Contexto:** Versão estável do reconciliador (anterior foram os [TESTE])

### 6. Retentativa Cartão v5 (oXBEJ7qCUSQyRo3J)
- **Trigger:** Schedule
- **Owner:** rodrigo.turco
- **Status:** Ativo
- **Fluxo:** Retentativa de cobrança em cartão via PagarMe v5

### 7. [Admin] Retry Exportar Admin (1oOAPVRHqFR5kDDc)
- **Trigger:** Schedule ou manual
- **Status:** Ativo
- **Fluxo:** Retry de exports travados no admin
- **Contexto:** Relacionado à VSUS-709 (export charges fix)

---

## Credenciais usadas

| Nome | Tipo | ID | Usado por |
|------|------|----|-----------|
| MySQL PRD | MySQL | 96XFirojx8r9EvxB | OPPs, TPV, saleDueDays, Cosmos, Conciliação |
| MySQL account (HML?) | MySQL | kLeus0ctrp19GWRg | contractDueDays, Gerar Certificados |
| SendGrid account | SendGrid | leJJEnfhko4EDKsf | AlpaClass, erros |
| ActiveCampaign account | ActiveCampaign | F753M6SWlPCpmKEK | OPPs > Bitrix |
| Google Sheets Trigger | OAuth2 | JfO5VFwCLT2Hqbbp | OPPs > Bitrix |
| Google Sheets account | OAuth2 | sHdllQM17PvTUsJ7 | SellersByMonth |
| Microsoft Excel account | OAuth2 | pR6Wus2G60CNNauz | Play HOF |
| Coursera | OAuth2 | g8AEfqwEH8ZDk6zQ | Coursera |

---

## Pontos de falha conhecidos

| Workflow | Ponto de falha | Consequência | Observabilidade |
|----------|---------------|--------------|-----------------|
| Alunos Cosmos | Cosmos API fora ou token inválido | Matrícula não criada | Nenhuma |
| CHECKOUT>PPCS | Bitrix rate limit | Deal não criado | Silencioso |
| Ingest workflows | Hubspot API quota | Dados não sincronizados | Silencioso |
| Boleto Vencimento | Callback URL incorreta/offline | Lembrete não disparado | Silencioso |
| CRON RETENTATIVAS | PagarMe v5 timeout | Cobrança não retentada | Depende da implementação |
| Conciliação Oficial | MySQL PRD timeout | Ciclo de conciliação perdido | Depende da implementação |
| AlpaClass | Token expirado | 401 → email admin@voomp | SendGrid |
| Coursera | OAuth2 token expirado | Aluno não convidado | Silencioso |

---

## Relação com seller-greenn-back

```
seller-greenn-back → (webhook de venda) → n8n (AlpaClass, Coursera, PPCS)
seller-greenn-back → (banco MySQL PRD) ← n8n (leitura: Cosmos, Boleto, Conciliação, TPV)
n8n → (APIs externas: Cosmos, Bitrix, AlpaClass, Coursera, Play, Hubspot, PagarMe)
n8n → (PagarMe v5 API: retentativas, conciliação) ← NOVO desde 2025-12
```

**Mudança importante (dez/2025):** n8n passou a interagir com PagarMe v5 para retentativas e conciliação (workflows do Elvis e Eric). Antes, n8n NUNCA interagia com PagarMe.

---

## Quando investigar n8n

**Sintoma → Workflow provável:**
- "Aluno não aparece no Cosmos" → Alunos Cosmos / Integração Cosmos Automático
- "Aluno não ganhou acesso no Play" → Integração TMB Play / Ingresso play
- "Seller não está no Hubspot" → Ingest workflows (Diego)
- "TPV desatualizado no CRM" → CRM/Vendas workflows
- "Aluno não desmatriculado no AlpaClass" → AlpaClass
- "Boleto sem lembrete" → Boleto - Vencimento no dia
- "Cobrança não retentou" → CRON RETENTATIVAS / Retentativa Cartão v5
- "Status divergente Voomp vs PagarMe" → Conciliação Oficial
- "Export travado no admin" → [Admin] Retry Exportar Admin
- "Gamificação desatualizada" → Atualiza Lista de Plaquinha (7 workflows)
- "Certificado extensão não emitido" → ERP — Emissão Cert. Extensão

**Quando NÃO é n8n:**
- Push notifications (OneSignal) — seller-greenn-back direto
- Webhook PagarMe não processado — seller-greenn-back controllers
- Cancelamento de assinatura que não propagou (fluxo interno do back)
- Export CSV/XLS falhando (ExportService no back)
- Falha de checkout/pagamento (PaymentController)
- Emails transacionais de venda (SendGrid direto do back)

---

## Tabelas do banco PRD usadas pelo n8n

| Tabela | Workflows que usam |
|--------|-------------------|
| `sales` | Cosmos, Conciliação, Retentativas, Boleto, CRM |
| `users` | CRM/Hubspot, TPV |
| `seller_meta_tags` | Ingest/Signup workflows |
| `clients` | Cosmos, AlpaClass |
| `products` | Cosmos, Boleto |
| `products_has_metas` | TMB, Principia, AlpaClass |
| `products_has_offers` | Cosmos Lote |
| `callbacks` | saleDueDays, contractDueDays |
| `clients_has_contracts` | Boleto, Conciliação, Retentativas |
| `connections` | Principia (tokens) |

---

## Webhooks recebidos (endpoints n8n)

| Endpoint | Quem envia | Quando |
|----------|-----------|--------|
| `POST /webhook/cadastro_alunos_cosmos` | Admin Voomp (formulário) | Matrícula/cancelamento |
| `POST /webhook/ppc-ext` | Checkout Voomp | Venda PPC extensão |
| `POST /webhook/ppc-mba` | Checkout Voomp | Venda PPC MBA |
| `POST /webhook/integration-alpaclass` | seller-greenn-back | Venda paid/refunded |
| `POST /webhook/ingresso-aluno-play` | Formulário externo | Inscrição aluno |
| `POST /webhook/integration-coursera` | seller-greenn-back | Venda paid/refunded |
| `POST /webhook/voomp_tmb` | TMB | Pedido efetivado |
| `POST /webhook/integration/sales/` | Principia/Provi | Venda efetivada |
