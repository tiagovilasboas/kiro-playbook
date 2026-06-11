---
inclusion: manual
---

# OneSignal — Regras para testes seguros

## ⚠️ NUNCA usar `included_segments` em testes

```
❌ PROIBIDO em teste:
"included_segments": ["Total Subscriptions"]   ← dispara pra TODOS os sellers

✅ CORRETO para teste:
"include_player_ids": ["<player_id_de_teste>"] ← dispara só pro device específico
```

**Motivo:** `included_segments` envia para todos os devices reais em PRD. Push notifications **não podem ser canceladas após envio**. Uma vez entregue, não tem volta.

**Incidente real (03/06/2026):** disparo de teste com `included_segments: ["Total Subscriptions"]` enviou notificação "Teste VSUS-701" para ~3.962 sellers em PRD. Gerou reclamações.

---

## Como testar push de forma segura

### 1. Obter player_id de teste

```sql
-- Banco DEV: device de teste
SELECT user_id, hash as player_id FROM users_has_devices
WHERE user_id = 73 AND active = 1
ORDER BY created_at DESC LIMIT 1;
```

### 2. Enviar para device específico (seguro)

```bash
curl -X POST https://onesignal.com/api/v1/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: key <ONESIGNAL_REST_API_KEY>" \
  -d '{
    "app_id": "d79917fb-ff43-4e75-9621-a68d6f650940",
    "contents": {"en": "Teste seguro - apenas 1 device"},
    "include_player_ids": ["<player_id_aqui>"]
  }'
```

### 3. Para testar se a API aceita auth (sem enviar push real)

Usar um player_id inválido — confirma auth sem entregar:

```bash
curl -X POST https://onesignal.com/api/v1/notifications \
  -H "Authorization: key <key>" \
  -d '{
    "app_id": "d79917fb-ff43-4e75-9621-a68d6f650940",
    "contents": {"en": "Teste auth only"},
    "include_player_ids": ["00000000-0000-0000-0000-000000000001"]
  }'
# Retorna 200 com "Invalid player ids" → auth aceita, zero entrega
```

---

## Checklist antes de qualquer disparo

- [ ] Estou usando `include_player_ids` (NÃO `included_segments`)?
- [ ] O player_id é de um device de **teste** (não de seller real)?
- [ ] O conteúdo da notificação não vai confundir se chegar por engano?
- [ ] Se for PRD: tenho certeza que quero enviar para esse device?

---

## Dados de referência

| App | App ID | Ambiente |
|---|---|---|
| Voomp Creators (PRD) | `d79917fb-ff43-4e75-9621-a68d6f650940` | Produção — ~3.962 devices |
| App de teste local | `9d0a5836-cd29-414f-b163-20235ec5b136` | Teste — 0 devices reais |

**Sempre preferir testar no app de teste** quando possível. Usar PRD apenas para validação final com device específico.
