import React, { useEffect, useState } from "react";
import { CharacterAppearance } from "../types";
import { useGameStore } from "../store/gameStore";
import { AssetImage } from "./AssetImage";
import { appearanceLabel } from "../utils/appearance";
import { calendarUnlockedSkins } from "../data/dailyCalendar";
import { ALL_ITEM_TEMPLATES } from "../data/items";
import { ItemIcon } from "./ItemIcon";
import { HeroArt } from "./HeroArt";
import { COSMETIC_DEFINITIONS, COSMETIC_SLOTS, type CosmeticSlot } from "../data/cosmetics";
import { ownedCosmeticLoadout } from "../engine/cosmeticOwnership";
import { getCosmeticVisual } from "../utils/cosmetics";
import { DIVINE_BEASTS } from "../data/divineBeasts";

const options = {
  body: [["MASCULINO", "Masculino"], ["FEMININO", "Feminino"]],
  skin: [["CLARA", "Clara"], ["MORENA", "Morena"], ["ESCURA", "Escura"], ["AZUL_ESSENCIA", "Azul da Essência"]],
  hair: [["CURTO", "Curto"], ["LONGO", "Longo"], ["TRANCAS", "Tranças"], ["ARCANO", "Arcano"]],
  hairColor: [["NEGRO", "Negro"], ["CASTANHO", "Castanho"], ["RUIVO", "Ruivo"], ["PRATEADO", "Prateado"], ["AZUL", "Azul"]],
  outfit: [["VIAJANTE", "Viajante do Refúgio"], ["GUARDIAO", "Guardião da Cúpula"], ["MISTICO", "Místico do Primeiro Canto"]],
  outfitColor: [["OCRE", "Ocre"], ["AZUL", "Azul"], ["VIOLETA", "Violeta"], ["VERDE", "Verde"]],
} as const;

const defaultAppearance: CharacterAppearance = { body: "MASCULINO", skin: "MORENA", hair: "CURTO", hairColor: "NEGRO", outfit: "VIAJANTE", outfitColor: "OCRE" };


