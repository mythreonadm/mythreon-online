import {randomUUID} from 'node:crypto';
import type {Character,Item} from '../src/types';
import {ONLINE_RULES,transferFee} from '../src/online/rules';
export interface Offer {gold:number;mythreonCoins:number;items:Item[];fee:number;}
export interface ItemSelection {uid:string;quantity:number;}
export const emptyOffer=():Offer=>({gold:0,mythreonCoins:0,items:[],fee:0});
export function integer(value:unknown,min=0,max=Number.MAX_SAFE_INTEGER):number {if(typeof value!=='number'||!Number.isSafeInteger(value)||value<min||value>max)throw Error('Quantidade ou valor inválido.');return value;}
export function canTransfer(c:Character){if(c.level<ONLINE_RULES.minTransferLevel||!c.tutorialCompleted)throw Error('Conclua a iniciação e alcance o nível '+ONLINE_RULES.minTransferLevel+' para transferir gold e itens.');}
export function restoreOffer(c:Character,offer:Offer){c.gold+=offer.gold+offer.fee;c.mythreonCoins=(c.mythreonCoins??0)+(offer.mythreonCoins??0);c.depot.push(...offer.items.map(i=>({...i})));}
export function reserveOffer(c:Character,value:unknown):Offer {
 if(!value||typeof value!=='object')throw Error('Oferta inválida.');const raw=value as any;const gold=integer(raw.gold??0);const mythreonCoins=integer(raw.mythreonCoins??0);const selection=raw.items??[];
 if(!Array.isArray(selection)||selection.length>ONLINE_RULES.maxTradeItems)throw Error('Selecione até dez itens.');
 const ids=new Set<string>();const items:Item[]=[];
 for(const part of selection){if(typeof part.uid!=='string'||ids.has(part.uid))throw Error('Item repetido ou inválido.');ids.add(part.uid);const qty=integer(part.quantity,1,999);const source=c.inventory.items.find(i=>i.uid===part.uid)??c.depot.find(i=>i.uid===part.uid);if(!source||qty>source.quantity||(!source.stackable&&qty!==1))throw Error('Item indisponível ou quantidade insuficiente.');if(source.templateId==='UNICO_SIGILO_INICIACAO')throw Error('A relíquia de iniciação é vinculada ao personagem.');items.push({...structuredClone(source),uid:randomUUID(),quantity:qty});}
 const fee=transferFee(gold);if(c.gold<gold+fee)throw Error('Gold insuficiente para a oferta e a taxa.');if((c.mythreonCoins??0)<mythreonCoins)throw Error('Mythreon Coins insuficientes para a oferta.');
 c.gold-=gold+fee;c.mythreonCoins=(c.mythreonCoins??0)-mythreonCoins;
 for(const part of selection){for(const location of [c.inventory.items,c.depot]){const idx=location.findIndex(i=>i.uid===part.uid);if(idx<0)continue;if(location[idx].quantity===part.quantity)location.splice(idx,1);else location[idx].quantity-=part.quantity;break;}}
 return {gold,mythreonCoins,items,fee};
}
export function receiveOffer(c:Character,offer:Offer){if(c.depot.length+offer.items.length>c.depotMax)throw Error('Libere espaço no depósito antes de receber os anexos ou concluir a troca.');c.gold+=offer.gold;c.mythreonCoins=(c.mythreonCoins??0)+(offer.mythreonCoins??0);c.depot.push(...offer.items.map(i=>({...i,uid:randomUUID()})));}
