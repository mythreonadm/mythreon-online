# MYTHREON ONLINE — Plano de melhorias (para delegar a outra IA)

> Documento denso e autossuficiente. Base: código do `MYTHREON_ONLINE.rar` (React 18 + TS + Vite + Zustand + Tailwind, save em localStorage `mythreon_save_v1`).
> ⚠️ Eu li o código **antes** de você evoluir o jogo. Antes de aplicar qualquer item, **verifique se ele já existe/foi corrigido**.
> Regras para a IA executora: mudanças pequenas e incrementais · manter compatibilidade de save (campos novos **opcionais** + migração em `loadGame`) · rodar `tsc --noEmit` a cada etapa · não reescrever arquivos inteiros sem necessidade.

---

## 1. Bugs confirmados no código (prioridade 0)

| # | Onde | Problema | Correção |
|---|---|---|---|
| 1 | `data/zones.ts` | Verme-Abissal dropa `A14`, que **não existe** em `components.ts` (só A1–A10) → `makeComponent` dá `TypeError` e trava a Cicatriz Profunda | Criar A11–A15 (e S10–S13: o doc diz 15 ataques/13 suportes, o código tinha 10/9) |
| 2 | `engine/combat.ts` | Com `DEBUG_MODE=false`, cada drop entra **2×** no inventário (`rollDrops→addItem` e depois `result.drops.forEach(addItem)`) | Adicionar ao inventário uma única vez |
| 3 | `engine/combat.ts` | `enemyHp` é reiniciado em **todo** `processTick` (3s). Online, monstro com HP > dano de 1 golpe **nunca morre** (o debug de 99999 de dano esconde isso) | Persistir `enemyHp`/`enemyHpId` no `Character`; resetar ao trocar alvo/zona |
| 4 | `engine/combat.ts` | Cura de 10% por abate usa `char.hp`, mas o loop usa `playerHp` local → a cura é sobrescrita | Usar só uma variável de HP e sincronizar no fim |
| 5 | `engine/drops.ts` + `data/items.ts` | Pool de equipamento filtra `tier === zone.tier`, mas só existem itens T1 (+`ESPADA_T2`) → **zonas 3–5 nunca dropam equipamento** | Criar itens T2–T5 (seção 4) |
| 6 | `engine/inventory.ts` | Equipar `BACKPACK` não altera `inventory.backpack.slots` → Old Backpack é inútil | `equipBackpack()` troca `inventory.backpack`; devolver a anterior; bloquear mochila pior |
| 7 | `engine/inventory.ts` | `ANEL_T1` tem slot `ANEL_I`; o 2º anel nunca vai para `ANEL_II` | Se `ANEL_I` ocupado e `ANEL_II` livre → equipar em `ANEL_II` |
| 8 | `engine/inventory.ts` | `addItem` empilhável: após empilhar parcialmente, empurra o item com a quantidade **total** (duplica) | Empurrar só o restante |
| 9 | `engine/stats.ts` | Curva `100·1.2^(n-1)`: nível 100 exige ~7 bilhões de XP/nível → zonas 4–5 inalcançáveis | Nv ≤25 igual; depois `floor(7950·(L/25)^3)` |
| 10 | `data/zones.ts` | Componentes **impossíveis de obter**: A6, A7, A10, S2–S8 e P3, P4, P5, P7–P10 (nenhum inimigo/ambiente dropa) | Ver seção 3 (cobertura de drops) e `ambientPool` por zona |
| 11 | `engine/combat.ts` | Stats ignorados no combate: `def, hit, crit, dge, blk, spd, matk, mp, resFisico, resMagico` | Usar no combate (seção 5) |
| 12 | `ui/Zone.tsx` | (a) hooks depois de `return null` (violação das regras de hooks); (b) spawn aleatório a cada montagem → trocar de aba muda o alvo; (c) número flutuante fixo `9999`; (d) animação detecta ataque por **texto do log** (`"Você causou"`) | (a) mover o guard; (b) manter `activeEnemyId` se for da zona; (c)(d) expor `lastDamage/attacked/lastCrit` no `TickResult` |
| 13 | morte | Log diz "Voltou para a casa" mas o jogo **continua caçando** | `stopHunting()` ao morrer |
| 14 | projeto | Sem `tsconfig.json`/`vite.config.*` no rar (`npm run build` = `tsc && vite build` falharia); `src/index.cs`, `src/index.html`, `src/play.sh` são lixo/duplicados | Criar tsconfig (strict, jsx react-jsx, moduleResolution bundler) e limpar |
| 15 | `store/gameStore.ts` | `synthesize` monta a raça inline; `engine/synthesis.ts` existe mas não é usado. Só 2 raças nomeadas (doc diz 33). Nomes `Híbrido A1S1P1` | Unificar em `synthesizeRace`; completar as 33 raças |
| 16 | `Item.slot` | `OFF_HAND`, `MUNICAO`, `BACKPACK` existem no tipo, mas `Equipment.tsx` só lista 10 slots (sem mochila/munição) | Adicionar slots na UI |

