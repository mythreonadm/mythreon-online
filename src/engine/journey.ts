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
 // Contas antigas podem ter chegado ao jogo antes da introdução obrigatória
 // existir. Nelas, o campo introSeen ficou falso mesmo depois de dezenas de
 // níveis; não podemos transformar esse marcador histórico em um bloqueio de
 // caça permanente.
 if (!c.introSeen) return c.level > 1 || c.quests.completed.length > 0;
 // Saves antigos podem ficar entre duas etapas, sem missão ativa e sem a
 // marca final do tutorial. A caça não pode ficar travada nesse estado. Com a
 // introdução já vista, a missão continua sendo uma orientação, nunca um
 // bloqueio do loop principal de combate.
 return true;
}

/**
 * Repara o marcador de introdução de uma conta antiga sem remover missões,
 * itens ou progresso. Chamado ao iniciar uma caça; contas novas (nível 1)
 * continuam vendo o tutorial normalmente.
 */
export function repairLegacyJourney(c: Character): boolean {
 if (!isGuided(c) || c.level <= 1) return false;
 const activeTutorial = ['TUT_1','TUT_POTIONS','TUT_3','TUT_TRAIN','TUT_SELL'].some(id => !!c.quests.active[id]);
 if (activeTutorial) return false;
 const changed = !c.introSeen || !c.tutorialCompleted;
 if (changed) {
  c.introSeen = true;
  c.tutorialCompleted = true;
 }
 return changed;
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
