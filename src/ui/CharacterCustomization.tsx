import React, { useState } from "react";
import { CharacterAppearance } from "../types";
import { useGameStore } from "../store/gameStore";

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
  const updateAppearance = useGameStore(state => state.updateAppearance);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("");
  const [draft, setDraft] = useState<CharacterAppearance>(character?.appearance ?? defaultAppearance);
  if (!character) return null;
  const set = <K extends keyof CharacterAppearance>(key: K, value: CharacterAppearance[K]) => setDraft(current => ({ ...current, [key]: value }));
  const save = () => { const result = updateAppearance(draft); setSaved(result.success ? "Personalização salva na Essência." : result.error ?? "Não foi possível salvar."); };
  const select = <K extends keyof CharacterAppearance>(key: K, label: string, values: readonly (readonly [string, string])[]) => <label className="text-xs text-gray-300">{label}<select value={draft[key]} onChange={event => set(key, event.target.value as CharacterAppearance[K])} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white">{values.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  return <section className="rounded-xl border border-arcane-purple/40 bg-arcane-panel p-4 shadow-lg">
    <button type="button" onClick={() => { setOpen(value => !value); setSaved(""); }} className="flex w-full items-center justify-between text-left"><span><span className="block text-[10px] font-black uppercase tracking-widest text-arcane-cyan">Identidade do aventureiro</span><strong className="text-lg text-arcane-gold">🎨 Personalização de Personagem</strong></span><span className="text-xl text-gray-400">{open ? "⌃" : "⌄"}</span></button>
    {open && <div className="mt-4 space-y-3 border-t border-white/10 pt-4"><p className="text-xs leading-relaxed text-gray-400">Defina a aparência humana que acompanha você no Refúgio, nas telas sociais e nos próximos sistemas de skins. A personalização não altera atributos de combate.</p><div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">{select("body", "Corpo", options.body)}{select("skin", "Pele", options.skin)}{select("hair", "Cabelo", options.hair)}{select("hairColor", "Cor do cabelo", options.hairColor)}{select("outfit", "Roupa", options.outfit)}{select("outfitColor", "Cor da roupa", options.outfitColor)}</div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={save} className="online-button">Salvar aparência</button><button type="button" onClick={() => setDraft(character.appearance ?? defaultAppearance)} className="online-button-secondary">Desfazer</button>{saved && <span role="status" className="text-xs text-emerald-300">{saved}</span>}</div></div>}
  </section>;
}