---

## 2. Arquitetura recomendada

- **Modo Teste** (antigo `DEBUG_MODE`) → `config.ts` com `isDebug()/setDebug()` persistido em localStorage + botão no header. Padrão **desligado**. No modo teste: dano 99999, 100% de drop, XP ×10.
- **Dados vs. lógica**: tudo de balanceamento em `src/data/*` (zonas, itens, skills, missões); motor sem números mágicos.
- **Save**: `ensureCharacterDefaults()` ao carregar (campos novos opcionais), `version` no arquivo, **exportar/importar JSON**, backup automático do save anterior.
- **Testes**: `vitest` no motor (`processTick`, `inventory`, `quests`, `shop`) + **simulador de balanceamento** (seção 7).
- Combate "sem estado" por contador de ticks (`char.tickCount`) → cooldowns e buffs funcionam igual online e offline.
- Offline: já limitado a 8h (9.600 ticks). Se ficar pesado, calcular em lote por fórmula.

---

## 3. Conteúdo: monstros (calibrados por simulação)

HP/ATK/ARM/XP/ouro abaixo são **base 1★** — o motor multiplica HP, ATK, ARM, XP e ouro pelas estrelas. `nv mín` trava o alvo na UI (e no motor, cai para o 1º inimigo). Campos novos no `Enemy`: `minLevel?`, `damageType?: "FISICO"|"MAGICO"`, `uniqueDropId?`, `uniqueDropChance?`.
Zona ganha `ambientPool?: string[]` (passivas que caem a cada 10 abates): Lyss `P1,P8,P9` · Dhor `P2,P4,P7` · Azhar `P6,P5,P10` · Asterion `P11,P10,P3` · Cicatriz `P12,P9,P3` (cobre P1–P12).
Chefes: drop 100% de componente, equipamento 60% com raridade melhorada, +ambiente, +poção 50%, **mochila** (chance baixa) e **item único** (6%).
Os números abaixo são o ponto de partida para você ajustar; Lobo e Vespa são os originais.

**Bosque de Lyss** (T1, nv 1–10)

| id | monstro | ★ | nv mín | HP | ATK | ARM | XP | ouro | A | S | notas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| LOBO | 🐺 Lobo-Feral | 1 | 1 | 30 | 4 | 1 | 15 | 5–12 | A1 | S1 |  |
| VESPA | 🐝 Vespa-Cinza | 2 | 1 | 25 | 6 | 0 | 18 | 6–15 | A2 | S1 |  |
| ESPINHEIRO | 🪴 Espinheiro-Vivo | 2 | 3 | 18 | 4 | 2 | 9 | 7–11 | A7 | S2 |  |
| FALCAO | 🦅 Falcão-Ruivo | 3 | 5 | 21 | 13 | 1 | 9 | 5–8 | A10 | S8 |  |
| JAVALI | 🐗 Javali-Musgoso | 3 | 7 | 40 | 13 | 3 | 16 | 6–9 | A1 | S4 |  |
| ESPECTRO | 👻 Espectro de Brasa | 4 | 9 | 83 | 12 | 2 | 80 | 22–32 | A3 | S9 | 👑chefe, mágico, UNICO_BRASA_ETERNA, mochila OLD |

**Pico de Dhor** (T2, nv 11–25)

