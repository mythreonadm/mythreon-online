---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-04
resumo: Catálogo de Cards dos dez monstros de Pântano de Veyra e Deserto de Kaelor, com compatibilidade sazonal retroativa.
---

# Pack 60 — Cards de Veyra/Kaelor e catálogo sazonal

## O que entrou

O álbum agora possui 48 espécies conhecidas. Foram adicionadas dez memórias com os mesmos `monsterId`, região, raridade, traço e sprite dos mobs dos novos biomas:

| Região | Cards | Raridades |
|---|---|---|
| Pântano de Veyra | Sapo-Miasma, Libélula-Lâmina, Cipó da Memória, Crocodilo de Silte, Matriarca do Lodo | Comum, Incomum, Raro, Épico, Lendário |
| Deserto de Kaelor | Escaravelho Vítreo, Espectro Solar, Serpente de Miragem, Golem de Obsidiana, Sentinela do Zênite | Incomum, Raro, Épico e Lendário |

Cada template é validado contra `ZONES[template.region].enemies`. O drop continua sendo determinado pelo tier do mapa e por ser chefe, não pela raridade visual da carta: T1 3%, T2 2%, T3 1,5%, T4 1%, T5 0,5%; chefes 0,5%. A espécie desconhecida ainda não pode gerar uma carta.

## Bônus e evolução

As dez cartas usam `getCardStats` e `cardHeroBonus` já compartilhados: níveis 1–5 com 100/120/140/160/180% dos atributos iniciais e conversão de 15% HP, 20% ATK, 15% DEF e 0,2% SPD ao herói. A evolução continua determinística, com 2/4/8/16 cópias livres de nível 1 e gold baseado na raridade. Não há efeito oculto de hunt ou PvP nos traços narrativos.

## Compatibilidade da temporada

O Pack 60 não altera retroativamente a meta de novembro de 2026. `seasonCardTemplateIds("2026-11")` mantém apenas as 38 espécies que existiam na abertura da temporada; Cards novos podem ser obtidos e exibidos no álbum, mas não aumentam nem diminuem a fração sazonal de novembro. A partir de `2026-12`, o catálogo da temporada passa a conter as 48 espécies.

`cards.season.read` calcula a espécie única filtrando pelo catálogo da própria temporada. O `total_cards` da linha já gravada é preservado no `ON CONFLICT`, e o resgate usa o total persistido; assim, uma expansão futura nunca reduz o prêmio de uma coleção que já foi encerrada. A regra também ignora templates inválidos ou de uma temporada posterior ao calcular o progresso antigo.

## Arquivos alterados

- `src/data/cards.ts`: dez templates, lista de expansão e helpers `seasonCardTemplateIds`, `seasonCardCatalogSize` e `seasonUniqueCards`.
- `server/world.ts`: leitura e resgate sazonais usam o catálogo da chave solicitada; denominador atual é congelado.
- `src/ui/CardsGuide.tsx`: Wiki explica biomas, drops e a transição 38→48.
- `src/data/mythreonJournal.ts`: entrada editorial do Pack 60.
- `scripts/cards-check.ts`: valida 48 templates, origem dos dez novos, drops e compatibilidade Nov/Dez.

Nenhuma migration ou alteração de schema foi necessária; as colunas existentes já armazenam o snapshot por temporada. O runtime online precisa ser regenerado pelo build antes de publicar.

## Evidências e limites

- `cards:check` deve confirmar o catálogo completo, as duas chaves sazonais e a evolução existente.
- `online:check` deve confirmar leitura/resgate de uma temporada anterior e o replay idempotente. A cobertura ainda é um banco local PGlite serializado, não concorrência real em produção.
- As sprites são referenciadas em `/assets/monsters/{id}.png`; a presença visual depende dos dez arquivos que o criador colocou em `public/assets/monsters`.
- Não declarar o mercado, o Boss, o PvP ou a Loja Premium concluídos por causa deste pack. Este pack somente expande Cards e a contagem sazonal.

[[docs/conhecimento/Pack-59-Cards-Evolucao-e-Bonus-Reais-2026-11-04|Pack 59]] · [[docs/conhecimento/Jornada-Lore-Biomas|Biomas]] · [[docs/conhecimento/01 - Estado e pendencias|Estado e pendências]]
