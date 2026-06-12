---
inclusion: always
---

# Princípio de Mudança Mínima

## Regra principal

Em fixes de bugs e correções, **alterar o mínimo necessário** para resolver o problema. Não refatorar código adjacente, não melhorar naming, não adicionar abstrações "de passagem".

## Por quê

- Cada linha alterada é uma linha que pode quebrar algo
- Mais mudanças = mais superfície de review = mais chance de erro escapar
- Refactor vai em PR separado, nunca misturado com fix

## Quando aplicar

| Cenário | O que fazer | O que NÃO fazer |
|---|---|---|
| Bug fix | Corrigir exatamente o ponto de falha | Refatorar o método inteiro |
| Null check faltando | Adicionar `??` ou `isset` no ponto | Reescrever o fluxo com early returns |
| Campo errado | Trocar `amount` → `offer_amount` | Renomear todas as variáveis do método |
| Auth faltando | Adicionar header + fallback | Migrar pra novo endpoint na mesma PR |
| Log faltando | Adicionar `Log::error` após falha | Criar serviço de logging customizado |

## Exceções (quando refatorar junto faz sentido)

- O código quebrado é impossível de corrigir sem mudança estrutural
- A mudança é tão pequena que não justifica PR separado (ex: typo no mesmo arquivo)
- O refactor é pré-requisito do fix (ex: precisa extrair método pra poder testar)

## Trade-offs aceitos

- ✅ Código "feio" mas funcional e com menor risco
- ❌ Código "bonito" que muda 15 arquivos pra resolver 1 bug
- ✅ Null coalescing `??` em propriedade dinâmica (pragmático)
- ❌ Criar DTO + ValueObject + Interface pra resolver undefined property

## Referência

O fix do Guto (VSUS-709) é exemplo perfeito: 1 arquivo, 1 linha, zero regressão.
O fix da 701: 2 arquivos, ~40 linhas — justificado por adicionar observabilidade que não existia.