| id | monstro | ★ | nv mín | HP | ATK | ARM | XP | ouro | A | S | notas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GOLEM | 🗿 Golem-Rocha | 3 | 11 | 49 | 12 | 5 | 25 | 27–40 | A9 | S7 |  |
| URSO | 🐻 Urso-Fenda | 2 | 13 | 84 | 45 | 6 | 64 | 40–60 | A4 | S5 |  |
| BANDIDO | 🥷 Bandido do Desfiladeiro | 3 | 16 | 55 | 31 | 5 | 81 | 43–64 | A6 | S10 |  |
| ELEMENTAL_GELO | 🧊 Elemental de Gelo | 4 | 19 | 55 | 25 | 5 | 115 | 24–36 | A11 | S6 | mágico |
| YETI | 🦍 Yeti-do-Cume | 4 | 22 | 68 | 28 | 4 | 179 | 26–39 | A4 | S11 |  |
| COLOSSO | 🏔️ Colosso de Dhor | 5 | 24 | 149 | 23 | 5 | 795 | 96–144 | A9 | S7 | 👑chefe, UNICO_CORACAO_GRANITO, mochila COURO |

**Mar de Azhar** (T3, nv 26–45)

| id | monstro | ★ | nv mín | HP | ATK | ARM | XP | ouro | A | S | notas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CARANGUEJO | 🦀 Caranguejo-Colosso | 3 | 26 | 109 | 27 | 10 | 266 | 88–132 | A9 | S7 |  |
| SERPENTE | 🐍 Serpente-Névoa | 4 | 28 | 81 | 44 | 6 | 271 | 73–109 | A5 | S3 |  |
| MEDUSA | 🪼 Medusa-Trovão | 3 | 32 | 104 | 66 | 6 | 623 | 106–158 | A13 | S4 | mágico |
| SEREIA | 🧜 Sereia-Cantora | 4 | 35 | 91 | 49 | 7 | 647 | 92–139 | A5 | S3 | mágico |
| POLVO | 🐙 Polvo-Abissal | 4 | 38 | 133 | 48 | 8 | 875 | 92–139 | A12 | S6 |  |
| LEVIATA | 🐋 Leviatã de Azhar | 5 | 43 | 269 | 43 | 8 | 3312 | 317–475 | A12 | S5 | 👑chefe, UNICO_ESCAMA_LEVIATA, mochila REFORCADA |

**Ruínas de Asterion** (T4, nv 46–70)

| id | monstro | ★ | nv mín | HP | ATK | ARM | XP | ouro | A | S | notas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HIENA | 🐕 Hiena-Abissal | 4 | 46 | 103 | 51 | 7 | 703 | 170–255 | A8 | S9 |  |
| SENTINELA | 🗿 Sentinela de Pedra | 4 | 50 | 199 | 64 | 19 | 984 | 187–281 | A9 | S11 |  |
| ESCORPIAO | 🦂 Escorpião-Rúnico | 4 | 55 | 150 | 88 | 13 | 1489 | 221–332 | A2 | S10 |  |
| CULTISTA | 🧿 Cultista do Eclipse | 5 | 60 | 112 | 73 | 8 | 1654 | 204–306 | A3 | S12 | mágico |
| GUARDIAO | 🛡️ Guardião de Asterion | 5 | 66 | 449 | 75 | 14 | 8726 | 816–1224 | A15 | S12 | 👑chefe, UNICO_OLHO_ASTERION, mochila EXPLORADOR |

**Cicatriz Profunda** (T5, nv 71–100)

| id | monstro | ★ | nv mín | HP | ATK | ARM | XP | ouro | A | S | notas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CRIA_VAZIO | 👾 Cria do Vazio | 4 | 71 | 169 | 79 | 12 | 1767 | 520–780 | A14 | S13 | mágico |
| VERME | 🪱 Verme-Abissal | 5 | 75 | 230 | 110 | 17 | 1897 | 499–749 | A14 | S13 |  |
| ABERRACAO | 🦑 Aberração Tentacular | 5 | 82 | 259 | 123 | 17 | 2901 | 582–874 | A12 | S13 |  |
| SOMBRA | 🌑 Sombra Faminta | 5 | 88 | 206 | 136 | 13 | 3962 | 624–936 | A3 | S12 | mágico |
| DEVORADOR | 👹 Devorador da Cicatriz | 5 | 95 | 771 | 133 | 22 | 18171 | 2496–3744 | A14 | S13 | 👑chefe, UNICO_PRESA_DEVORADOR, mochila ARCANA |

