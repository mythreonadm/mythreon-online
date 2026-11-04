import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { CARD_TEMPLATES, TRAITS, getCardStats } from "../data/cards";
import { ZONES } from "../data/zones";
import { cardEvolutionQuote, cardHeroBonus, equippedCards, formationBonus, cardFormationScore } from "../engine/cardCollection";
import type { CardRarity, CardInstance, CardStats } from "../types";
import { worldRequest } from "../online/client";
import { onlineAction, useOnlineState } from "../online/controller";
import { confirmedAction } from "../online/confirmation";
import { CardArt } from "./CardArt";

const RARITIES: Array<"TODAS" | CardRarity> = ["TODAS", "COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
const rarityLabel: Record<string, string> = { TODAS: "Todas", COMUM: "Comum", INCOMUM: "Incomum", RARO: "Raro", EPICO: "Épico", LENDARIO: "Lendário" };
const rarityClass: Record<string, string> = { COMUM: "border-slate-500", INCOMUM: "border-emerald-500", RARO: "border-blue-500", EPICO: "border-violet-500", LENDARIO: "border-amber-300 shadow-[0_0_18px_rgba(217,164,65,.2)]" };
const format = (key: string, value: number) => key === "spd" ? `${(value * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%` : value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
function BonusGrid({ stats, prefix = "", raw = false }: { stats: CardStats; prefix?: string; raw?: boolean }) {
  return <dl className="mt-3 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">{Object.entries(stats).map(([key, value]) => <div key={key} className="rounded-lg border border-white/10 bg-black/25 p-2"><dt className="uppercase text-slate-400">{key === "spd" && !raw ? "Velocidade" : key}</dt><dd data-card-stat={key} className="mt-1 font-bold text-cyan-100">{prefix}{raw ? value.toLocaleString("pt-BR") : format(key, value)}</dd></div>)}</dl>;
}

export function CardAlbum() {
  const character = useGameStore(s => s.character);
  const active = useOnlineState(s => s.active), pending = useOnlineState(s => s.pending);
  const [rarity, setRarity] = useState<"TODAS" | CardRarity>("TODAS"), [region, setRegion] = useState("TODAS");
  const [search, setSearch] = useState(""), [showMissing, setShowMissing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [season, setSeason] = useState<any>(null), [seasonError, setSeasonError] = useState("");
  const [notice, setNotice] = useState(""), [busy, setBusy] = useState(false);
  const [materials, setMaterials] = useState<string[]>([]), [review, setReview] = useState(false);
  const lock = useRef(false), seasonGeneration = useRef(0), modal = useRef<HTMLElement | null>(null);
  const cards = character?.cards ?? [];
  const grouped = useMemo(() => {
    const map = new Map<string, { instance: CardInstance; count: number }>();
    for (const card of cards) {
      if (!CARD_TEMPLATES[card.templateId]) continue;
      const previous = map.get(card.templateId);
      if (!previous) map.set(card.templateId, { instance: card, count: 1 });
      else { previous.count++;if (card.level > previous.instance.level) previous.instance = card; }
    }
    return map;
  }, [cards]);
  const unique = grouped.size, selected = cards.find(card => card.uid === selectedId);
  const quote = character && selected ? cardEvolutionQuote(character, selected.uid) : null;
  useEffect(() => { setSelectedId(null);setNotice("");setMaterials([]);setReview(false); }, [character?.id]);
  useEffect(() => { setMaterials(quote?.suggested ?? []);setReview(false); }, [selected?.uid, selected?.level]);
  const refreshSeason = useCallback(async () => {
    const token = ++seasonGeneration.current, id = character?.id;
    if (!active || !id) { setSeason(null);return; }
    try {
      const response = await worldRequest("cards.season.read", {}, id);
      if (token === seasonGeneration.current && useGameStore.getState().character?.id === id) { setSeason(response.cards ?? null);setSeasonError(""); }
    } catch (error) { if (token === seasonGeneration.current) setSeasonError(error instanceof Error ? error.message : "Não foi possível ler a temporada."); }
  }, [active, character?.id, unique]);
  useEffect(() => { setSeason(null);void refreshSeason();return () => { seasonGeneration.current++; }; }, [refreshSeason]);
  useEffect(() => {
    if (!selectedId) return;
    const previous = document.activeElement as HTMLElement | null;
    modal.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelectedId(null);return; }
      if (event.key !== "Tab") return;
      const targets = Array.from(modal.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),summary,[tabindex="0"]') ?? []);
      const first = targets[0], last = targets.at(-1);
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault();last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();first.focus(); }
    };
    document.addEventListener("keydown", keys);return () => { document.removeEventListener("keydown", keys);previous?.focus(); };
  }, [selectedId]);

  if (!character) return null;
  const completion = Math.round(unique / Math.max(1, Object.keys(CARD_TEMPLATES).length) * 100);
  const formation = equippedCards(character), bonus = formationBonus(character);
  const regions = [...new Set(Object.values(CARD_TEMPLATES).map(template => template.region))];
  const filtered = Object.entries(CARD_TEMPLATES).filter(([id, template]) =>
    (showMissing || grouped.has(id)) && (rarity === "TODAS" || template.rarity === rarity) &&
    (region === "TODAS" || template.region === region) &&
    `${template.name} ${TRAITS[template.trait].name}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  const run = async (action: () => Promise<{success:boolean;error?:string;level?:number}>, success: string) => {
    if (lock.current || pending) return;
    const actorId = character.id;
    lock.current = true;setBusy(true);setNotice("");
    try { const result = await action();if (useGameStore.getState().character?.id !== actorId) return;setNotice(result.success ? result.level ? `Carta evoluída para o nível ${result.level}.` : success : result.error ?? "Não foi possível concluir.");if (result.success) setReview(false); }
    catch (error) { if (useGameStore.getState().character?.id === actorId) setNotice(error instanceof Error ? error.message : "Não foi possível concluir."); }
    finally { lock.current = false;setBusy(false); }
  };
  const saveFormation = (uids: string[]) => run(() => confirmedAction(useGameStore.getState().setCardLoadout(uids)), "Formação atualizada.");
  const eligible = new Set(quote?.eligible.map(card => card.uid) ?? []);
  const validMaterials = quote && materials.length === quote.copiesNeeded && materials.every(uid => eligible.has(uid));
  const canEvolve = quote && !quote.maxed && validMaterials && character.gold >= quote.gold;
  const selectedTemplate = selected && CARD_TEMPLATES[selected.templateId];
  return <section className="space-y-5">
    <header className="rounded-2xl border border-violet-500/40 bg-gradient-to-r from-arcane-panel via-violet-950/20 to-arcane-panel p-5">
      <p className="text-[10px] uppercase tracking-[.2em] text-violet-300">Arquivo de memórias vivas</p><div className="mt-1 flex flex-wrap justify-between gap-3"><div><h1 className="text-2xl font-black text-white">🎴 Álbum de Cards</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Colecione criaturas, forme sua build e transforme cópias repetidas em evolução. Os bônus da formação afetam a hunt, o Gear Score e o duelo online.</p></div><div><strong className="block text-3xl text-arcane-gold">{completion}%</strong><span className="text-xs text-cyan-200">{unique}/{Object.keys(CARD_TEMPLATES).length} memórias · {cards.length} cópias</span></div></div>
    </header>
    {active ? <section className="rounded-xl border border-amber-400/30 bg-amber-950/10 p-4"><h2 className="font-bold text-amber-100">Temporada de coleção · {season?.seasonKey ?? "carregando"}</h2><p className="mt-1 text-xs text-slate-400">50%, 80% e 100% da coleção melhoram a recompensa. O resgate fica disponível após o encerramento do mês.</p>{season?.previousSeason?.reward ? <p className="mt-2 text-sm text-emerald-300">Temporada {season.previousSeason.key}: recompensa resgatada.</p> : season?.previousSeason?.preview ? <div className="mt-3 flex flex-wrap items-center gap-3"><span className="text-xs text-cyan-100">{season.previousSeason.key} · {season.previousSeason.preview.tier} · {season.previousSeason.preview.gold.toLocaleString("pt-BR")} gold · {season.previousSeason.preview.shards} Shards · {season.previousSeason.preview.coins} Coins</span><button disabled={busy || pending} className="online-button" onClick={() => void run(async () => { await onlineAction("cards.season.claim", { seasonKey: season.previousSeason.key });await refreshSeason();return {success:true}; }, "Recompensa sazonal resgatada.")}>Resgatar temporada</button></div> : <p className="mt-2 text-xs text-slate-500">Sem recompensa anterior disponível.</p>}{seasonError ? <p role="alert" className="mt-2 text-xs text-red-300">{seasonError}</p> : null}</section> : null}
    <section data-card-formation className="rounded-xl border border-cyan-400/30 bg-cyan-950/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-black text-cyan-200">Formação equipada · {formation.length}/5</h2><span className="text-xs text-amber-200">Índice da formação: {Math.round(cardFormationScore(character))}</span></div>
      <p className="mt-1 text-xs text-slate-400">Bônus do herói antes dos multiplicadores e limites da build. Estes valores usam a mesma regra do combate.</p><BonusGrid stats={bonus} prefix="+" />
      <div className="mt-3 flex flex-wrap gap-2">{formation.map(card => <button key={card.uid} onClick={() => setSelectedId(card.uid)} className="rounded-full border border-cyan-300/30 px-3 py-2 text-xs text-cyan-100">{CARD_TEMPLATES[card.templateId].emoji} {CARD_TEMPLATES[card.templateId].name} · Nv {card.level}</button>)}</div>
      {!formation.length ? <p className="mt-2 text-xs text-slate-400">Abra uma carta e escolha Equipar. Até cinco cópias podem participar da formação.</p> : null}
    </section>
    <p role="status" className="min-h-5 text-sm text-cyan-100">{busy ? "Confirmando alteração…" : notice}</p>
    <div className="flex flex-wrap gap-2">
      <input aria-label="Buscar carta" placeholder="Nome ou traço" value={search} onChange={e => setSearch(e.target.value)} className="online-input min-w-0 flex-1" />
      <select aria-label="Raridade da carta" value={rarity} onChange={e => setRarity(e.target.value as any)} className="online-input w-auto">{RARITIES.map(value => <option key={value} value={value}>{rarityLabel[value]}</option>)}</select>
      <select aria-label="Bioma das cartas" value={region} onChange={e => setRegion(e.target.value)} className="online-input max-w-full">{["TODAS", ...regions].map(value => <option key={value} value={value}>{ZONES[value]?.name ?? "Todos os biomas"}</option>)}</select>
      <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={showMissing} onChange={e => setShowMissing(e.target.checked)} />Mostrar não descobertas</label>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{filtered.map(([id, template]) => {
      const owned = grouped.get(id), trait = TRAITS[template.trait];
      return <button data-card-template={id} key={id} disabled={!owned} onClick={() => { setNotice("");setSelectedId(owned!.instance.uid); }} className={`min-w-0 rounded-xl border-2 bg-arcane-panel p-3 text-left ${rarityClass[template.rarity]} ${owned ? "hover:bg-white/5" : "opacity-50"}`}>
        <CardArt template={template} hidden={!owned} /><strong className="mt-2 block truncate text-xs text-white">{template.name}</strong><span className={`text-[10px] ${trait.color}`}>{trait.icon} {trait.name}</span><span className="mt-1 block text-[10px] text-slate-400">{owned ? `Nv ${owned.instance.level} · ${owned.count} cópia(s)` : "Memória não descoberta"}</span>
      </button>;
    })}</div>
    {!filtered.length ? <p className="rounded-xl border border-white/10 p-8 text-center text-slate-400">Nenhuma memória encontrada. Tente outros filtros ou continue caçando.</p> : null}
    {selected && selectedTemplate && quote ? <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/85 p-3" onClick={() => setSelectedId(null)}>
      <article ref={modal} role="dialog" aria-modal="true" aria-labelledby="card-detail-title" className={`max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border-2 bg-arcane-panel p-4 sm:p-6 ${rarityClass[selectedTemplate.rarity]}`} onClick={e => e.stopPropagation()}>
        <button type="button" aria-label="Fechar carta" onClick={() => setSelectedId(null)} className="float-right rounded px-3 py-1 text-xl text-slate-300">✕</button>
        <CardArt template={selectedTemplate} className="mx-auto h-36 max-w-48" /><h2 id="card-detail-title" className="mt-2 text-center text-xl font-black text-white">{selectedTemplate.name}</h2><p className="text-center text-xs text-violet-200">Nível {selected.level} · {rarityLabel[selectedTemplate.rarity]} · cópia {selected.uid.slice(-6)}</p>
        <label className="mt-3 block text-xs text-slate-400">Escolher cópia<select aria-label="Escolher cópia da carta" disabled={busy || pending} value={selected.uid} onChange={event => setSelectedId(event.target.value)} className="online-input mt-1 w-full">{cards.filter(card => card.templateId === selected.templateId).map(card => <option key={card.uid} value={card.uid}>Nv {card.level} · {card.uid.slice(-6)}{formation.some(member => member.uid === card.uid) ? " · equipada" : " · livre"}</option>)}</select></label>
        <h3 className="mt-4 text-sm font-bold text-cyan-100">Bônus no herói quando equipada</h3><BonusGrid stats={cardHeroBonus(selected)} prefix="+" />
        <button disabled={busy || pending || (!formation.some(card => card.uid === selected.uid) && formation.length >= 5)} className="online-button mt-3 w-full" onClick={() => void saveFormation(formation.some(card => card.uid === selected.uid) ? formation.filter(card => card.uid !== selected.uid).map(card => card.uid) : [...formation.map(card => card.uid), selected.uid])}>{formation.some(card => card.uid === selected.uid) ? "Retirar da formação" : formation.length >= 5 ? "Formação cheia · retire uma carta" : "Equipar carta"}</button>
        <details className="mt-3 rounded-lg border border-white/10 p-3 text-xs text-slate-300"><summary>Atributos brutos da carta e memória</summary><BonusGrid stats={getCardStats(selectedTemplate, selected.level)} raw /><p className="mt-2">{selectedTemplate.ability}: {selectedTemplate.abilityDesc}</p><p className="mt-2 text-slate-400">Os traços e descrições da criatura não concedem esses efeitos à hunt/PvP online; nesses modos a formação contribui pelos atributos acima.</p></details>
        <section className="mt-4 rounded-xl border border-amber-400/30 bg-amber-950/10 p-3"><h3 className="font-bold text-amber-100">Evolução da memória</h3>{quote.maxed ? <p className="mt-2 text-sm text-emerald-300">Nível 5 · evolução máxima.</p> : <>
          <p className="mt-2 text-xs text-slate-300">Nv {quote.level} → {quote.nextLevel}: {quote.gold.toLocaleString("pt-BR")} gold + {quote.copiesNeeded} cópias iguais de nível 1. Equipadas e evoluídas não são consumidas.</p>
          <p className="mt-1 text-xs text-slate-400">Bônus após evoluir e equipar:</p><BonusGrid stats={cardHeroBonus({ ...selected, level: quote.nextLevel })} prefix="+" />
          <div className="mt-3 max-h-36 space-y-1 overflow-y-auto">{quote.eligible.slice(0, 64).map(card => <label key={card.uid} className="flex items-center gap-2 rounded border border-white/10 bg-black/20 p-2 text-xs text-slate-300"><input type="checkbox" checked={materials.includes(card.uid)} disabled={busy || pending} onChange={event => { setReview(false);setMaterials(current => event.target.checked ? [...current, card.uid] : current.filter(uid => uid !== card.uid)); }} />Cópia {card.uid.slice(-6)} · Nv 1</label>)}</div>
          <p className="mt-2 text-xs text-slate-400">{materials.length}/{quote.copiesNeeded} selecionadas · {quote.eligible.length} livres · gold: {character.gold.toLocaleString("pt-BR")}</p>
          {!quote.eligible.length ? <p className="mt-2 text-xs text-amber-200">Cace esta criatura para encontrar mais cópias livres.</p> : null}
          {review ? <div className="mt-3 rounded-lg border border-amber-300/40 p-3"><p className="text-xs text-amber-100">Confirmar consumo de {materials.length} cópias e {quote.gold.toLocaleString("pt-BR")} gold? A carta principal permanece e sobe para o nível {quote.nextLevel}.</p><button data-card-evolve disabled={!canEvolve || busy || pending} className="online-button mt-2 w-full" onClick={() => void run(() => confirmedAction(useGameStore.getState().evolveCard(selected.uid, [...materials], selected.level)), "Evolução concluída.")}>Confirmar evolução</button><button disabled={busy} onClick={() => setReview(false)} className="mt-2 w-full text-xs text-slate-300">Voltar à seleção</button></div> : <button disabled={!canEvolve || busy || pending} className="online-button mt-3 w-full" onClick={() => setReview(true)}>Revisar evolução · Nv {quote.nextLevel}</button>}
        </>}</section>
        <p role="status" className="mt-3 text-sm text-cyan-100">{busy ? "Confirmando alteração…" : notice}</p>
      </article>
    </div> : null}
  </section>;
}
