# Prompt: Health Check

**Quando usar:** Para verificar rapidamente o status dos ambientes HML e PRD antes de um deploy ou ao suspeitar de instabilidade.

**Requer MCP:** Nenhum — o Kiro sugere como verificar manualmente ou via curl.

---

## Prompt

Cole no chat do Kiro:

```
Faça o health check dos ambientes Voomp Creators.

Rota de healthcheck: GET /FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy
Retorna: hash, branch, environment, pod_name, redis, mysql

Verifique:
- HML: https://apipay.voompcreators.net.br/FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy
- PRD: https://apipay.voompcreators.com.br/FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy

Para cada ambiente, informe:
1. Status HTTP (200 = ok, qualquer outro = problema)
2. Branch deployada
3. Status do Redis (ok/fail)
4. Status do MySQL (ok/fail)
5. Última atualização (hash do commit)

Formato do resultado:
| Ambiente | Status | Branch | Redis | MySQL |
|---|---|---|---|---|
| HML | ✅/❌ | branch-name | ✅/❌ | ✅/❌ |
| PRD | ✅/❌ | branch-name | ✅/❌ | ✅/❌ |
```

---

## Verificação manual (sem Kiro)

```bash
# HML
curl -s https://apipay.voompcreators.net.br/FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy | jq .

# PRD
curl -s https://apipay.voompcreators.com.br/FQ7MNkUZuW7jCb87YS3Dr2HRHpz8fhZy | jq .
```