Cobertura: A1–A15 e S1–S13 saem de pelo menos um monstro; P1–P12 do `ambientPool`.

---

## 4. Conteúdo: itens

**Famílias × 5 tiers** (T1 Lyss, T2 Dhor, T3 Azhar, T4 Asterion, T5 Cicatriz). IDs `FAMILIA_T#`. Mantém IDs antigos (`PEITORAL_T1`…); `combatVisuals` depende de `ARCO`/`CAJADO`/`VARINHA` no id.

| família | slot | stats por tier (T1,T2,T3,T4,T5) |
|---|---|---|
| ESPADA | arma | atk 7,15,30,58,110 · def 2,4,8,15,28 |
| MACHADO | arma | atk 9,19,38,74,140 |
| CAJADO | arma | matk 6,14,28,54,104 · mp 10,25,50,95,180 |
| VARINHA (nova) | arma | matk 4,10,20,38,74 · mp 20,45,90,170,320 · crit .02→.06 |
| ARCO | arma | atk 6,14,28,54,104 · hit 0,.02,.03,.04,.05 |
| CAPACETE | capacete | arm 2,5,10,19,36 · hp 10,25,50,95,180 |
| PEITORAL | armadura | arm 4,9,18,34,64 · hp 20,50,100,190,360 |
| LUVAS | luvas | arm 1,3,6,11,20 · atk 1,2,4,8,15 |
| CALCAS | calças | arm 3,7,14,26,48 · hp 15,35,70,130,250 |
| BOTAS | botas | arm 2,4,8,15,28 · spd .05,.06,.07,.08,.10 |
| COLAR | colar | hp 10,25,50,95,180 · mp 5,15,30,60,110 |
| ANEL | anel | hp 5,12,24,45,85 · atk 1,3,6,11,21 · matk idem |
| ESCUDO | off-hand | def 2,5,10,19,36 · arm 1,3,6,11,20 · blk .05→.10 |

Nomes por tier (sugestão): Espada *Aprendiz / Aço-Estrela / Sabre de Coral Negro / Real de Asterion / Lâmina da Cicatriz* — seguir o tema de cada zona nas demais famílias.

**Raridade** multiplica stats: Comum 1.0 · Incomum 1.3 · Raro 1.7 · Épico 2.2 · Lendário 3.0. Roll: 1% / 4% / 10% / 25% / 60%; `rollRarity(bonus)` divide o sorteio por `1+bonus`.
**Afixos** (RARO=1, ÉPICO=2, LENDÁRIO=3), pool por categoria; valor = `base + perTier·(tier−1)·(0.8–1.2)`: arma (atk, matk, crit, hit, spd) · armadura (hp, arm, dge, resFisico, resMagico) · joia (hp, mp, atk, matk, crit) · escudo (arm, blk, resMagico, hp). Mostrar afixos no tooltip.
**Poções** `POCAO_VIDA_1..5`: cura 60/200/500/1200/3000 · preço 30/110/320/900/2600 · empilha 50 · venda 40%.
**Únicos de chefe** (sempre lendários, com efeito): Brasa Eterna (anel, +10% XP) · Coração de Granito (colar, −8% dano físico) · Escama do Leviatã (escudo, +15% ouro, bloqueio) · Olho de Asterion (capacete, +15% raridade, +5% drops, crit) · Presa do Devorador (espada, roubo de vida 6%). Campos novos no `Item`: `goldBonus?`, `lifesteal?`.
**Mochilas**: Normal 50 · Old 60 (drop) · Couro 70 (400g) · Reforçada 80, +3% drop/+3% XP (3.500g) · Explorador 90, +6%/+4%/+4% (18.000g) · Arcana 100, +10% drop/+8% raridade/+6% XP (90.000g).
**Venda** = `{5,20,70,220,700}[tier] × {1,2,5,12,40}[raridade] × (1+0,25·afixos)`; componente 8g. **Compra** de equip comum = `base[tier]×8`; poção/mochila conforme acima; estoque liberado por nível `{1,11,26,46,71}`.

