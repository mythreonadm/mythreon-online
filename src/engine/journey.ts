import type { Character } from '../types';
import { JOURNEY_CHAPTERS } from '../data/worldJourney';
import { countByTemplate, removeItem } from './inventory';
export function isGuided(c: Character) { return c.journeyVersion === 1 && !c.tutorialCompleted; }
export function canUseTab(c: Character, tab: string): boolean {
 if(tab === "online" || tab === "ranking")return true;
 if(tab === "boss" || tab === "profissoes" || tab === "cards" || tab === "calendario")return !isGuided(c);
 if (!isGuided(c)) return true;
 if (!c.introSeen) return tab === 'missoes';
 const done = c.quests.completed;
 const stages: Record<string,string> = {zona:'TUT_WIKI',matriz:'TUT_1',personagem:'TUT_2',backpack:'TUT_2',depot:'TUT_1',loja:'TUT_3',pets:'TUT_SELL',fazenda:'TUT_SELL',shop:'TUT_SELL',laboratorio:'TUT_TRAIN'};
 if (tab === 'missoes' || tab === 'wiki') return true;
 return !!stages[tab] && done.includes(stages[tab]);
}
export function canEnterZone(c: Character, id: string) {
 return id === 'BOSQUE_LYSS' || !!c.unlockedZoneIds?.includes(id);
}
export function canTutorialHunt(c: Character) {
 if (!isGuided(c)) return true;
 if (!c.introSeen) return false;
 return ['TUT_1','TUT_POTIONS','TUT_3'].some(id => !!c.quests.active[id]);
}
/** Call only on a cloned character; every condition is checked before any resource is consumed. */
export function unlockJourneyZone(c: Character, id: string): {success:boolean;error?:string} {
 const chapter = JOURNEY_CHAPTERS.find(x=>x.id===id), pass=chapter?.pass;
 if (!pass) return {success:false,error:'Passagem inválida.'};
 if (canEnterZone(c,id)) return {success:false,error:'Passagem já liberada.'};
 if (isGuided(c) || c.level < pass.level || !c.quests.completed.includes(pass.requires) || !c.quests.active[pass.questId]) return {success:false,error:'Aceite a missão de travessia e conclua os pré-requisitos.'};
 if (c.gold < pass.gold || pass.items.some(i=>countByTemplate(c.inventory,i.id)<i.count)) return {success:false,error:'Gold ou materiais insuficientes na mochila.'};
 c.gold -= pass.gold;
 for(const requirement of pass.items) {
  let remaining=requirement.count;
  for(const item of [...c.inventory.items].filter(i=>i.templateId===requirement.id)) {
   const take=Math.min(item.quantity,remaining); if(take>0) removeItem(c.inventory,item.uid,take); remaining-=take;
  }
 }
 c.unlockedZoneIds=[...new Set([...(c.unlockedZoneIds??['BOSQUE_LYSS']),id])];
 delete c.quests.active[pass.questId]; c.quests.completed.push(pass.questId);
 return {success:true};
}
