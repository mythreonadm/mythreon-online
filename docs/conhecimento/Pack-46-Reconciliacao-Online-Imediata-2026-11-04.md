# Pack 46 — Reconciliação online imediata

> Revisão no Pack 48: a causa descrita abaixo não foi comprovada. executeOnlineAction já aplicava o snapshot antes deste pack; a aplicação repetida foi removida. Os checks listados não testavam cliques rápidos com fila e latência. Manter esta nota como histórico, não como prova de que o rollback foi resolvido. Próximo passo: verificar e reconciliar prévias otimistas pendentes sobre cada confirmação.

## Objetivo

Eliminar a sensação de rollback que aparecia quando o jogador clicava em uma ação, via a interface mudar e, antes da confirmação, o próximo estado remoto reexibia a versão anterior.

## Alteração

`src/online/controller.ts` continua usando uma prévia otimista para manter a interface responsiva, mas agora aplica o snapshot autoritativo devolvido por `world.command` assim que a requisição termina. O servidor permanece como fonte de verdade; o polling de recuperação não foi removido.

## Fluxos beneficiados

- equipar e desequipar itens;
- plantar, regar, fertilizar e colher;
- entrar ou sair de uma hunt;
- forjar, desmanchar, vender e movimentar itens;
- ações de Fazenda, Pets, mineração, pesca e calendário;
- comandos sociais que retornam atualização do personagem.

## Segurança e consistência

- O `requestId` continua idempotente e recuperável após falha de rede.
- A atualização só é aplicada se a geração da sessão ainda for a mesma.
- O snapshot remoto substitui a prévia apenas após confirmação do servidor, evitando confiar em saldo ou item calculado no navegador.

## Validação

- `npm run online:check` passou.
- `npm run typecheck` passou.
- `npm run brain:sync` e `npm run brain:check` passaram.
- `npm run build` passou; permanece apenas o aviso conhecido de chunk JS acima de 500 kB.

## Próximo teste manual

Abrir a mesma conta em dois dispositivos, executar ações de inventário e Fazenda, desligar a rede durante uma ação e verificar se a recuperação mantém exatamente um resultado, sem duplicar item, gold ou progresso.

## Correção de interpretação — Pack 56

As afirmações anteriores sobre eliminar regressões de prévia eram amplas demais: a remoção de aplicação duplicada não preservava comandos posteriores ainda pendentes. O [[docs/conhecimento/Pack-56-Fila-Online-e-Recuperacao-2026-11-04|Pack 56]] introduz efetivamente base confirmada + replay da fila, diário completo e isolamento de sessão, com teste integrado dos dois plantios. As evidências antigas continuam históricas; não usar este Pack 46 sozinho como prova de fluidez online.
