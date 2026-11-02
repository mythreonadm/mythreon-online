---
projeto: Mythreon Online
tipo: decisao
status: parcial
atualizado: 2026-11-02
resumo: Fórmulas revisadas e evidências da auditoria de combate e economia.
---

# Balanceamento de combate e economia

Versão local de balanceamento: 2026-11-02. Código em `src/data/balance.ts`, `src/engine/stats.ts`, `combat.ts`, `drops.ts`, `save.ts`, `shop.ts` e `src/data/elementalChart.ts`.

## Fórmulas aplicadas

| Sistema | Regra |
|---|---|
| HP base | 150 + 25 × (nível − 1) |
| MP base | 50 + 15 × (nível − 1) |
| ATK/MATK base | 12 + floor(2,5 × (nível − 1)) |
| Defesa e armadura base | 3 + floor(0,8 × (nível − 1)) |
| Treino | +1,5 ATK por melee OU distância para arcos; +1,5 MATK por magic; +1 ARM e +0,5 DEF por defense |
| Armadura | Redução = ARM / (ARM + dano bruto + 40), limitada a 70%; aplicada a ataques de ambos os lados |
| Defesa do personagem | ARM + 0,5 DEF alimentam a mitigação |
| Crítico | 1 + critDmg; bônus limitado a 150%, multiplicador máximo 2,5× |
| Resistências | Limite 60%, tanto na ficha como no combate; reduções de suporte continuam multiplicativas |
| Elementos | Vantagem 1,25×, resistência relacional 0,75×, neutro 1×; pares com vantagem recíproca ficam neutros |
| Armas mágicas | Cajados e varinhas usam MATK no ataque normal; ataque normal continua classificado como dano base neutro no relatório |
| Mana da Matriz | Custo próprio da habilidade + floor(nível × 0,5), reduzindo a desvantagem de sustentabilidade em relação à Beast |
| Recuperação | Regeneração por atributo; vitória cura 2% do HP máximo. Retirada a cura gratuita adicional de 1,5% por tick recebido |
| Recompensas por estrelas | XP/gold base × (1 + 0,20 × (estrelas − 1)); pressão de HP/ATK/ARM dos mobs preservada |
| Equipamento | 18% por mob comum, 65% por boss, antes dos bônus |
| Raridade sem bônus | Comum 65%; incomum 25%; raro 8%; épico 1,8%; lendário 0,2% |
| Bônus de loot | Drop e raridade limitados a +100% no cálculo; sorte agora soma ao bônus de raridade |

As raridades são condicionais ao drop de equipamento. Não confundir 0,2% de lendário com chance por morte de monstro. Drops específicos de relíquias, mochilas, componentes, cartas e Beasts preservam suas tabelas próprias. Itens já obtidos mantêm seus atributos de instância.

## Correções de funcionamento

- Recalcular stats não transforma HP ou MP zero em recurso cheio.
- A regeneração não ressuscita personagem morto.
- Arcos não recebem melee e distância ao mesmo tempo.
- critDmg e sorte deixam de ser atributos sem aplicação nas respectivas fórmulas.
- A curva de XP mantém continuidade depois do nível 25. Saves ajustam XP atual proporcionalmente ao novo requisito, preservando o percentual de progresso; níveis e itens não são removidos.
- Venda rejeita quantidades negativas, não finitas ou menores que 1.

## Evidências

Comando reproduzível: `node scripts/balance-audit.cjs --check`; cenário preparado: adicionar `--prepared`.

Relatórios: [[balanceamento-antes]], [[balanceamento-depois]], [[balanceamento-preparado]]. JSONs correspondentes guardam os dados estruturados.

- 38 mobs × 3 caminhos × 12 encontros = 1.368 encontros por rodada. Rodadas antes/depois/preparado: 4.104 encontros no total.
- Sem poções: média das taxas por cenário após ajuste — humano 73%, Matriz 87%, Beast 88%; antes eram 87%, 96%, 95%.
- Devorador com equipamento comum e sem poções: nenhum dos três caminhos venceu na amostra após ajuste. Com equipamento raro e poções pagas: os três venceram todos os 12 encontros.
- Devorador preparado: Matriz 51 segundos e cerca de 11.526 gold líquidos por encontro; Beast 50 segundos e cerca de 12.166 gold líquidos. Valores amostrais, não promessas de rendimento.
- Sorteio de 100.000 raridades sem bônus após ajuste: 65.018 comuns, 24.987 incomuns, 8.012 raros, 1.794 épicos e 189 lendários.
- Passaram as asserções de limite/monotonicidade de armadura, HP/MP zero, XP monotônico nos níveis 1–150, premium +10 pontos percentuais e ataques das 12 Beasts.

## Limites e próximos ajustes

A auditoria mede encontros isolados com recursos cheios, no nível mínimo do alvo e sem upgrades/vials. Matriz alterna 12 modelos nomeados e Beast alterna as 12 espécies, incluindo combinações sintéticas indisponíveis naquele ponto de aquisição. Isso compara mecânicas, não reproduz uma campanha nova nem cobre todas as 2.340 combinações de componentes e afixos.

O cenário preparado começa com 100.000 gold para permitir testar poções; o lucro líquido desconta poções e não inclui venda de itens, custos anteriores de aquisição ou perdas ao morrer. Seis cenários preparados tiveram gold líquido negativo; não garantir lucro em toda caça/configuração de poções. XP/h e gold/h de sessões longas exigem auditoria contínua com stamina, inventário, mortes e progressão reais.

Critério para próxima rodada: medir sessões contínuas de 30 minutos por build acessível e verificar extremos de suportes/passivas, vials, upgrades e afixos. Não declarar equilíbrio completo ou equivalência de todas as builds a partir destas médias. Gameplay visual e checagem completa de tipos ainda têm pendências históricas no projeto.

## Relações

- [[CEREBRO_MYTHREON]]
- [[Shop-Premium-Beasts]]
