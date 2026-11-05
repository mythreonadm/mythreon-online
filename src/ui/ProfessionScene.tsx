import React, { useEffect, useState } from "react";
import type { Character, Precision } from "../types";
import type { GatheringKind } from "../engine/professionChallenge";
import { ZONES } from "../data/zones";
import { ALL_ITEM_TEMPLATES } from "../data/items";
import { AssetImage } from "./AssetImage";
import { HeroArt } from "./HeroArt";
import { ItemIcon } from "./ItemIcon";
import "./professionScene.css";

export type ProfessionPhase = "idle" | "preparing" | "holding" | "confirming" | "success";
export interface ProfessionActivity { phase: ProfessionPhase; quantity?: number; precision?: Precision; bonusQuantity?: number }
function readVideoSettings() {
  try { return {
    motion: !window.matchMedia("(prefers-reduced-motion: reduce)").matches && localStorage.getItem("mythreon_animations_enabled") !== "false" && localStorage.getItem("mythreon_video_mode") !== "reduced",
    effects: localStorage.getItem("mythreon_effects_enabled") !== "false",
  }; } catch { return { motion: false, effects: false }; }
}

/** Reuses existing biome/hero/effect art. This scene never changes hunt or character stats. */
export function ProfessionScene({ character, kind, point, activity }: {
  character: Character; kind: GatheringKind;
  point: { id: string; name: string; zoneId: string; dropTemplateId: string };
  activity: ProfessionActivity;
}) {
  const [video, setVideo] = useState(readVideoSettings);
  useEffect(() => {
    const update = () => setVideo(readVideoSettings());
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");media.addEventListener("change", update);
    window.addEventListener("mythreon-settings-change", update);window.addEventListener("storage", update);
    return () => { window.removeEventListener("mythreon-settings-change", update);window.removeEventListener("storage", update);media.removeEventListener("change", update); };
  }, []);
  const fishing = kind === "PESCA", working = activity.phase === "holding", won = activity.phase === "success", active = activity.phase !== "idle";
  const biome = ZONES[point.zoneId], theme = biome?.theme ?? "forest";
  const tool = fishing ? character.equippedFishingRod : character.equippedMiningTool;
  const biomeArt = `/assets/backgrounds/${theme}.png`;
  const activityArt = fishing ? "/assets/professions/PESCA_ATIVA.gif" : "/assets/professions/MINERACAO_ATIVA.gif";
  const sceneArt = active && video.motion ? activityArt : biomeArt;
  const labels: Record<ProfessionPhase, string> = { idle: "Escolha um ponto e encontre o pulso", preparing: "Preparando · mantenha pressionado", holding: fishing ? "Sinta a linha · solte no dourado" : "Encontre a veia · solte no dourado", confirming: "Recolhendo · aguardando confirmação", success: "Coleta confirmada" };
  return <figure data-profession-scene={kind} data-point={point.id} data-phase={activity.phase} data-motion={video.motion} data-effects={video.effects}
    className={`profession-scene ${fishing ? "profession-scene-fishing" : "profession-scene-mining"} ${working ? "is-working" : ""} ${won ? "is-won" : ""}`}>
    <AssetImage src={sceneArt} fallbackSrc={[biomeArt]} alt="" aria-hidden="true" preferAnimated={video.motion} className="profession-scenery" />
    <div className="profession-scene-shade" />
    <figcaption className="profession-scene-caption"><span>{fishing ? "À margem das águas" : "Sob a crosta da Essência"}</span><strong>{point.name}</strong><small>{biome?.name}</small></figcaption>
    <div className="profession-bank" aria-hidden="true" />
    {fishing ? <><div className="profession-water" aria-hidden="true"><i /><i /><i /></div><svg className="profession-fishing-line" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true"><path d="M104 156 Q188 16 268 160" /></svg><span className="profession-float" aria-hidden="true" /><div className="profession-bite">{video.effects && (working || won) ? <AssetImage src="/assets/ui/EFEITO_PESCA_MORDIDA.png" alt="" aria-hidden="true" preferAnimated={video.motion} /> : null}</div></> : <><div className="profession-rock" aria-hidden="true" /><div className="profession-vein"><AssetImage src="/assets/ui/EFEITO_MINERACAO_FAISCA.png" alt="" aria-hidden="true" preferAnimated={video.motion} /></div></>}
    <HeroArt name={character.name} appearance={character.appearance} cosmetics={character.cosmeticLoadout} context="portrait" className="profession-avatar" />
    {tool ? <div className="profession-held-tool" aria-hidden="true"><ItemIcon item={tool} className="block h-full w-full" /></div> : null}
    <div className="profession-scene-resource"><ItemIcon item={ALL_ITEM_TEMPLATES[point.dropTemplateId]} className="block h-10 w-10 shrink-0 text-2xl" /><span>{won ? `+${activity.quantity ?? 1}` : "Recurso local"}</span></div>
    <p role="status" className="profession-scene-status">{labels[activity.phase]}{won && activity.bonusQuantity ? ` · +${activity.bonusQuantity} pela isca` : ""}</p>
  </figure>;
}