---

## 5. Funções novas — combate e habilidades (implementar o "sem estado")

Hoje o combate é só `atk − arm` e as habilidades da raça são só visuais. Proposta:

- **Dano**: `max(⌈10% atk⌉, atk − arm)`; `hit` = chance de acertar; `crit` = ×1.5; `spd` = chance de ataque extra; inimigo: `max(⌈10% atk⌉, atk − (arm + def/2))`, `dge` esquiva, `blk` reduz 50%, `resFisico/resMagico` (conforme `damageType`).
- **Vida persistente do alvo**, **regen 1,5%/tick**, **+10% no abate**, **poção automática** (`autoPotion` = % de HP; escolhe a menor poção que cobre o HP faltante).
- **Golpe de habilidade** da raça a cada 3 ticks (`dano = (0,6·atk + 0,9·matk)·mult`, ignora `pierce` da armadura). mult/pierce: A1 1.6/0 · A2 1.5/.2 · A3 1.8/.5 · A4 1.7/.4 · A5 1.6/.3 · A6 1.7/.35 · A7 1.6/.2 · A8 1.8/.2 · A9 2.0/0 · A10 1.7/.3 · A11 1.9/.4 · A12 2.0/.8 · A13 2.1/.5 · A14 1.8/.3 (+40% roubo) · A15 2.6/.6.
- **Suportes** (gatilho = `tick % cd`, buff = `tick % cd < dur`): S1 cura 12%/5t · S2 +15% atk/arm (3 de 6t) · S3 cura 10%/6t · S4 −35% dano (2 de 6t) · S5 ataque duplo/4t · S6 ignora 30% arm (3 de 5t) · S7 +25% arm (3 de 5t) · S8 esquiva 1 ataque/4t · S9 −10% dano · S10 +8% crit +5% hit · S11 +10% atk/arm · S12 roubo de vida 8% · S13 +40% dano em alvo <40% HP.
- **Passivas** (permanentes): P1 +25% cura · P2 +10% arm +3 def · P3 res mágica +8%/física +4% · P4 +10% spd · P5 +20% cura +5% HP · P6 +6% esquiva · P7 +25% dano de habilidade · P8 recarga −1 tick · P9 +8% crit · P10 +10% XP · P11 +15% raridade · P12 +15% ouro.
- **Ideias extras** (ainda não feitas): usar **MP** (habilidade consome mana), **Elementos** (`Element` existe no tipo e não é usado: fraqueza/resistência dos monstros FOGO/GELO/TROVAO/TERRA/SAGRADO/SOMBRIO), **estados** (veneno, sangramento, lentidão — as descrições das skills já citam), **Leis** (13 `Law`: bônus de sinergia quando afixos/itens combinam com a lei da raça), mecânicas de chefe (fase de fúria <30% HP, imunidade temporária).

---

## 6. Funções novas — sistemas de jogo

