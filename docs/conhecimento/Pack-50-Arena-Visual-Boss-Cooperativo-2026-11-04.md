# Pack 50 — Arena visual do Boss Diário

## Entrega

A aba Boss ganhou uma cena de combate própria, com o fundo do bioma correspondente, personagem transformado ou humano personalizado, Boss, HP compartilhado e participantes recentes. Reutiliza PNG/GIF/Giff por AssetImage. Skins, brilho da Matriz e addon do Boss usam o catálogo cosmético existente.

A API dailyBoss.read inclui até 12 participantes recentes em roster, com apenas ID público do personagem, nome, dano, horário do último ataque, ataque da Matriz, aparência e loadout cosmético. Não envia inventário, depósito, owner, sessão ou estado completo. A cena mostra até cinco aliados, além do personagem local; o contador informa o total.

O golpe próprio só ganha projétil/número após resposta de dailyBoss.attack. Cada hit inclui runId para não vazar visualmente ao próximo ciclo. Atividade dos aliados compara totais entre leituras; mostra o dano agregado sincronizado, sem inventar um golpe individual. A primeira carga não anima contribuições históricas.

Modos compatibilidade, econômico, animação desligada e prefers-reduced-motion mantêm o dano legível sem depender do projétil. Falhas finais de sprite usam um símbolo visível. O layout usa largura fluida e não cria rolagem horizontal a 390px.

## Arquivos

- src/ui/DailyBossArena.tsx
- src/ui/dailyBossArena.css
- src/ui/DailyBoss.tsx
- server/world.ts
- scripts/online-check.ts
- scripts/daily-boss-arena-check.cjs

## Verificação e reprodução

typecheck e build passaram; runtime de API regenerado. Permanece o aviso de chunk JavaScript principal acima de 500 kB.

online:check passou, incluindo whitelist dos campos públicos do roster e manutenção do fluxo cooperativo/resgate do Pack 49.

Executar node_modules/.bin/electron.cmd scripts/daily-boss-arena-check.cjs para prévia isolada: verifica dois aliados, HP de 65%, ausência de dano histórico animado, +120 de contribuição nova, hit de 320 após confirmação de teste, viewport de 390px sem overflow e animações desligadas. Capturas desktop/mobile são geradas em node_modules/.cache/boss-arena/.

A prévia usa fixtures explícitas e não conecta à produção. Foi inspecionada visualmente após renderização fora da tela para evitar capturas antigas do compositor. Ela valida o componente, não substitui teste do painel completo com contas reais.

## Limites

A arena é apresentada na aba Boss, sem mudar o estado da hunt. As contribuições remotas continuam usando polling de dez segundos; não foi implementado streaming de cada ataque. Não há dano de retaliação do Boss, posição controlável, morte cooperativa ou espectadores ilimitados renderizados. Próximo pack deve tratar a mecânica defensiva e a inscrição do próximo evento, seguido de carga em PostgreSQL e aparelhos reais. Nenhum push/deploy/migration foi executado.
