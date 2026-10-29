// Adicione o import da nova função no topo:
import { findNamedRace, generateRaceName, generateRaceId, generateRaceBonus } from "../data/races";

// Dentro do create(), substitua a função synthesize:
  synthesize: (a, s, p) => {
    const { character, races } = get(); 
    if (!character) return { success: false, error: "Sem personagem" };
    
    const namedRace = findNamedRace(a, s, p);
    const raceId = namedRace ? namedRace.id : generateRaceId(a, s, p);
    
    const alreadyExists = races.find(r => r.id === raceId);
    if (alreadyExists) {
      return { success: false, error: `Você já descobriu "${alreadyExists.name}"! Escolha uma combinação diferente.` };
    }
    
    const newCharacter = JSON.parse(JSON.stringify(character));
    const hasA = newCharacter.inventory.items.find((i: any) => i.componentType === "ATAQUE" && i.templateId === a);
    const hasS = newCharacter.inventory.items.find((i: any) => i.componentType === "SUPORTE" && i.templateId === s);
    const hasP = newCharacter.inventory.items.find((i: any) => i.componentType === "PASSIVA" && i.templateId === p);
    
    if (!hasA || !hasS || !hasP) return { success: false, error: "Faltam componentes no inventário." };
    
    removeItem(newCharacter.inventory, hasA.uid, 1);
    removeItem(newCharacter.inventory, hasS.uid, 1);
    removeItem(newCharacter.inventory, hasP.uid, 1);
    
    let newRace: Race;
    if (namedRace) {
      newRace = { ...namedRace };
    } else {
      newRace = {
        id: raceId,
        name: generateRaceName(a, s, p),
        tier: "COMUM",
        ataqueId: a, suporteId: s, passivaId: p,
        skills: { ataque: "Ataque Sintetizado", suporte: "Suporte Sintetizado", passiva: "Passiva Sintetizada" },
        bonus: generateRaceBonus(a, s, p), // USA A NOVA FÓRMULA AQUI
      };
    }
    
    const newRaces = [...races, newRace];
    trackRaceDiscovery(newCharacter, newRaces);
    
    set({ character: newCharacter, races: newRaces }); 
    get().save(); 
    return { success: true };
  },