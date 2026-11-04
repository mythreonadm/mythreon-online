# Pack 01 — Fundação de Evolução e Conteúdo

Data: 2026-11-03
Status: implementado e validado localmente

## Objetivo

Estabelecer a primeira camada jogável da nova fase de Mythreon: Matriz e Pet funcionando juntos, incubação com tempo persistente, tutorial resiliente a novas cenas e comunicação online com fallback rápido.

## Alterações

- A Besta Divina não substitui mais a Matriz. `activeRace` e `activeDivineBeastId` podem coexistir.
- O ataque auxiliar do pet continua disponível quando uma Matriz está equipada.
- O Laboratório de Builds preserva o pet ao testar Matrizes e preserva a Matriz ao testar pets.
- A incubadora agora registra ovo, tier, início e término.
- O botão de eclosão inicia a incubação; a eclosão só ocorre quando o tempo termina.
- O save migra automaticamente o novo estado da incubadora.
- O polling social caiu de 15s para 5s para reduzir a sensação de atraso quando o Realtime não está pronto.
- O teste do tutorial avança dinamicamente por todas as cenas e textos, sem depender de quantidade fixa de slides.
- O teste online local agora aplica as migrations necessárias para canais, trades e coins, removendo apenas blocos de publicação que o PGlite não suporta.

## Contratos

### Matriz + Pet

1. Matriz define a transformação, passivas e suporte.
2. Pet concede bônus próprios e ataque auxiliar.
3. Ativar ou desativar pet não altera `activeRace`.
4. Trocar Matriz não remove o pet ativo.
5. Trocar pet não remove a Matriz.

### Incubação

- T1: 60s
- T2: 180s
- T3: 480s
- T4: 1200s
- T5: 2400s

O beta usa tempos curtos para permitir testes. Antes do lançamento, recalibrar para a economia final.

## Validação

- `npm run typecheck` passou.
- `npm run journey:check` passou.
- `npm run online:check` passou.
- `npm run build` passou.
- `npm run online:bundle-check` passou.
- `npm run brain:check` passou.
- `npx electron scripts/journey-ui-check.cjs` passou.
- `npx electron scripts/online-ui-check.cjs` passou com dois clientes, chat, ranking, VIP e troca bilateral.

## Próximo pack

1. Sprites de personagem por aparência.
2. Animação e áudio do pet na caça.
3. Cativeiro com seleção individual de cópias.
4. Fusão de pets com ração e chance configurável.
5. Testes mobile da incubadora e do combate.
