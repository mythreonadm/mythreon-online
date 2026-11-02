import type { Character, QuestTemplate } from "../types";
import { QUESTS } from "../data/quests";
import { checkQuestCompletion } from "../engine/questEngine";

export function getAvailableQuests(character: Character): QuestTemplate[] {
  const active = character.quests?.active || {};
  const completed = new Set(character.quests?.completed || []);

  return QUESTS.filter((quest) =>
    (quest.category !== 'TUTORIAL' || !character.tutorialCompleted) &&
    (character.tutorialCompleted || quest.category === 'TUTORIAL') &&
    (quest.category !== 'COMPENDIO' || !!active[quest.id]) &&
    !active[quest.id] &&
    !completed.has(quest.id) &&
    character.level >= quest.minLevel &&
    (!quest.requires || quest.requires.every((requiredId) => (completed.has(requiredId) || (requiredId === "TUT_BACKPACK" && !!character.tutorialCompleted))))
  );
}

export function getTutorialQuestSignal(character: Character): { type: "accept" | "claim"; quest: QuestTemplate } | null {
  if (character.tutorialCompleted) return null;
  const active = character.quests?.active || {};
  const claimable = QUESTS.find(quest => quest.category === "TUTORIAL" && active[quest.id] && checkQuestCompletion(character, quest.id));
  if (claimable) return { type: "claim", quest: claimable };
  if (Object.keys(active).some(id => QUESTS.some(q => q.id === id && q.category === "TUTORIAL"))) return null;
  const available = getAvailableQuests(character).find(quest => quest.category === "TUTORIAL");
  return available ? { type: "accept", quest: available } : null;
}

export function getHuntQuestSignal(character: Character, zoneId: string): { type: "accept" | "claim"; quest: QuestTemplate } | null {
  const active = character.quests?.active || {};
  const claimable = QUESTS.find((quest) => active[quest.id] && (!quest.zoneId || quest.zoneId === zoneId) && checkQuestCompletion(character, quest.id));
  if (claimable) return { type: "claim", quest: claimable };

  const available = getAvailableQuests(character).find((quest) => !quest.zoneId || quest.zoneId === zoneId);
  return available ? { type: "accept", quest: available } : null;
}
