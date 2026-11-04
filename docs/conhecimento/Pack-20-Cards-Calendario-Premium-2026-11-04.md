# Pack 20 — Cards, Calendário e superfície Premium

Data: 04/11/2026

## Entregue

- Álbum de Cards próprio, com contador de coleção, percentual de conclusão, filtros por raridade e bioma.
- Modal de detalhes com traço, habilidade e atributos da carta selecionada.
- Aba Calendário própria, sem remover o acesso pelo Refúgio, mantendo cupom, sequência semanal e recompensa de 30 dias.
- Navegação liberada após o tutorial, preservando a jornada guiada.
- A Loja Mythreon continua separando conveniência, cosméticos, ovos, tomos e Premium de atributos de combate; nenhum checkout é confirmado no cliente.

## Arquivos principais

- `src/ui/CardAlbum.tsx`
- `src/ui/DailyCalendar.tsx`
- `src/App.tsx`
- `src/engine/journey.ts`
- `src/data/cards.ts`
- `src/data/mythreonEconomy.ts`

## Próxima fatia

Implementar o Mercado Negro online com anúncios reservados no servidor, compra atômica, expiração, taxa anti-inflação, preço médio e auditoria. A tela atual da Loja permanece como fallback até a migration e os testes concorrentes serem concluídos.

## Validação

- `npm run typecheck` passou após a inclusão das abas.
- Falta repetir `online:check`, bundle, build e sincronização do Cérebro no fechamento do ciclo.