export function CharacterCustomization() {
  const character = useGameStore(state => state.character);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("");
  const [previewForm, setPreviewForm] = useState<"human" | "matrix">("human");
  const [draft, setDraft] = useState<CharacterAppearance>(character?.appearance ?? defaultAppearance);
  useEffect(() => {
    setDraft(useGameStore.getState().character?.appearance ?? defaultAppearance);
    setPreviewForm("human"); setSaved("");
  }, [character?.id]);
  if (!character) return null;
  const set = <K extends keyof CharacterAppearance>(key: K, value: CharacterAppearance[K]) => setDraft(current => ({ ...current, [key]: value }));
  const save = () => { const result = useGameStore.getState().updateAppearance(draft); setSaved(result.success ? "Personalização salva na Essência." : result.error ?? "Não foi possível salvar."); };
  const select = <K extends keyof CharacterAppearance>(key: K, label: string, values: readonly (readonly [string, string])[]) => <label className="text-xs text-gray-300">{label}<select value={draft[key]} onChange={event => set(key, event.target.value as CharacterAppearance[K])} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white">{values.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  const unlockedIds = [...new Set([...calendarUnlockedSkins(character), ...(character.unlockedCosmetics ?? [])])];
  const unlocked = unlockedIds.map(id => ALL_ITEM_TEMPLATES[id] ? ({ ...ALL_ITEM_TEMPLATES[id], uid: "unlocked-" + id }) : null).filter(Boolean) as typeof character.inventory.items;
  const cosmetics = [...new Map([...unlocked, ...character.inventory.items, ...(character.depot ?? []), ...Object.values(character.equipped ?? {})].filter(item => item && COSMETIC_DEFINITIONS[item.templateId]).map(item => [item.templateId, item])).values()];
  const loadout = ownedCosmeticLoadout(character);
  const visual = getCosmeticVisual(loadout);
  const pet = character.activeDivineBeastId ? DIVINE_BEASTS[character.activeDivineBeastId] : undefined;
  const remove = (slot: CosmeticSlot) => {
    const result = useGameStore.getState().unequipCosmetic(slot);
    setSaved(result.success ? "Efeito removido. Seu cosmético continua guardado." : result.error ?? "Não foi possível remover.");
  };
  return <section className="rounded-xl border border-arcane-purple/40 bg-arcane-panel p-4 shadow-lg">
    <button type="button" aria-expanded={open} onClick={() => { setOpen(value => !value); setSaved(""); }} className="flex w-full items-center justify-between gap-3 text-left">
      <span><span className="block text-[10px] font-black uppercase tracking-widest text-arcane-cyan">Identidade do aventureiro</span><strong className="text-lg text-arcane-gold">🎨 Personalização de Personagem</strong></span><span className="text-xl text-gray-400">{open ? "⌃" : "⌄"}</span>
    </button>
    {open ? <div className="mt-4 space-y-5 border-t border-white/10 pt-4">
      <div>
        <h3 className="font-bold text-white">Sua aparência humana</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-400">Estas cores ficam guardadas mesmo quando você usa uma skin completa ou se transforma com uma Matriz.</p>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
          <div className="rounded-xl border border-arcane-gold/25 bg-black/25 p-3 text-center"><HeroArt name="Aparência humana de base" appearance={draft} className="mx-auto h-32 w-24" /><div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-arcane-gold">{appearanceLabel(draft)}</div></div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">{select("body", "Corpo", options.body)}{select("skin", "Pele", options.skin)}{select("hair", "Cabelo", options.hair)}{select("hairColor", "Cor do cabelo", options.hairColor)}{select("outfit", "Roupa", options.outfit)}{select("outfitColor", "Cor da roupa", options.outfitColor)}</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" onClick={save} className="online-button">Salvar aparência</button><button type="button" onClick={() => setDraft(character.appearance ?? defaultAppearance)} className="online-button-secondary">Desfazer cores</button></div>
      </div>
      <div className="rounded-xl border border-arcane-gold/30 bg-arcane-gold/5 p-4">
        <h3 className="font-bold text-arcane-gold">Skins, Auras & Addons da Essência</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-400">Ative uma Luminescência da Matriz para transformá-la em skin permanente. A aura aparece na forma humana, em todas as Matrizes, nas hunts e no Boss Mundial, sem alterar dano, defesa, drops ou poder do Pet.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
            <div className="mb-3 flex justify-center gap-2"><button type="button" aria-pressed={previewForm === "human"} onClick={() => setPreviewForm("human")} className="rounded border border-white/20 px-2 py-1 text-xs text-white">Humano</button><button type="button" disabled={!character.activeRace} aria-pressed={previewForm === "matrix"} onClick={() => setPreviewForm("matrix")} className="rounded border border-white/20 px-2 py-1 text-xs text-white disabled:opacity-40">Matriz atual</button></div>
            <HeroArt name="Prévia dos cosméticos" attackId={previewForm === "matrix" ? character.activeRace?.ataqueId : undefined} appearance={character.appearance} cosmetics={loadout} context="preview" className="mx-auto h-48 w-36" />
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">Addon exibido nesta prévia e no Boss Diário.</p>
            {pet ? <div className={`mt-4 ${visual.petClassName}`}><AssetImage src={pet.sprite} alt={`Prévia do Pet ${pet.name}`} className="mx-auto h-20 w-20 object-contain" /><span className="text-xs text-teal-200">{pet.name} · aura do Pet</span></div> : null}
          </div>
          <div className="min-w-0 space-y-2">
            {COSMETIC_SLOTS.map(slot => {
              const id = loadout[slot.key];
              return <div key={slot.key} data-cosmetic-slot={slot.key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-3"><div className="min-w-0"><span className="block text-[10px] text-slate-400">{slot.label}</span><strong className="text-xs text-white">{id ? COSMETIC_DEFINITIONS[id].label : "Nenhum selecionado"}</strong></div>{id ? <button type="button" onClick={() => remove(slot.key)} className="rounded border border-white/20 px-2 py-1 text-[10px] text-slate-200 hover:border-red-300">Remover</button> : null}</div>;
            })}
          </div>
        </div>
        {cosmetics.length ? <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{cosmetics.map(item => {
          const definition = COSMETIC_DEFINITIONS[item.templateId], active = loadout[definition.slot] === item.templateId;
          return <button type="button" key={item.templateId} data-cosmetic-item={item.templateId} aria-pressed={active} onClick={() => { const action = unlockedIds.includes(item.templateId) ? useGameStore.getState().equipCosmetic(item.templateId) : useGameStore.getState().activateCosmetic(item.templateId); setSaved(action.success ? (unlockedIds.includes(item.templateId) ? `${item.name} equipado visualmente.` : `${item.name} ativado como skin permanente.`) : action.error ?? "Não foi possível ativar."); }} className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left ${active ? "border-arcane-gold bg-arcane-gold/10" : "border-white/10 bg-black/20 hover:border-arcane-cyan"}`}><ItemIcon item={item} className="block h-12 w-12 shrink-0 text-lg" /><span className="min-w-0"><strong className="block text-xs text-white">{item.name}</strong><small className="mt-1 block text-[10px] text-slate-400">{definition.slot === "skinTemplateId" ? "Skin humana" : definition.label} · {active ? "Ativo" : unlockedIds.includes(item.templateId) ? "Clique para equipar" : "Clique para ativar como skin"}{unlockedIds.includes(item.templateId) ? " · propriedade permanente" : ""}</small></span></button>;
        })}</div> : <p className="mt-4 text-xs text-slate-400">Conquiste uma skin no Calendário ou encontre cosméticos na Loja Mythreon.</p>}
      </div>
      <p role="status" className="min-h-5 text-xs text-emerald-300">{saved}</p>
    </div> : null}
  </section>;
}
