# Pack 15 — Auditoria de balanceamento

Data: 04/11/2026

## Objetivo

Criar uma linha de base reproduzível para XP, gold, dano, sobrevivência, poções e raridades antes de alterar números de gameplay. A auditoria cobre as sete zonas atuais, todos os monstros cadastrados e os três caminhos de evolução: Humano, Matriz e Besta/Pet.

## Cobertura

- 144 cenários: zona × criatura × caminho.
- 1.728 encontros simulados: 12 amostras determinísticas por cenário.
- Limite de 120 ticks por encontro.
- Linha comum: equipamento comum do tier, sem poções e sem upgrades.
- Linha preparada: equipamento raro do tier, poções pagas e orçamento inicial de 100.000 gold.
- Relatórios brutos: `balanceamento-antes.json`, `balanceamento-preparado.json` e `balanceamento-depois.json`.

## Resultado da linha comum

| Indicador | Resultado |
|---|---:|
| Cenários com 100% de vitória | 110/144 |
| Vitória média | 81,49% |
| Duração média | 22,93 s |
| Gold bruto médio | 178 |
| Gold líquido médio | 178 |
| XP médio por encontro | 404 |

## Resultado da linha preparada

| Indicador | Resultado |
|---|---:|
| Cenários com 100% de vitória | 144/144 |
| Vitória média | 100% |
| Duração média | 20,33 s |
| Gold bruto médio | 842 |
| Gold líquido médio | 537 |
| XP médio por encontro | 1.178 |

## Raridades observadas

A rolagem determinística de 100.000 itens produziu aproximadamente: Comum 64,9%, Incomum 25,2%, Raro 8,0%, Épico 1,8% e Lendário 0,2%. Esses números são uma medição de regressão; não devem ser alterados sem uma decisão de economia registrada.

## Guardrails adotados

1. Nenhum número de dano, XP, gold ou loot foi alterado automaticamente pelo Pack 15.
2. A linha preparada é um cenário de teste, não uma promessa de progressão para o jogador.
3. A auditoria falha se o treinamento conceder ticks gratuitos, a armadura ultrapassar a mitigação esperada, o XP ficar não monotônico, o bônus Premium divergir de 10% ou uma Besta não consumir MP/causar dano elemental.
4. O resultado deve ser comparado ao teste real de 20 hunts por faixa de nível antes do balanceamento definitivo.

## Comando de repetição

```text
npm run balance:check
```

Esse comando executa as asserções e grava o relatório mais recente. Para regenerar as linhas de comparação:

```text
node scripts/balance-audit.cjs --baseline
node scripts/balance-audit.cjs --prepared
```

## Próxima decisão

O resultado indica que o próximo trabalho não deve ser um nerf global. Primeiro precisamos separar os cenários abaixo de 100% na linha comum por faixa de nível, validar 20 hunts reais e só então ajustar os outliers de XP/gold, dano inicial e custo de poções. A linha preparada serve para verificar que Matriz e Pets continuam viáveis quando o jogador investe recursos.

## Integração com a memória do projeto

Este documento, os três JSON e o comando `balance:check` fazem parte do Cérebro Mythreon e serão indexados pelo Obsidian no próximo `npm run brain:sync`.
