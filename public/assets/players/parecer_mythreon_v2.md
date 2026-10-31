# Parecer Mythreon v2 (substitui o anterior)

> Lidos: `combat`, `gameStore`, `save`, `zones`, `config`, `stats`, `drops`, `forge`, `inventory`, `questEngine`, `salvage`, `shop`, `synthesis`, `cards`.
> **Não vi:** `data/items.ts`, `data/skills.ts`, `data/affixes.ts`, `data/quests.ts`, UI. Itens marcados **[verificar]** dependem deles.
> Balanceamento = simulação minha (esperança matemática, sem equipamento, sem raça, sem skill de ataque), usando as fórmulas reais de `stats.ts` e `combat.ts`.

---

## 0. Retratações
| Antes eu disse | Agora (com `stats.ts`) |
|---|---|
| "Parede no nível 11 (T1→T2)" | **Errado.** Skills começam em 10 (+30 atk, +20 arm), então T1 e T2 são fáceis. A parede provável está em **L26-28 (T3)** |
| Debug pode estar ligado | `isDebug()` nasce `false` (localStorage `mythreon_debug`). OK. Só rodar `grep -rn setDebug src` e garantir que não há botão de debug visível ao jogador |

---

## 1. Opinião geral
Projeto **grande e coeso para um jogo solo**: 5 zonas, 38 inimigos, matriz de raças, forja (+10 e reroll), desmanche, quests, cartas, vials, bless, offline. Fórmulas simples e legíveis, dados separados do motor.
Os problemas não são de arquitetura. São **bugs de economia/dados**, **um bug que apaga itens**, **stats que não fazem nada** e **ritmo do começo**.

---

## 2. Bugs (ordem de gravidade)

### 🔴 N1. "Desmanchar tudo" APAGA itens (`salvage.ts`)
`salvageAllEquipment` faz `for (const item of char.inventory.items)` e dentro chama `salvageItem`, que faz `splice` no mesmo array. O iterador pula o próximo elemento, e como `keep` só recebe o que foi iterado, **o item pulado some** (equipamento sem fragmento, poção, componente, qualquer coisa).
Teste isolado: lista `[A,B,C,D,E,F]` com D a manter → resultado final sem D.
Correção: iterar sobre cópia (`[...items]`) ou separar em dois passos (decidir `toSalvage`/`keep` primeiro, depois dar os fragmentos).

### 🔴 B1. Offline grátis (`gameStore.ts`) — continua valendo
`lastTick` só é atualizado na caça. `startTraining` (l.191), tick de treino (l.132) e `stopHunting` (l.203) não atualizam. Treinar 3h e clicar caçar = até 8h de caça simulada de graça.

### 🔴 B2. Relatório offline inventado (`gameStore.ts` l.73-76)
`xp = timeAway*10`, `ouro = timeAway*2`, `itens = timeAway/60`. Não vem da simulação e ignora o teto de 8h.

### 🟠 N2. 4 atributos mortos
`stats.ts` calcula `hpRegen`, `mpRegen`, `luck`, `critDmg`, mas **nada os usa**: o crítico é fixo `×1.5` no `combat.ts`, `rollDrops` ignora o personagem (`_char`), e HP/MP só regeneram pelo valor fixo (1,5% por tick). Se `data/affixes.ts` sorteia esses stats, o jogador acha item com afixo que não faz nada **[verificar]**.
Consequência extra: **MP nunca regenera** (só poção ou level-up). A skill de ataque da raça morre quando a mana acaba.

### 🟠 N3. Recompensa de quest em item está quebrada (`questEngine.ts`)
`claimQuestReward` cria um item genérico `name: "Recompensa"`, `category: "ARMA"`, `stats: {}`, sem `slot`. Não equipa e não é o item/poção do `templateId`. Além disso o "desmanchar" o trata como equipamento. **[verificar]** se `quests.ts` tem `rewards.items`. Correção: gerar com `makeEquipment(templateId, rarity)` / `createItem`.

### 🟠 B3. Bless nunca é consumida
Morte só testa `blesses > 0` (combat l.86/l.215), nunca decrementa. Comprar até 5 não muda nada além da primeira.

### 🟠 B4. `activateBuff` sem custo/limite
Empilha +5 min por clique, sem teto. **[verificar UI]**. E o buff é avaliado uma vez com `Date.now()` antes do loop offline, valendo para todos os ticks simulados.

### 🟡 N4. Armadilha `||` em `recalcStats` (`stats.ts`)
`char.mp || mpMax` e `char.hp || hpMax`: se MP chegar a exatamente 0, o `recalcStats` (roda todo tick) **enche a mana**. Mesma coisa com HP 0 ao equipar/usar vial morto. Trocar por `??`.

### 🟡 N5. Curva de XP tem degrau para baixo (`stats.ts`)
Nível 25 pede **21.176 XP**; nível 26 pede **11.472**. Depois de 25 vira mais fácil por alguns níveis (o comentário diz "difícil depois"). Normalizar a fórmula para ser contínua em 25.

### 🟡 N6. Treino sem offline, e curva de skill muito lenta
O ramo de treino não usa `lastTick` (a caça tem catch-up, o treino não). Custo por skill (15 XP/tick, uma skill por vez): **skill 25 ≈ 6 h · 30 ≈ 18 h · 40 ≈ 7 dias**. Na prática trava em ~30.

