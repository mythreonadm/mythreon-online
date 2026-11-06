import React, { useEffect, useRef, useState } from "react";
import type { Character, CharacterAppearance, CosmeticLoadout, DailyBossBattle } from "../types";
import { HeroArt } from "./HeroArt";
import { ownedCosmeticLoadout } from "../engine/cosmeticOwnership";
import { AssetImage } from "./AssetImage";
import "./dailyBossArena.css";

export interface BossArenaParticipant {
  character_id: string;
  name: string;
  damage: number;
  last_action_at?: string | null;
  attack_id?: string | null;
  appearance?: CharacterAppearance;
  cosmetics?: CosmeticLoadout;
  position?: { x: number; y: number } | null;
  pvp_enabled?: boolean | string | null;
}
export interface BossArenaRun {
  id: string; boss_template_id: string; boss_name: string;
  hp_remaining: number; hp_total: number; status: "open" | "defeated" | "expired";
}
export interface BossArenaHit { id: string; runId: string; damage: number; damageTaken?: number; at: number }

const backgrounds: Record<string, string> = {
  DAILY_BRASA: "forest", DAILY_COLOSSO: "mountain", DAILY_LEVIATA: "ocean",
  DAILY_MATRIARCA: "swamp", DAILY_SENTINELA: "desert", DAILY_DEVORADOR: "abyss",
};

