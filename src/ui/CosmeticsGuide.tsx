import React from "react";
import { COSMETIC_DEFINITIONS, COSMETIC_SLOTS } from "../data/cosmetics";
import { ALL_ITEM_TEMPLATES } from "../data/items";
import { MYTHREON_OFFERS } from "../data/mythreonEconomy";
import { ItemIcon } from "./ItemIcon";

export function CosmeticsGuide() {
  return <section className="space-y-4 text-sm text-slate-300">
    <h2 className="text-2xl font-bold text-arcane-gold">Sua presença na Essência</h2>
    <p>Cosméticos personalizam seu aventureiro sem mudar atributos, Gear Score, dano, defesa, velocidade, XP ou drops. Configure os quatro espaços em Personagem → Personalização → Guarda-roupa da Essência.</p>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{Object.entries(COSMETIC_DEFINITIONS).map(([id, definition]) => {
      const offer = MYTHREON_OFFERS.find(entry => entry.templateId === id);
      return <article key={id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4"><ItemIcon item={ALL_ITEM_TEMPLATES[id]} className="block h-12 w-12 shrink-0 text-lg" /><div className="min-w-0"><h3 className="font-bold text-white">{definition.label}</h3><p className="mt-1 text-xs text-slate-400">{COSMETIC_SLOTS.find(slot => slot.key === definition.slot)?.label}</p><p className="mt-2 text-xs">{offer ? `Loja Mythreon · ${offer.priceCoins} Coins` : "Conquista do calendário mensal anunciado"}</p></div></article>;
    })}</div>
    <p>A skin completa aparece na forma humana. Sua Matriz conserva a transformação e pode receber a luminescência própria. Se uma arte de skin ainda não estiver disponível, o jogo mantém a aparência humana de base e seu brilho cosmético.</p>
    <p>A aura do Pet aparece no companheiro durante a caça. O addon do Boss aparece na arena cooperativa e na prévia do guarda-roupa. Você pode remover cada efeito sem descartar o item nem desligar os outros espaços.</p>
    <p>Itens cosméticos podem ficar na mochila ou no depósito. Se você vender, enviar ou anunciar o último exemplar, o visual físico deixa de estar disponível. Ao cancelar um anúncio e receber o item de volta, equipe-o novamente. Skins conquistadas no calendário ficam registradas permanentemente no personagem, independentemente da bolsa.</p>
    <p>As opções de aparência de base continuam salvas. Remover a skin completa revela novamente as cores que você escolheu para seu humano.</p>
  </section>;
}