### 6.1 Missões (nova aba)
Tipos: `KILL` (id do inimigo ou `ANY`) · `KILL_BOSS` · `COLLECT` (templateId obtido via drop **após aceitar**) · `REACH_LEVEL` · `EARN_GOLD` · `SYNTHESIZE` · `SELL`.
Estrutura: `QuestTemplate {id, name, description, giver, category: HISTORIA|CACA|COLETA|DESAFIO|REPETIVEL, zoneId?, minLevel, requires?[], objectives[], rewards{gold,xp,items[]}, repeatable?}`; `Character.quests = {active: Record<id,{progress[]}>, completed: string[]}`.
Fluxo: disponível (nível + pré-requisitos) → **Aceitar** (máx. 8 ativas) → progresso automático por `TickResult` (`killed`, `bossKills`, `dropCounts`, `gold`) → **Resgatar** (checa espaço na bolsa; `BACKPACK:OLD` entrega mochila) → move para `completed` (repetíveis voltam a ficar disponíveis).
Conteúdo planejado (~44): por zona uma **cadeia** de 5 missões + 1 **chefe**, ex.: Lyss: *Primeiros Passos (5 Lobos) → Praga de Vespas → Raízes Famintas (10 Espinheiros + 2 A7) → Olhos no Céu → Caçada ao Javali → O Espectro de Brasa*; Dhor: Golens, Ursos, Bandidos (+A6), Coração de Gelo (3 A11), Yeti, Colosso; Azhar: Caranguejos, Serpentes, Medusas (+A13), Sereias, Polvos, Leviatã; Asterion: Hienas, Sentinelas, Escorpiões, Cultistas, Guardião; Cicatriz: Crias, Vermes, Aberrações, Sombras, Devorador. **Gerais**: Despertar da Matriz (sintetizar), Primeiro Comerciante (vender 5), marcos de nível 10/25/50/75/100, ouro acumulado. **5 repetíveis** "Patrulha" (40 abates em qualquer monstro da zona). Recompensa ≈ ouro/XP proporcionais à zona + peça de equipamento (raro/épico nas de chefe) + poções + mochila nos chefes.
NPCs de missão: Guardiã Mirelle, Caçador Brann, Mestre-Mineiro Orvel, Capitã Yrsa, Pescadora Nalu, Capitão Doran, Arqueóloga Vesna, Alquimista Kesh, Vigia Ysolde, Cartógrafo Zael, Anciã Seraphine, Mercador Bolk.

### 6.2 Mercador / economia (nova aba)
Comprar (poções, equipamento comum por tier liberado, mochilas) · Vender (por item e **vender tudo até raridade X**, lendários protegidos) · **auto-venda** configurável (`autoSell`: vende sozinho drops até a raridade escolhida) · config de **poção automática** (`autoPotion`).
Futuro: loja rotativa diária, recompra do último item vendido, **sinks de ouro** (reroll de afixos, refino +1…+10, desmanchar item em materiais).

### 6.3 Casa do jogador (roadmap 8.4)
Baú (armazenamento fora da bolsa) · Cama (↑ regeneração e **bônus de progresso offline**) · mural de missões · bancada de crafting.

### 6.4 Prestígio / Ascensão (roadmap 8.6)
No nível 100: reseta para 1 com multiplicador permanente de XP/ouro/drop (+X% por ascensão), mantém raças e parte do baú; skins/títulos.

### 6.5 Outras ideias
- **Relatório offline** (modal ao voltar: tempo, abates, XP, ouro, drops raros, poções usadas, mortes).
- **Bestiário** (abates por monstro, drops descobertos, marcos com recompensa) e **Conquistas**.
- **Crafting**: `category: "MATERIAL"` já existe no tipo e não é usada; materiais dropados desmanchando itens; Passiva P12 "Forja" ganha função real.
- **Raças**: completar 33 nomeadas; tier `ASCENDIDA` (evolução de raça com materiais/missão); matriz com **reroll**; Híbridos com nome gerado + bônus escalonado.
- **Torre/Endless**: andares infinitos com chefes a cada 10 e ranking local.
- **Eventos temporais** (chefe mundial semanal, drop em dobro no fim de semana), login diário.
- **Tutorial/onboarding** (3–4 passos: equipar, matriz, missão, mercador) e criação de personagem com escolha de estilo (guerreiro/arqueiro/mago) para arma inicial.
- **Múltiplos personagens**/slots de save. **Online (MMO)**: contas + save na nuvem, ranking, chat global, mercado entre jogadores — só depois de estabilizar o single-player (backend + validação no servidor contra trapaça).

---

## 7. Balanceamento: método (reaproveite)

