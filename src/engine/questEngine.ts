import { Character, Race, TickResult } from "../types";
import { QUESTS } from "../data/quests";
import { addItem } from "./inventory";

export function updateQuestProgress(char: Character, result: TickResult) {
  if (!char.quests || !char.quests.active) return;

  const activeQuests = Object.keys(char.quests.active);
  for (const questId of activeQuests) {
    const template = QUESTS.find(q => q.id === questId);
    if (!template) continue;
    if (template.category === "COMPENDIO") continue;

    const progress = char.quests.active[questId].progress;

    template.objectives.forEach((obj, index) => {
      if (obj.type === "KILL" && result.killed) {
        if (obj.target === "ANY") {
          const totalKills = Object.values(result.killed).reduce((a, b) => a + b, 0);
          progress[index] = (progress[index] || 0) + totalKills;
        } else if (result.killed[obj.target]) {
          progress[index] = (progress[index] || 0) + result.killed[obj.target];
        }
      }
      if (obj.type === "KILL_BOSS" && result.bossKills) {
        if (obj.target === "ANY") {
          const total = Object.values(result.bossKills).reduce((a,b)=>a+b, 0);
          progress[index] = (progress[index] || 0) + total;
        } else if (result.bossKills[obj.target]) {
          progress[index] = (progress[index] || 0) + result.bossKills[obj.target];
        }
      }
      if (obj.type === "COLLECT" && result.dropCounts && obj.target) {
        if (result.dropCounts[obj.target]) {
          progress[index] = (progress[index] || 0) + result.dropCounts[obj.target];
        }
      }
      if (obj.type === "EARN_GOLD") progress[index] = (progress[index] || 0) + result.gold;
      if (obj.type === "SALVAGE" && result.salvagedItems) progress[index] = (progress[index] || 0) + result.salvagedItems;
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// TRACKING DO COMPÊNDIO (Nomeadas + Total)
// ═══════════════════════════════════════════════════════════════
export function trackRaceDiscovery(char: Character, races: Race[]) {
  // Proteção: garantir que quests existem
  if (!char.quests) char.quests = { active: {}, completed: [] };
  if (!char.quests.active) char.quests.active = {};
  if (!char.quests.completed) char.quests.completed = [];

  const totalRaces = races.length;
  const namedRaces = races.filter(r => r.tier === "NOMEADA").length;

  // AUTO-ACEITA todas as quests de COMPENDIO que ainda não estão ativas nem completas
  QUESTS.filter(q => q.category === "COMPENDIO").forEach(q => {
    if (!char.quests.active[q.id] && !char.quests.completed.includes(q.id)) {
      char.quests.active[q.id] = { progress: [0] };
    }
  });

  // Atualiza o progresso de TODAS as quests ativas de compêndio
  Object.keys(char.quests.active).forEach(questId => {
    const template = QUESTS.find(q => q.id === questId);
    if (!template || template.category !== "COMPENDIO") return;

    template.objectives.forEach((obj, idx) => {
      if (obj.type === "DISCOVER_TOTAL") {
        char.quests.active[questId].progress[idx] = totalRaces;
      }
      if (obj.type === "DISCOVER_NAMED") {
        char.quests.active[questId].progress[idx] = namedRaces;
      }
    });
  });
}

export function checkQuestCompletion(char: Character, questId: string): boolean {
  const template = QUESTS.find(q => q.id === questId);
  const progress = char.quests.active[questId]?.progress;
  if (!template || !progress) return false;
  return template.objectives.every((obj, idx) => (progress[idx] || 0) >= obj.count);
}

export function claimQuestReward(char: Character, questId: string): { success: boolean, msg: string } {
  const template = QUESTS.find(q => q.id === questId);
  if (!template || !checkQuestCompletion(char, questId)) return { success: false, msg: "Missão incompleta" };

  if (template.rewards.gold) char.gold += template.rewards.gold;
  if (template.rewards.xp) char.xp += template.rewards.xp;
  
  if (template.rewards.items) {
    for (const itemReward of template.rewards.items) {
       addItem(char.inventory, { 
         uid: Math.random().toString(), templateId: itemReward.templateId, name: "Recompensa", 
         category: "ARMA", tier: 1, rarity: itemReward.rarity || "COMUM", stats: {}, affixes: [], 
         stackable: false, maxStack: 1, quantity: itemReward.quantity || 1, icon: "🎁" 
       } as any);
    }
  }

  delete char.quests.active[questId];
  if (!template.repeatable) {
     char.quests.completed.push(questId);
  }

  return { success: true, msg: `Recompensas resgatadas com sucesso!` };
}