### 🟡 B5. Save (`save.ts`)
Sem `try/catch` no `setItem`; JSON inválido é descartado e sobrescrito sem backup; `version` ignorada no load. (Corrijo o que disse antes: cartas pesam ~100 bytes, **não são problema de tamanho**.) Salvar 100-300 KB a cada 3 s é aceitável, mas dá para salvar a cada N ticks.

### ⚪ Menores
`alert()` na store (bloqueia aba); bloco de morte duplicado; `buffMultiplier` e `pickPotion` sem uso; `synthesis.ts` parece código morto (a store tem lógica própria de síntese) **[verificar]**; `equipItem` não valida nível mínimo.

---

## 3. Balanceamento (simulação)
Fórmulas reais; jogador no nível mínimo de cada inimigo, **sem equipamento**. "HP líq." = (cura por ciclo − dano) em % do HP máx.

| Zona | skills=10 | skills=25 |
|---|---|---|
| T1 (L1-10) | 1-6 ticks/abate, HP +10%. **Níveis em segundos** | idem |
| T2 (L11-25) | sustentável até L19; negativo a partir de Elemental/Yeti | **sustentável em todos os mobs**; só o Colosso (boss) dói |
| T3 (L26-45) | negativo (−55% a −265%/ciclo) | negativo a partir de Serpente (L28) |
| T4-T5 | impossível sem equipamento (−400% a −24.000%) | idem |

Leitura:
- **Começo instantâneo:** XP/h de 18k-88k contra ~700 XP por nível em T1 → L1→10 em poucos minutos, sem tensão. Se quiser mais sensação de progresso: HP dos mobs de T1 ×2,5 ou bônus de skill menor.
- **Os inimigos crescem ~4-5x por tier; o jogador base cresce linear (+3 atk/nível).** Quem fecha essa conta é o equipamento. **Sem ver `items.ts`/`affixes.ts` não consigo dizer se T3+ é jogável.** Se os itens de T3 não derem ~3-4x de ataque/armadura, o jogo trava em **L26-28**.
- Chefes (Colosso, Leviatã, Guardião, Devorador) são picos reais de dificuldade: bom, é o que dá meta. Bem desenhados.
- Cartas: 3% por abate em T1 = ~36 cartas/hora, e ainda **não têm uso** (batalha não existe). Antes de lançar, defina o que as cartas fazem.

---

## 4. A outra IA, nota final
| Afirmação dela | Veredito |
|---|---|
| Store "Deus" com 1000+ linhas | ❌ 398 linhas, ações finas |
| Sem offline | ❌ existe (com bugs) |
| Save sem versão | ⚠️ tem `version`, migra campos novos |
| Math.random espalhado | ✅ mas é prioridade baixa |
| Combate inline impede reuso | ✅ (é `processTick`, não a store) |
| Slices, Vitest 100%, Supabase | ❌ prematuro |
**Ela não achou nenhum dos bugs reais** (N1, B1, B2, N2, N3 saem do código, não de padrão genérico). Nota 5/10.

---

## 5. Ordem recomendada
1. **N1** (itens sumindo) — antes de qualquer outra coisa.
2. **B1 + B2** (offline correto).
3. **N2** (ligar `critDmg`, `hpRegen`, `mpRegen`, `luck` ou remover dos afixos).
4. **N3, B3, B4** (quest item, bless, buff).
5. **N4, N5** (`??` e curva de XP).
6. Validar T3+ com `items.ts`/`affixes.ts` (me mande).
7. Depois: treino offline, save robusto, extrair funções de `processTick`, cartas.

## 6. Me mande se quiser a validação completa
`data/items.ts` · `data/affixes.ts` · `data/skills.ts` · `data/quests.ts`

## 7. Prompt pronto para outra IA (sem limite de tokens)
```
Projeto Mythreon (React/TS/Zustand). Corrigir sem quebrar saves existentes. Entregar arquivos completos.
1. salvage.ts salvageAllEquipment: NÃO mutar inventory.items durante o for...of (copiar array ou separar toSalvage/keep). Hoje apaga itens.
2. gameStore.ts: character.lastTick = Date.now() em stopHunting, startTraining e no tick de treino. loadFromSave: remover relatório inventado; gerar de processTick(..., true) só se estava caçando.
3. combat.ts + stats.ts: usar critDmg (no lugar do 1.5 fixo), hpRegen, mpRegen (regen por tick) e luck (em rollDrops/rollRarity).
4. questEngine.claimQuestReward: criar o item real a partir do templateId (makeEquipment/createItem), não um item "Recompensa" genérico.
5. combat.ts: consumir 1 bless por morte (decrementar char.blesses).
6. gameStore.activateBuff: custo ou cooldown + teto de acúmulo (ex.: 2h).
7. stats.ts: trocar `char.hp || hpMax` e `char.mp || mpMax` por `??`. Tornar xpToNextLevel contínua em L25→26.
8. save.ts: try/catch no setItem, backup antes de descartar JSON inválido, usar data.version em migrações.
9. Treino: aplicar catch-up offline também ao treino (limite OFFLINE_MAX_HOURS).
```
