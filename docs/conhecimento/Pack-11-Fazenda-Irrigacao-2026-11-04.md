# Pack 11 — Fazenda: irrigação e skill de cultivo

Data: 04/11/2026

## Implementado

- Cada plantação pode receber até 3 regas.
- Uma rega reduz 8% do tempo restante, respeitando um mínimo de 30 segundos.
- Há intervalo de 60 segundos para a terra absorver a próxima rega.
- A skill Irrigação sobe a cada rega e é persistida no personagem.
- O estado continua funcionando localmente e no servidor online.
- O plantio zera o contador de regas; a colheita limpa o estado do canteiro.
- A tela da Fazenda ganhou um painel específico para acompanhar e regar os canteiros ativos.

## Limites de balanceamento

- Não há rega infinita nem aceleração instantânea.
- O custo das sementes, o rendimento e as receitas existentes não foram alterados.
- A operação é validada no servidor junto das demais ações online.

## Próximo passo

Adicionar fertilidade e receitas de maior tier depois de testar a velocidade real de crescimento com jogadores.
