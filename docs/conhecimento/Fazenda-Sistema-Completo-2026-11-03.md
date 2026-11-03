# Fazenda de Lyss — sistema completo

## Estado implementado

- Um canteiro gratuito por personagem.
- Plantio de Cenoura, Melancia, Trigo de Lyss e Semente Lumina.
- Cada semente possui custo, tempo de crescimento e rendimento próprios.
- Colheita gera materiais empilháveis até 999, prontos para alimentar Pets e futuramente fabricar poções/rações.
- Expansão gradual até 12 canteiros: 2º por 1.000 gold, 3º por 25.000 gold, 4º por 100.000 gold e 5º em diante por 500 Mythreon Coins.
- Estado persistente em saves locais e no mundo online.
- Ações online validadas pelo servidor: plantar, colher e expandir terreno.
- Ações da Fazenda não alteram regras de combate, loot ou XP.

## Otimização aplicada

O painel calcula apenas os canteiros e não inicia timers por canteiro. O estado é atualizado somente após ações do jogador ou sincronização normal do personagem; isso evita múltiplos intervalos e renders contínuos. A plantação usa timestamps (`plantedAt`, `readyAt`) e o servidor decide se está pronta, impedindo acelerar a colheita pelo relógio do cliente.

## Prancha de artes

Arquivo: `public/assets/items/prancha-mythreon-fazenda.png`.

Recortar e salvar na mesma pasta com estes nomes, na ordem da prancha:

1. `CANTEIRO_LYSS.png`
2. `REGADOR_ARCANO.png`
3. `ENXADA_RUNICA.png`
4. `SACO_SEMENTES.png`
5. `SEMENTE_CENOURA.png`
6. `SEMENTE_MELANCIA.png`
7. `SEMENTE_TRIGO.png`
8. `SEMENTE_LUMINA.png`
9. `COLHEITA_CENOURA.png`
10. `COLHEITA_MELANCIA.png`
11. `COLHEITA_TRIGO.png`
12. `FRUTO_LUMINA.png`

As artes devem ser 32×32 ou 64×64, pixel art, fundo transparente após o recorte. O sistema mantém emoji como fallback até que cada arquivo individual seja colocado.
