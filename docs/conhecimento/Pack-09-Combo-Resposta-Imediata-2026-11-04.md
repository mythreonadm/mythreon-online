# Pack 09 — Combo com resposta imediata

Data: 04/11/2026

## Objetivo

Retomar a sensação de jogabilidade ativa durante a caça. O combo manual não deve esperar o próximo intervalo de 3 segundos para produzir o segundo impacto.

## Alteração

`src/store/gameStore.ts` agora resolve o próximo tick imediatamente após a sequência correta no modo local. O servidor continua sendo a autoridade: `server/game.ts` já executa o tick na mesma transação de `armSpecialCombo`.

## Garantias

- O dano, a pontuação ouro/prata/bronze e o cooldown continuam calculados pelo motor de combate.
- A alteração reduz apenas a latência percebida no modo local.
- A sessão online não cria um segundo tick: o preview não executa `tick` e o servidor confirma a ação uma única vez.
- O golpe continua limitado pelo cooldown de 15 segundos e pela janela de 12 segundos para completar o combo.

## Teste manual recomendado

1. Iniciar uma caça em Bosque de Lyss.
2. Completar a sequência exibida no botão, no PC ou nos botões de toque.
3. Confirmar que os dois números de dano aparecem sem aguardar o ciclo seguinte.
4. Confirmar a medalha, o brilho do impacto e o cooldown visível.
5. Repetir em uma sessão online e em uma tela estreita.
