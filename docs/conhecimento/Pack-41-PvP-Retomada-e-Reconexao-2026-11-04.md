# Pack 41 — Retomada e reconexão do PvP

Data: 04/11/2026  
Estado: implementado localmente

## Objetivo

Evitar que a partida pareça perdida quando o jogador recarrega a página, troca de aba ou recupera uma conexão instável. O servidor continua sendo a fonte de verdade; o cliente apenas relê o estado persistido.

## Implementado

- `src/ui/OnlinePvP.tsx`:
  - leitura automática de `pvp.read` ao montar a tela;
  - atualização periódica de 5 segundos para refletir o turno do adversário;
  - nova leitura imediata ao voltar para a aba visível;
  - nova leitura imediata no evento de reconexão do navegador;
  - bloqueio de ações enquanto o navegador está offline;
  - indicador `Online · partida retomável`, `Sincronizando…` ou `Offline · partida preservada`.

## Segurança

Nenhum HP, turno, rating ou recompensa é calculado no cliente. Ao reconectar, a tela apenas reidrata a partida que já está persistida em `world_pvp_matches`.

## Validação pendente

Executar um playtest com duas contas reais em navegadores separados: aceitar o duelo, desligar a rede de um participante, recarregar, reconectar e confirmar que apenas o dono do turno consegue atacar.
