# MCPs Recomendados para o Time N3

> ⚠️ **A configuração de MCPs é manual e opcional.**  
> O `node bin/install.mjs` **não lê, cria, modifica nem sobrescreve** nenhum arquivo de configuração de MCP. Siga as instruções abaixo no seu próprio ritmo.

---

## O que é um MCP?

O **Model Context Protocol (MCP)** permite ao assistente do Kiro se conectar a serviços externos — como Jira, Azure DevOps e GitHub — e interagir com eles diretamente na conversa. Com um MCP configurado, você pode criar tickets, revisar PRs e consultar work items sem sair do Kiro.

## Como configurar um MCP

1. Localize ou crie o arquivo `~/.kiro/mcp.json` na sua máquina
2. Adicione a entrada do MCP desejado usando o snippet abaixo
3. Substitua os placeholders (`SEU_TOKEN_AQUI`, `sua-org`) pelos valores reais
4. Reinicie o Kiro

> 🔒 **Nunca commite o `mcp.json` com tokens reais.** Use variáveis de ambiente quando possível.

Se você já tem MCPs configurados, adicione a nova entrada dentro do objeto `mcpServers` existente:

```json
{
  "mcpServers": {
    "mcp-existente": { "...": "..." },
    "novo-mcp": { "...": "..." }
  }
}
```

---

## Para todos os perfis

### Azure DevOps MCP

**O que faz:** Gerencia work items, sprints, PRs e pipelines diretamente no Kiro.  
**Por que usar:** Cria e atualiza tickets, consulta backlogs e acompanha o status de PRs sem abrir o browser.  
**Perfis:** `all`  
**Documentação:** [tiberriver256/mcp-server-azure-devops](https://github.com/tiberriver256/mcp-server-azure-devops)

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": ["-y", "@tiberriver256/mcp-server-azure-devops"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/SUA-ORG",
        "AZURE_DEVOPS_AUTH_METHOD": "pat",
        "AZURE_PERSONAL_ACCESS_TOKEN": "SEU_PAT_AQUI"
      }
    }
  }
}
```

---

### Jira / Atlassian MCP

**O que faz:** Consulta e atualiza tickets Jira, sprints e backlogs.  
**Por que usar:** Transiciona status, adiciona comentários e vincula PRs a tickets direto no Kiro.  
**Perfis:** `all`  
**Documentação:** [sooperset/mcp-atlassian](https://github.com/sooperset/mcp-atlassian)

```json
{
  "mcpServers": {
    "jira": {
      "command": "uvx",
      "args": ["mcp-atlassian"],
      "env": {
        "JIRA_URL": "https://SUA-ORG.atlassian.net",
        "JIRA_USERNAME": "seu-email@empresa.com",
        "JIRA_API_TOKEN": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```

---

## Para Dev e QA

### GitHub MCP

**O que faz:** Revisão de código, gestão de PRs, consulta de issues e histórico de commits.  
**Por que usar:** Cria PRs, adiciona comentários de review e consulta diffs sem sair do Kiro.  
**Perfis:** `dev`, `qa`  
**Documentação:** [github/github-mcp-server](https://github.com/github/github-mcp-server)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```

---

## Para Dev — Observabilidade e Banco de Dados

### Grafana MCP

**O que faz:** Consulta dashboards, executa queries em Prometheus/Loki e analisa métricas diretamente no Kiro.  
**Por que usar:** Investigar incidentes sem sair da IDE — consulta 5xx rate, latência, pods, logs de erro.  
**Perfis:** `all`  
**Documentação:** [grafana/mcp-grafana](https://github.com/grafana/mcp-grafana)

```json
{
  "mcpServers": {
    "grafana": {
      "command": "npx",
      "args": ["-y", "@grafana/mcp-server-grafana"],
      "env": {
        "GRAFANA_URL": "https://grafana.SUA-ORG.com",
        "GRAFANA_API_KEY": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```

---

### MySQL MCP (DEV / HML / PRD read-only)

**O que faz:** Executa queries SQL diretamente no Kiro contra ambientes do banco.  
**Por que usar:** Debug de dados, validação de hipóteses durante investigação de bugs.  
**Perfis:** `dev` (DEV/HML), `dev` com read-only (PRD)

> ⚠️ **PRD é read-only.** Nunca configure acesso de escrita ao banco de produção.

```json
{
  "mcpServers": {
    "mysql-dev": {
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "db-dev.SUA-ORG.internal",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "SEU_USER",
        "MYSQL_PASS": "SEU_PASS",
        "MYSQL_DB": "SEU_DB"
      }
    },
    "mysql-hml": {
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "db-hml.SUA-ORG.internal",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "SEU_USER",
        "MYSQL_PASS": "SEU_PASS",
        "MYSQL_DB": "SEU_DB"
      }
    },
    "mysql-prd-readonly": {
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "db-prd-replica.SUA-ORG.internal",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "SEU_USER_READONLY",
        "MYSQL_PASS": "SEU_PASS",
        "MYSQL_DB": "SEU_DB"
      }
    }
  }
}
```

---

### OneSignal MCP

**O que faz:** Gerencia push notifications, segmentos e templates de notificação.  
**Por que usar:** Testar e debugar notificações sem acessar o painel OneSignal.  
**Perfis:** `dev`

> ⚠️ Consulte `steerings/global/onesignal-testes-seguros.md` antes de usar em produção.

```json
{
  "mcpServers": {
    "onesignal": {
      "command": "npx",
      "args": ["-y", "@onesignal/mcp-server"],
      "env": {
        "ONESIGNAL_APP_ID": "SEU_APP_ID",
        "ONESIGNAL_REST_API_KEY": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```

---

## Para QA — Testes Automatizados

### Playwright MCP

**O que faz:** Controla navegador para testes E2E diretamente pelo Kiro.  
**Por que usar:** Criar e rodar testes E2E sem sair da IDE, debugar fluxos de usuário.  
**Perfis:** `qa`  
**Documentação:** [playwright/mcp-server](https://github.com/playwright-community/mcp-server-playwright)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"],
      "env": {}
    }
  }
}
```

---

## Exemplo: múltiplos MCPs configurados juntos

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": ["-y", "@tiberriver256/mcp-server-azure-devops"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/SUA-ORG",
        "AZURE_DEVOPS_AUTH_METHOD": "pat",
        "AZURE_PERSONAL_ACCESS_TOKEN": "SEU_PAT_AQUI"
      }
    },
    "jira": {
      "command": "uvx",
      "args": ["mcp-atlassian"],
      "env": {
        "JIRA_URL": "https://SUA-ORG.atlassian.net",
        "JIRA_USERNAME": "seu-email@empresa.com",
        "JIRA_API_TOKEN": "SEU_TOKEN_AQUI"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```
