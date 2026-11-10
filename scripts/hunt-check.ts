import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { ZONES } from "../src/data/zones";
import { monsterAtlasCell, WAVE_SPRITE_SUFFIXES } from "../src/data/monsterAtlases";
import { processTick } from "../src/engine/combat";
import { huntCooldown, skillManaCost } from "../src/engine/huntPresentation";
import { getWaveEncounter, prepareHuntTarget } from "../src/engine/huntWaves";
import { freshWorld, executeGame } from "../server/game";
import { recalcStats } from "../src/engine/stats";

const zone = ZONES.BOSQUE_LYSS;
const falcon = zone.enemies.find(enemy => enemy.id === "FALCAO")!;
const now = Date.now;
const random = Math.random;
let clock = 1_800_000_000_000;
Date.now = () => clock;
Math.random = () => 0.5;
try {
  const world = freshWorld("Teste da caça", "hunt-fixture");
  const char = world.character;
  char.introSeen = true;
  char.tutorialCompleted = true;
  char.level = 40;
  recalcStats(char);
  char.hp = char.hpMax;
  char.mp = char.mpMax;
  char.lastTick = clock;
  char.baseStats.atk = 10_000;
  char.baseStats.hit = 1;
  prepareHuntTarget(char, zone, falcon);
  for (const [index, suffix] of WAVE_SPRITE_SUFFIXES.entries()) {
    const expectedId = `FALCAO_${suffix}`;
    assert.equal(getWaveEncounter(zone, falcon, index).id, expectedId);
    const result = processTick(char, zone, false);
    const beat = result.huntBeat!;
    assert.equal(beat.enemy.id, expectedId);
    assert.equal(beat.tick, index + 1);
    assert.equal(beat.outcome, "victory");
    assert.equal(beat.enemyHpAfter, 0);
    assert.equal(beat.impacts.reduce((total, hit) => total + hit.hpRemoved, 0), beat.enemyHpBefore);
    assert.equal(result.kills, 1);
    assert.equal(result.huntBeat?.impacts[0].amount, result.damageDealt);
    clock += 3000;
  }
  assert.equal(processTick(char, zone, false).huntBeat?.enemy.id, "FALCAO_W1");

  // Combo, magic and pet resolve on the same confirmed cycle, with separate origins.
  char.tickCount = 7;
  char.activeRace = { id: "matrix", name: "Presa de Lobo", tier: "COMUM", ataqueId: "A1", suporteId: "S1", passivaId: "P1", bonus: {} };
  char.divineBeasts = [{ id: "LYSS_STAG", obtainedAt: clock }];
  char.activeDivineBeastId = "LYSS_STAG";
  char.comboReadyUntil = clock + 12_000;
  char.comboPower = 1.5;
  char.mp = char.mpMax;
  const combined = processTick(char, zone, false);
  const impacts = combined.huntBeat!.impacts;
  assert.deepEqual(impacts.filter(hit => hit.kind === "combo").map(hit => hit.comboHit), [1, 2]);
  assert.deepEqual(impacts.filter(hit => hit.kind === "combo").map(hit => hit.amount), combined.comboHitDamage);
  assert.equal(impacts.find(hit => hit.kind === "spell")?.sourceId, "A1");
  assert.equal(impacts.find(hit => hit.kind === "pet")?.sourceId, "LYSS_STAG");
  assert.equal(combined.kills, 1);
  assert.equal(char.comboCooldownUntil, clock + 15_000);
  assert.equal(huntCooldown(8, 2, 0).remaining, 6000);
  assert.equal(huntCooldown(9, 2, 3000).remaining, 0);
  assert.equal(huntCooldown(8, 4, -50).remaining, 12000);
  assert.equal(skillManaCost(10, 15), 17);

  char.lastTick = clock - 18_000;
  assert.equal(processTick(char, zone, true).huntBeat, undefined, "Caça offline não acumula efeitos visuais");

  const defending = freshWorld("Defesa", "defense-fixture").character;
  defending.level = 40;
  recalcStats(defending);
  defending.hp = defending.hpMax;
  defending.baseStats.atk = 1;
  defending.baseStats.hit = 1;
  defending.baseStats.dge = 0;
  const regionalBoss = zone.enemies.find(enemy => enemy.id === "ESPECTRO")!;
  prepareHuntTarget(defending, zone, regionalBoss);
  const counter = processTick(defending, zone, false);
  const received = counter.huntBeat!.impacts.filter(hit => hit.kind === "counter");
  assert(received.length > 0 && received.every(hit => hit.target === "hero"));
  assert.equal(received.reduce((total, hit) => total + hit.hpRemoved, 0), counter.damageTaken);

  let online = freshWorld("Servidor", "online-hunt");
  online.character.introSeen = true;
  online.character.tutorialCompleted = true;
  online = executeGame(online, "startHunting", [zone.id]).world;
  assert.equal(online.lastTickResult, null);
  clock += 3000;
  online = executeGame(online).world;
  assert.equal(online.lastTickResult?.huntBeat?.zoneId, zone.id);
  assert.equal(online.lastTickResult?.huntBeat?.baseEnemyId, "LOBO");
  assert.equal(online.isTickRunning, true);
  online = executeGame(online, "stopHunting").world;
  const stoppedAt = online.character.tickCount;
  clock += 3000;
  online = executeGame(online).world;
  assert.equal(online.character.tickCount, stoppedAt);
  assert.equal(online.isTickRunning, false);
  online.character.staminaOnline = 0;
  assert.throws(() => executeGame(online, "startHunting", [zone.id]), /stamina online acabou/);
} finally {
  Date.now = now;
  Math.random = random;
}

let sheets = 0;
let portraits = 0;
const withoutSheet = [];
for (const map of Object.values(ZONES)) for (const monster of map.enemies) {
  const ids = monster.isBoss ? [monster.id] : WAVE_SPRITE_SUFFIXES.map(suffix => `${monster.id}_${suffix}`);
  const cells = ids.map(monsterAtlasCell);
  if (!cells[0]) { withoutSheet.push(monster.id); continue; }
  cells.forEach((cell, index) => {
    assert.equal(cell?.index, index);
    assert(existsSync(`imagens/monstros/${cell!.file}.jfif`));
  });
  if (monster.isBoss) portraits++;
  else sheets++;
}
assert.equal(sheets, 38);
assert.equal(portraits, 7);
assert.deepEqual(withoutSheet.sort(), ["GARGULA", "GOLEM_OBSIDIANA", "LOBO"]);
console.log("PASS: cinco variantes, autoria de impactos, combo, recargas, parada online e 45 artes de origem.");
