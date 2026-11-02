import type { Rarity } from '../types';
export const RARITY_FRAME: Record<Rarity,string> = {
 COMUM:'rarity-frame rarity-comum', INCOMUM:'rarity-frame rarity-incomum', RARO:'rarity-frame rarity-raro', EPICO:'rarity-frame rarity-epico', LENDARIO:'rarity-frame rarity-lendario'
};
export function rarityArtClass(rarity?:Rarity) { return 'rarity-art rarity-' + (rarity ?? 'COMUM').toLowerCase(); }
