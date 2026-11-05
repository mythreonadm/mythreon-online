# Pack 68 — Calendário Free e recompensas diárias

**Data:** 05/11/2026

## Regras finais

- Todo jogador pode coletar o prêmio do dia atual gratuitamente.
- Cada dia mostra o item, o ícone, a quantidade e o gold da sequência.
- A coleta entrega primeiro na mochila e usa o depósito como fallback; sem espaço, a ação é preservada.
- O Cupom de Resgate não é mais exigido para a coleta diária.
- O cupom serve somente para recuperar um dia já perdido ou comprar a recuperação dos dias faltantes da semana atual.
- A recuperação em lote cobra um cupom por dia perdido e só considera dias anteriores ao dia atual.
- A sequência semanal e a presença mensal continuam persistentes e protegidas contra duplicidade.

## Catálogo diário

O catálogo fica em `src/data/dailyCalendar.ts` (`CALENDAR_DAILY_REWARDS`). Ele usa templates reais do jogo: fragmentos, poções, minérios, comida de Pets, ovos, chaves e baús. A interface usa `ItemIcon`, então imagens existentes são preferidas e o emoji do template permanece como fallback.

## Ações

- `claimDailyCalendar`: coleta gratuita do dia atual.
- `recoverCalendarDay(day)`: recupera um único dia perdido usando um cupom.
- `recoverCalendarWeek()`: recupera todos os dias perdidos da semana atual, cobrando um cupom por dia.
- `buyCalendarCoupon`: compra um cupom com Mythreon Coin para recuperação futura.

As três ações de resgate/recuperação são deduplicadas no cliente online, projetáveis no estado e despachadas pelo runtime server-side.

## Teste manual

1. Abrir Calendário com uma conta Free e confirmar que o botão do dia atual diz `Resgatar recompensa grátis`.
2. Verificar item, ícone e quantidade em cada célula.
3. Coletar o dia e confirmar item na mochila/depósito, gold e marca verde.
4. Simular um dia perdido: clicar na célula magenta e confirmar o consumo de um cupom.
5. Verificar `Recuperar N dia(s)` para a semana e confirmar que a cobrança é exatamente N cupons.
6. Repetir a mesma ação após recarregar: não pode duplicar recompensa.
