# Pack 27 — Marcos do Calendário e temporada do PvP

Data: 2026-11-04  
Estado: implementado e validado em desenvolvimento

## O que entrou

- O calendário agora persiste a chave do bônus semanal (`YYYY-Www`) e não usa somente o resto da sequência. Isso evita entregar o mesmo marco duas vezes na mesma semana.
- O marco semanal exige sequência de pelo menos 7 dias e entrega 3 Fragmentos Raros. Se a mochila estiver cheia, o marco permanece pendente para não perder a recompensa.
- O marco mensal persiste `YYYY-MM`, entrega a skin cadastrada para o mês e não duplica o cosmético. Novembro de 2026 usa `SKIN_CAPA_PRIMEIRO_CANTO`; novos meses podem ser adicionados no catálogo sem alterar a regra de resgate.
- A tela do calendário exibe o estado dos dois marcos: disponível, em andamento ou já entregue.
- O lobby de PvP informa a temporada UTC atual e a data de encerramento no primeiro instante do mês seguinte. A resolução de combate e o Elo permanecem inalterados.

## Arquivos principais

- `src/types/index.ts`
- `src/engine/save.ts`
- `src/store/gameStore.ts`
- `src/ui/DailyCalendar.tsx`
- `src/ui/OnlinePvP.tsx`
- `server/world.ts`
- `scripts/online-check.ts`

## Garantias

- Campos novos são opcionais e recebem migração segura em saves antigos.
- O calendário continua consumindo um Cupom de Resgate por dia.
- A temporada é apenas metadado de leitura; não altera o cálculo autoritativo do duelo.
- O teste online verifica a chave da temporada, o término futuro, a entrega semanal e a rejeição de segundo resgate no mesmo dia.

## Próxima fatia

- Catálogo de skins mensais por temporada e entrega via evento/jornal.
- Matchmaking por faixa de rating e histórico de temporadas do PvP.
- Recompensas do calendário com itens específicos por marco, sem impacto direto de poder.

## Revisão pelo Pack 54 — 04/11/2026

A inspeção posterior confirmou que a proteção por semana ISO não atendia ao texto “a cada 7 dias” e que a entrega mensal podia ser marcada sem item em bolsa cheia. Essas garantias antigas não devem ser tratadas como prova do comportamento atual. [[docs/conhecimento/Pack-54-Calendario-e-Conquistas-Permanentes-2026-11-04|Pack 54]] substitui o recibo semanal por marcos da sequência, usa presenças do próprio mês, garante skin por direito permanente e torna a entrega semanal atômica com alternativa no depósito. A parte de PvP deste documento é histórica e não foi alterada por essa revisão.
