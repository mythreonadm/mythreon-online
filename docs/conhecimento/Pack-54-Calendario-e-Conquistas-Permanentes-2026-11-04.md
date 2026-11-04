# Pack 54 — Calendário real e conquistas permanentes

## Estado

Implementado e validado localmente em 04/11/2026. Revisa as regras do Pack 27 sem alterar o PvP daquele pack. Sem migration, commit, push ou deploy. O calendário continua por personagem, não por conta inteira.

## Problemas confirmados no código anterior

- A tela desenhava sempre 30 dias: faltava dia 31 e havia datas inexistentes em fevereiro.
- O bônus por chave ISO e streak >= 7 podia sair no oitavo dia quando a semana mudava.
- A skin dependia de streak total, permitindo contar presenças do mês anterior como conclusão do mês novo.
- O marcador mensal era gravado mesmo quando addItem falhava; o jogador podia perder a skin. A tentativa de stack semanal também podia alterar parcialmente o inventário antes de falhar.
- O indicador semanal aceitava qualquer chave antiga como bônus desta semana. O gold escalava indefinidamente.
- A arte existente SKIN_PREMIUM_MES_01.png não era usada pelo ItemIcon do template SKIN_CAPA_PRIMEIRO_CANTO.

## Regras vigentes

Fonte compartilhada: src/data/dailyCalendar.ts. Entrega: src/engine/dailyCalendar.ts.

1. Um cupom por presença; compra custa 1 Mythreon Coin. A data é UTC no motor/servidor. Cliente não escolhe data: argumentos extras nos comandos de compra/resgate são rejeitados.
2. A tela tem 28/29/30/31 dias reais, com alinhamento dos dias da semana, presença, ausência e hoje.
3. Faltar zera a sequência exibida/seguinte, mas mantém as presenças válidas do mês.
4. Cada bloco de sete dias consecutivos entrega 3 Fragmentos Raros: 7, 14, 21, 28… O recibo usa início da sequência + número do marco. Marco sem recibo pode ser recuperado uma vez; não se entregam todos os marcos históricos acumulados.
5. Recibo ISO legado é interpretado como o último marco concluído da sequência corrente. O sistema não tenta reconstruir a data exata de premiações antigas, que o campo ISO não guardava, nem revoga prêmios já recebidos.
6. A recompensa mensal usa presenças únicas no próprio mês, sem depender da sequência anterior: 30 presenças, ou 28/29 em fevereiro. Um mês de 31 dias permite uma ausência.
7. Gold diário = 500 + min(streak, 30) × 250. Começa em 750 e tem teto de 8.000 por resgate, em vez de crescimento ilimitado.
8. Fragmentos tentam a mochila em cópia isolada e depois o depósito, respeitando depotMax. Se não houver espaço nos dois, o resgate inteiro falha sem consumir cupom, registrar presença, alterar gold ou preencher stack parcialmente.
9. Skin conquistada entra em Character.calendarUnlockedSkins: não ocupa bolsa, não é perdida ao vender itens, e pode ser equipada em Personagem → Personalização. A lista é um direito do personagem, não um novo item negociável.

## Compatibilidade e cosméticos

calendarMonthlySkinKey legado continua como recibo oficial. Se já foi marcado, calendarUnlockedSkins recupera o direito à skin cadastrada daquele mês, mesmo se o item não está mais no inventário. Itens físicos antigos não são removidos.

Skins conquistadas e itens cosméticos da mochila/depósito são unificados por template no guarda-roupa. equipCosmetic aceita o direito permanente além dos itens antigos. O efeito existente da Capa do Primeiro Canto continua visual, sem entrar em stats/dano; a troca da sprite humana completa é uma evolução futura, não uma entrega deste pack.

O catálogo anunciado contém novembro de 2026 / Capa do Primeiro Canto. Meses não cadastrados dizem que a skin ainda não foi anunciada, sem prometer uma recompensa inexistente. Mantenha entradas históricas do catálogo ao adicionar novos meses, pois elas identificam recibos legados e conquistas.

## Interface e artes

- Reutilizados public/assets/ui/CALENDARIO_ESSENCIA.png, SELO_SEQUENCIA_SEMANAL.png e public/assets/items/SKIN_PREMIUM_MES_01.png.
- Cabeçalho reorganizado no celular, calendário de sete colunas, sequência semanal e prévia/progresso mensal.
- Resgates e compras mostram mensagem no painel, sem alert bloqueante. Botões desabilitam ações já resgatadas ou sem recursos; proteção imediata contra clique duplicado na mesma interação.
- Wiki ganhou Calendário & Presença; Jornal recebeu a atualização pack-54-calendar.

## Evidências

- npm run calendar:check: dias reais, fevereiro bissexto, fronteira UTC/Brasília, 30 resgates, marcos a cada sete dias da sequência, não duplicar no mesmo dia, reset por ausência, virada de mês, teto de gold, lista suja/duplicada, bolsa/depósito cheios, stack parcial, destino no depósito, skin permanente/recarregada/legada e equipar; recuperação única de marco sem recibo e compatibilidade ISO.
- npm run online:check: comando real com PGlite, replay da mesma requisição mensal sem consumir outro cupom ou duplicar gold, leitura persistida da conquista, equipar pelo direito permanente, rejeição de data enviada pelo cliente e rollback semanal com ambos os armazenamentos cheios. O relógio foi simulado exclusivamente na fixture de teste e restaurado ao fim.
- scripts/calendar-ui-check.cjs: arte carregada, meses com 30 e 29 dias, compra de cupom, clique repetido protegido, bônus semanal no depósito, skin no guarda-roupa, equipar e 390 px sem overflow. Capturas desktop/mobile em node_modules/.cache/calendar-ui/ inspecionadas.
- typecheck e build passaram. Continua o aviso de chunk principal acima de 500 kB (~1,08 MB).

## Limites e próximas fatias

Sem teste em celular físico, carga real ou concorrência PostgreSQL com conexões independentes. PGlite usa conexão serializada. O relógio da UI é uma prévia local; a confirmação do resgate usa o relógio do servidor.

Continuam pendentes catálogo/artes de outros meses, três skins de beta com elegibilidade e concessão próprias, histórico navegável de meses anteriores, troca da sprite humana ao equipar skin e homologação de produção. A lista permanente está no snapshot autoritativo do personagem; ainda não é uma tabela de direitos por conta.

## Arquivos principais

src/data/dailyCalendar.ts, src/engine/dailyCalendar.ts, src/store/gameStore.ts, src/types/index.ts, src/engine/save.ts, server/game.ts, src/ui/DailyCalendar.tsx, src/ui/CharacterCustomization.tsx, src/ui/ItemIcon.tsx, src/ui/DailyCalendarGuide.tsx, src/ui/Wiki.tsx, src/data/mythreonJournal.ts, scripts/calendar-check.ts, scripts/calendar-ui-check.cjs, scripts/online-check.ts e package.json. Runtime gerado pelo build, sem edição manual.

## Continuação visual — Pack 55

A troca da sprite humana da skin do Primeiro Canto, pendente acima, foi implementada por [[docs/conhecimento/Pack-55-Guarda-Roupa-Skins-e-Auras-2026-11-04|Pack55]]. Guarda-roupa permite prévia e remoção individual, mantendo direito permanente do calendário. Catálogo futuro, beta e homologação física continuam pendentes.
