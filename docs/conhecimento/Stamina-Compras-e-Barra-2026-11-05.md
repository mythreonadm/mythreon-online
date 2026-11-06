# Stamina online — barra e recuperação no pré-teste

## Problema identificado

Contas veteranas podiam chegar a `staminaOnline = 0` e ficavam corretamente impedidas de iniciar a caça, mas a informação aparecia apenas no Registro de Combate. Isso parecia um bloqueio de mapa ou de missão.

## Implementação

- O cabeçalho agora exibe stamina online e offline em barras visíveis.
- Gold recupera `+60 min` de stamina online.
- 1 Mythreon Coin recupera `+120 min` de stamina online.
- A stamina online continua limitada a 120 minutos; a compra preenche apenas o espaço disponível.
- Durante o pré-teste (`STAMINA_PRETEST_UNLIMITED = true`), as compras não possuem limite diário.
- Para o lançamento, basta trocar a flag para `false`; a estrutura já separa a compra de Gold e a compra de Coin por dia UTC.
- As ações são projetáveis no cliente, confirmadas pelo servidor online e persistidas junto do personagem.

## Arquivos

- `src/data/stamina.ts`
- `src/types/index.ts`
- `src/store/gameStore.ts`
- `src/ui/CharacterPanel.tsx`
- `src/online/controller.ts`
- `src/online/projection.ts`
- `server/game.ts`

## Teste manual

1. Entrar com uma conta que tenha stamina online zerada.
2. Confirmar a barra vermelha/vazia no cabeçalho.
3. Comprar com Gold e verificar `+60 min` e o desconto do Gold.
4. Comprar com Mythreon Coin e verificar `+120 min` e o desconto de 1 Coin.
5. Entrar em um mapa e confirmar que a caça permanece ativa após o primeiro ciclo.

