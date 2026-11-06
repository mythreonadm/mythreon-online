# Auditoria da Wiki de Mythreon Online

Data da revisão: 06/11/2026  
Fonte: `src/ui/Wiki.tsx` + catálogos em `src/data` e motores em `src/engine`.

## Resultado

A Wiki já cobria história, jornadas, zonas, monstros, equipamentos, elementos, componentes, raças, chefes, mochilas, fragmentos, pets, cartas, profissões, calendário, cosméticos e balanceamento. Ela ainda não explicava vários sistemas adicionados depois da primeira versão.

Foi incluída uma revisão v1.4 na aba Arquivo/Wiki com as seguintes áreas:

- Ondas de Caça e Bestiário: quatro ondas narrativas, capangas, chefe da linhagem, escalas, drop de 1% e desbloqueio de autoloot em 1.000 abates.
- Progressão e Stamina: stamina online/offline, compras de pré-teste, combate manual, Ritmo da Essência, cooldowns, pet de 5 segundos, treino, Gear Score, morte, Bless e bolsa.
- Fazenda e Receitas: terrenos, custos de expansão, skills de Plantio/Colheita, sementes, crescimento, fertilidade, venda bruta e receitas refinadas.
- Mundo Online: conta Supabase, personagens sincronizados, chats, VIP, correio, troca segura, links no chat e histórico do Mercado Online.
- Economia e Loja: Mythreon Shards, Mythreon Coins, refinamento, ofertas, doações, Premium, cosméticos, buffs e baús por tempo online.
- Boss Diário e PvP: ciclos UTC, escala cooperativa, dano individual, hit final, rating, distância, cooldowns, resistências e situação das guildas.
- Encantamentos Únicos: uma runa por mapa, 100 runas, requisito de item Incomum+, efeitos de arma/armadura e efeitos visuais.

## Estado documentado

Cada bloco novo exibe uma etiqueta de estado:

- **ATIVO**: existe no catálogo e está ligado à interface/motor atual.
- **EM TESTE**: existe e pode ser testado, mas ainda recebe ajustes de balanceamento ou de infraestrutura online.
- **PLANEJADO**: especificação registrada, porém não deve ser apresentada ao jogador como funcional até o backend correspondente existir.

## Fontes de dados conferidas

`farm.ts`, `mythreonEconomy.ts`, `enchantments.ts`, `dailyBoss.ts`, `onlineChest.ts`, `professions.ts`, `dailyCalendar.ts`, `cards.ts`, `stamina.ts`, `huntWaves.ts`, `combat.ts`, `OnlineCommunity.tsx`, `OnlineMarket.tsx`, `DailyBossArena.tsx` e `Shop.tsx`.

## Pendências que permanecem fora da Wiki como recurso ativo

Guildas completas (convites, níveis, doações e loja), checkout real Premium/doações e lançamento final dos clientes desktop/mobile continuam dependentes da infraestrutura externa. A Wiki os identifica como planejados ou em teste para não prometer uma funcionalidade que ainda não está garantida pelo servidor.

## Validação

`tsc --project tsconfig.json --noEmit` e `npm run build` concluídos com sucesso após a revisão. O build também sincronizou o Cérebro e as notas do Obsidian.
