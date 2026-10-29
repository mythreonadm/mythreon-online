// ... (Imports no topo)
import { upgradeItemLevel, rerollItemAffixes } from "../engine/forge";

// Adicione na interface GameState:
  upgradeItem: (uid: string) => { success: boolean; error?: string };
  rerollItem: (uid: string) => { success: boolean; error?: string };

// Adicione a implementação no create:
  upgradeItem: (uid) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = upgradeItemLevel(newCharacter, uid);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
  },

  rerollItem: (uid) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = rerollItemAffixes(newCharacter, uid);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
  },