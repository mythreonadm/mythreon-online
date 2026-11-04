# Pack 55 — Guarda-roupa, skins completas e auras

## Estado

Implementado e validado localmente em 04/11/2026. Sem migration de schema, commit, push ou deploy. Não encerra o catálogo de skins, as concessões de beta nem a homologação em dispositivos reais.

## Problemas confirmados

- O visual de skin era apenas uma classe de brilho. A sprite completa existente do Primeiro Canto não aparecia no herói.
- Não havia comando para remover um cosmético de um espaço.
- O campo petAuraTemplateId não tinha item/atribuição alcançável: os prefixos aceitos encaminhavam todos os itens para skin, Matriz ou addon.
- Um cosmético físico podia continuar selecionado após o último exemplar sair da propriedade do personagem.
- Personagem declarava um useEffect após retornar quando character era nulo, criando ordem de hooks inconsistente.

## Catálogo e propriedade

src/data/cosmetics.ts é a fonte dos cinco cosméticos conhecidos e seus espaços: skin humana, luminescência da Matriz, aura do Pet e addon do Boss.

Novo item LUMINESCENCIA_PET / oferta PET_LUMINESCENCE: 120 Mythreon Coins, stats vazios, sem efeito sobre combate, alimentação ou rendimento. O item usa emoji enquanto não existir PNG.

equipCosmetic usa o espaço explícito do catálogo; não deduz o destino somente pelo prefixo. unequipCosmetic remove um espaço validado e preserva os demais, itens, recursos, Matriz e Pet.

src/engine/cosmeticOwnership.ts valida propriedade pela mochila, depósito, equipamento legado e direitos permanentes do calendário. É aplicado no save local, resultado do motor e gravação autoritativa de personagens. Slot incompatível ou cosmético não possuído deixa o loadout. Anunciar/enviar/vender o último item físico desativa o visual; cancelar e receber de volta permite equipar novamente. Conquista permanente mensal continua válida sem item.

## Apresentação compartilhada

src/ui/HeroArt.tsx substitui as implementações duplicadas da caça, Personagem e heróis/aliados do Boss Diário.

- Forma humana usa a sprite completa da skin quando cadastrada.
- Capa do Primeiro Canto usa public/assets/items/SKIN_PREMIUM_MES_01.png, arte já existente.
- Forma de Matriz usa a linhagem; a skin não substitui o humanoide transformado. Luminescência da Matriz é aplicada somente à forma transformada.
- Se faltar a sprite de skin, há retorno ao humano de base com as cores salvas. Se também faltar a base, aparece o símbolo da linhagem.
- A arte própria da skin mantém sua paleta; aparência de base é aplicada somente ao humano normal/fallback. A skin completa é uma imagem fixa, sem camadas independentes de cabelo/pele/roupa.
- Addon usa a arte ADDON_BOSS_LUMINESCENTE.png somente no Boss e na prévia. Não aparece na caça comum.
- Aura de Pet usa classe visual no companheiro ativo da hunt. Não altera ataque, nutrição, humor ou Matriz.

O guarda-roupa tem prévia de humano/Matriz, quatro espaços e remoção individual. A edição das cores de base fica separada e não é perdida ao equipar skin. Corrigida a ordem de hooks de Personagem; o teste monta sem personagem e depois carrega um.

Wiki recebeu Skins & Auras e Jornal recebeu pack-55-wardrobe. O catálogo comercial existente permanece; não houve integração financeira ou cobrança em dinheiro real.

## Evidências

- npm run cosmetics:check: catálogo/slots, equipar/remover, compra da nova aura por 120 Coins, rejeição sem propriedade, depósito preservando propriedade, venda removendo seleção, direito mensal sem item, slot inválido e normalização idempotente. Snapshot de stats, HP/MP, skills, equipamento, Matriz/Pet e Gear Score permaneceu igual ao equipar/remover os cosméticos.
- npm run online:check: aura independente, remoção, rejeição de slot inválido, stats preservados e anúncio real com escrow desativando a skin. Cancelamento ao depósito permitiu equipar novamente; demais regressões de Boss, PvP, Mercado, trade e calendário passaram.
- scripts/cosmetics-ui-check.cjs: telas reais de Personagem e ZoneView em fixture, transição nulo/carregado, skin real, remoção/reequipar, aura do Pet, Matriz preservada, addon restrito e fallback com cores. Largura 390 px sem overflow.
- scripts/daily-boss-arena-check.cjs: arte do addon e skin de aliado no roster, HP, golpe/retaliação confirmados, modo sem animação e 390 px passaram.
- scripts/calendar-ui-check.cjs e npm run calendar:check: compatibilidade com conquista mensal e guarda-roupa preservada.
- typecheck e build passaram. Continua o aviso de chunk principal acima de 500 kB (~1,08 MB).

Capturas em node_modules/.cache/cosmetics-ui/ e node_modules/.cache/boss-arena/ foram inspecionadas. A fixture de cosméticos usa Electron offscreen com renderização por software. capturePage retornou UnknownVizError nessa composição; a captura passou a usar frames nativos do evento paint após aguardar imagens e layout. Isso verifica essa prévia e não comprova compatibilidade de GPUs ou celulares físicos.

## Artes e limites

O Manto da Nebulosa usa `public/assets/players/skins/SKIN_MANTO_NEBULOSA.png`, produzido no Pack 61 com fundo transparente. O ícone da aura nova usa `public/assets/items/LUMINESCENCIA_PET.png`, também produzido no Pack 61. Os prompts históricos permanecem em [[docs/ARTE_ITENS_PENDENTES|Artes pendentes]], seção Pack 55.

A prévia da caça ainda mostra quadriculado na arte atual do Elarion; não foi considerada corrigida por CSS ou pela aura. Rever a transparência real dessa imagem é uma tarefa de arte separada.

Ainda faltam atlas com variações de corpo/cabelo/roupa, outras skins mensais/de beta e suas condições de concessão, skins específicas de Matriz, animações próprias por roupa, testes multiusuário simultâneos e dispositivos físicos. A propriedade é por personagem/snapshot autoritativo; não há nova tabela de direitos por conta.

## Arquivos principais

src/data/cosmetics.ts, src/engine/cosmeticOwnership.ts, src/utils/cosmetics.ts, src/ui/HeroArt.tsx, src/ui/CharacterCustomization.tsx, src/ui/Personagem.tsx, src/ui/Zone.tsx, src/ui/DailyBossArena.tsx, src/index.css, src/store/gameStore.ts, server/game.ts, server/world.ts, src/data/items.ts, src/data/mythreonEconomy.ts, Wiki/Jornal, scripts de verificação e documentação. Runtime regenerado pelo build.