function ArenaSprite({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState("");
  return failed === src ? <span role="img" aria-label={alt} className="boss-arena-fallback">✦</span> : <AssetImage src={src} alt={alt} className="boss-arena-sprite" style={style} onAllSourcesFail={() => setFailed(src)} />;
}

function Hero({ attackId, appearance, cosmetics, name }: { attackId?: string | null; appearance?: CharacterAppearance; cosmetics?: CosmeticLoadout; name: string }) {
  return <HeroArt name={name} attackId={attackId} appearance={appearance} cosmetics={cosmetics} context="boss" className="boss-arena-hero-art" imageClassName="boss-arena-sprite" />;
}

export function DailyBossArena({ run, sprite, character, roster, participants, hit, now, joined, combat, selectedTargetId, onSelectTarget }: {
  run: BossArenaRun; sprite: string; character: Character | null; combat?: DailyBossBattle | null;
  roster: BossArenaParticipant[]; participants: number; hit: BossArenaHit | null; now: number; joined: boolean;
  selectedTargetId?: string | null; onSelectTarget?: (participant: BossArenaParticipant) => void;
}) {
  const [motion, setMotion] = useState(true);
  const [effects, setEffects] = useState(true);
  const [activity, setActivity] = useState<{ id: string; name: string; damage: number; at: number }[]>([]);
  const previous = useRef<{ run: string; damage: Map<string, number> }>({ run: "", damage: new Map() });
  useEffect(() => {
    const sync = () => {
      setMotion(localStorage.getItem("mythreon_animations_enabled") !== "false" && !["compat", "reduced"].includes(localStorage.getItem("mythreon_video_mode") ?? "auto"));
      setEffects(localStorage.getItem("mythreon_effects_enabled") !== "false");
    };
    sync(); window.addEventListener("mythreon-settings-change", sync);
    return () => window.removeEventListener("mythreon-settings-change", sync);
  }, []);
  useEffect(() => {
    const sample = new Map(roster.map(entry => [entry.character_id, Number(entry.damage)]));
    if (previous.current.run !== run.id) { previous.current = { run: run.id, damage: sample }; setActivity([]); return; }
    const changes = roster.flatMap(entry => {
      const before = previous.current.damage.get(entry.character_id);
      const delta = Number(entry.damage) - Number(before);
      return before !== undefined && delta > 0 && entry.character_id !== character?.id ? [{ id: entry.character_id, name: entry.name, damage: delta, at: Date.now() }] : [];
    });
    previous.current = { run: run.id, damage: sample };
    if (changes.length) setActivity(changes.slice(0, 4));
  }, [roster, run.id, character?.id]);
  const hp = Math.max(0, Math.min(100, Number(run.hp_remaining) / Math.max(1, Number(run.hp_total)) * 100));
  const allies = roster.filter(entry => entry.character_id !== character?.id).slice(0, 24);
  const confirmedHit = hit && hit.runId === run.id && now - hit.at < 2200 ? hit : null;
  const recent = activity.filter(entry => now - entry.at < 4000);
  const position = combat?.position ?? { x: 180, y: 280 };
  const bossPosition = { x: 860, y: 280 };
  const toStyle = (point: { x: number; y: number }) => ({ left: `${Math.max(4, Math.min(96, point.x / 10))}%`, top: `${Math.max(12, Math.min(88, point.y / 5.6))}%` });
  return <section aria-label="Arena cooperativa do Boss Diário" className={`boss-arena ${motion ? "" : "boss-arena-still"} ${run.status === "defeated" ? "boss-arena-victory" : ""}`}>
    <AssetImage src={`/assets/backgrounds/${backgrounds[run.boss_template_id] ?? "ruins"}.png`} alt="" className="boss-arena-backdrop" preferAnimated={motion} />
    <div className="boss-arena-shade" />
    <header className="boss-arena-caption"><span>✦ Convergência da Essência</span><strong>{run.boss_name}</strong><small>{participants.toLocaleString("pt-BR")} participantes · {joined ? "Você está na batalha" : "Observando a arena"}</small></header>
    <div className="boss-arena-health" role="progressbar" aria-label="Vida compartilhada do Boss" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(hp)} aria-valuetext={`${Number(run.hp_remaining).toLocaleString("pt-BR")} de ${Number(run.hp_total).toLocaleString("pt-BR")}`}>
      <div style={{ width: `${hp}%` }} />
    </div>
    <div className="boss-arena-field" aria-label="Campo livre do Boss Diário">
      <div className="boss-arena-lane boss-arena-lane-a" /><div className="boss-arena-lane boss-arena-lane-b" />
      <div className="boss-arena-actor boss-arena-self" style={toStyle(position)}><Hero name={character?.name ?? "Aventureiro"} attackId={character?.activeRace?.ataqueId} appearance={character?.appearance} cosmetics={character ? ownedCosmeticLoadout(character) : undefined} /><strong>{character?.name ?? "Aventureiro"}</strong><small>{joined ? "Você" : "Observando"}</small>{combat && <div className="boss-arena-player-health"><span>Vida: {combat.hp}/{combat.hpMax}</span><progress aria-label="Sua vida na batalha cooperativa" max={combat.hpMax} value={combat.hp} /><small>{combat.hp === 0 ? now < combat.recoveryUntil ? `Recuperando · ${Math.ceil((combat.recoveryUntil - now) / 1000)}s` : "Pronto para voltar" : `${combat.knockouts} nocaute(s)`}</small></div>}</div>
      <div className="boss-arena-actor boss-arena-enemy" style={toStyle(bossPosition)}><ArenaSprite src={sprite} alt={run.boss_name} /><strong>{run.status === "defeated" ? "✦ Vitória coletiva" : run.status === "expired" ? "O ciclo terminou" : run.boss_name}</strong></div>
      {allies.map(entry => { const point = entry.position ?? { x: 220 + ((entry.character_id.charCodeAt(0) * 37) % 500), y: 130 + ((entry.character_id.charCodeAt(1) * 19) % 300) }; return <button type="button" key={entry.character_id} title={`${entry.name} · selecionar alvo`} aria-label={`Selecionar ${entry.name}`} className={`boss-arena-actor boss-arena-ally ${selectedTargetId === entry.character_id ? "is-selected" : ""}`} style={toStyle(point)} onClick={() => onSelectTarget?.(entry)}><Hero name={entry.name} attackId={entry.attack_id} appearance={entry.appearance} cosmetics={entry.cosmetics} /><strong>{entry.name}</strong><small>{Number(entry.damage).toLocaleString("pt-BR")} dano</small></button>; })}
      {confirmedHit && <React.Fragment key={confirmedHit.id}>{(confirmedHit.damageTaken ?? 0) > 0 && <output className="boss-arena-retaliation" aria-label={`Retaliação: ${confirmedHit.damageTaken} de dano recebido`}>−{confirmedHit.damageTaken}<small>RETALIAÇÃO</small></output>}{effects && <span className="boss-arena-projectile" aria-hidden="true">✦</span>}<output className="boss-arena-damage" aria-label={`Golpe confirmado: ${confirmedHit.damage} de dano`}>−{confirmedHit.damage.toLocaleString("pt-BR")}<small>GOLPE CONFIRMADO</small></output></React.Fragment>}
    </div>
    <div className="boss-arena-selection-hint">{allies.length ? "Passe o mouse para iluminar e clique em um aventureiro para selecioná-lo." : "Outros aventureiros aparecerão aqui ao entrar na batalha."} · {participants} participantes</div>
    {!!recent.length && <div className="boss-arena-activity" aria-label="Contribuição sincronizada">{recent.map(entry => <span key={entry.id}>{entry.name}: +{entry.damage.toLocaleString("pt-BR")} dano sincronizado</span>)}</div>}
  </section>;
}