Como os números da seção 3 foram obtidos — **recomendo manter um simulador em Node** que compile `engine/ data/ types/` e rode `processTick` N vezes para um jogador (nível, tier de equipamento Incomum, com/sem raça) contra cada monstro, medindo: **ticks para matar (ttk)**, **mortes por 1.000 ticks**, **HP médio**, **abates por nível**.
Fórmulas de partida (para um monstro "padrão" no ponto de referência Lref/Tref; `P` = jogador de referência):
`HP_ef = 3,5 × 0,72 × P.atk × f_hp` · `ARM_ef = 0,22 × P.atk × f_arm` · `ATK_ef = (P.arm + P.def/2 + 0,038 × P.hpMax) × f_atk` · `XP_ef = xpToNext(Lref) / KPL[zona]` · base = efetivo ÷ estrelas.
`KPL` (abates por nível) por zona: **8, 10, 14, 20, 28**. Ouro efetivo por abate: **18, 100, 330, 850, 2600**. Chefes: HP ×3,2–3,6, XP ×5, ouro ×6.
Metas: monstro comum **ttk ≈ 3–4**, sustentável (HP médio >90% com raça); **chefe ttk 15–18 sem raça / 6–8 com raça**, letal sem poção; Verme-Abissal/Leviatã etc. nunca devem dar "ttk infinito".
Curva de XP: `xpToNext(L) = 100·1,2^(L−1)` até 25; depois `7950·(L/25)^3`.
Poder de referência do jogador (Incomum, sem raça): nv10/T1 hp 364 atk 41 arm 22 · nv25/T2 hp 786 atk 87 arm 54 · nv45/T3 hp 1393 atk 157 arm 104 · nv70/T4 hp 2260 atk 262 arm 186 · nv100/T5 hp 3562 atk 425 arm 331.

---

## 8. Visual, áudio e UX (foco atual do projeto)

- **Sprite sheets**: animação de ataque só quando atacar (`background-position`/`steps()`), idle/run/attack/hurt separados; hoje GIF em loop ataca andando.
- **Cenários reais** por tema (`forest/mountain/ocean/ruins/abyss`) com parallax em 2–3 camadas; sprites reais de monstros em `public/assets/monsters/{id}.png` (campo `sprite` já suportado, com fallback para emoji).
- **VFX por elemento** (projétil + impacto + partículas) usando `getSpellEffect(ataqueId)`; números de dano reais (crítico maior/amarelo, esquiva "MISS", cura verde).
- **Áudio**: gerenciador único (música por zona com crossfade, SFX: golpe, crítico, level up, drop lendário, abate de chefe, compra/venda), volume master/música/efeitos + mudo persistidos; respeitar autoplay do navegador (iniciar após 1º clique); `settings.soundEnabled` já existe no `SaveFile`.
- **UI**: tooltip de item com stats/afixos **comparando com o equipado** (verde/vermelho), ordenação e busca no inventário, filtros por raridade, "vender tudo", atalhos de teclado, alerta de bolsa cheia, ícones SVG no lugar de emojis, layout mobile/PWA, painel de atributos completo (crit, hit, esquiva, bloqueio, resistências, bônus de XP/ouro/drop), barra de progresso das missões ativas fixa na arena, seletor de alvo com ícone de chefe 👑 e cadeado de nível.
- Acessibilidade/performance: respeitar `prefers-reduced-motion`; não recriar `setInterval` (já há guard); evitar `JSON.parse(JSON.stringify())` em todo equip — usar `structuredClone`.

---

## 9. Ordem sugerida de execução

1. **Correções** (seção 1) + `tsconfig` + Modo Teste + migração de save.
2. **Conteúdo**: componentes A11–A15/S10–S13, itens T1–T5 (famílias), poções, mochilas, monstros novos (seção 3).
3. **Motor**: vida persistente, crit/hit/esquiva/bloqueio, regen, poção automática, skills reais (seção 5).
4. **Mercador + auto-venda**, depois **Missões**.
5. Relatório offline, bestiário, tooltips comparativos.
6. Visual/áudio (sprite sheets, cenários, VFX, SFX).
7. Casa, prestígio, crafting, raças ascendidas, torre/eventos.
8. Só então: backend/online.

---

## 10. Prompt pronto para a outra IA

> Você vai evoluir o jogo **Mythreon Online** (React+TS+Vite+Zustand+Tailwind). Leia este `.md` inteiro e o código atual. Trabalhe **em etapas** na ordem da seção 9; ao fim de cada etapa: rode `tsc --noEmit`, descreva o que mudou em até 10 linhas e liste arquivos alterados. Antes de aplicar cada item, confirme no código se já foi feito. Mantenha saves antigos funcionando (campos novos opcionais + `ensureCharacterDefaults`). Não apague o que já funciona (música, imagens, animações atuais). Balanceie com um simulador em Node conforme a seção 7 e me mostre a tabela de resultados antes de fechar o conteúdo.
