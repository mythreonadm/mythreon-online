import React, { useState } from "react";
import type { CharacterAppearance, CosmeticLoadout } from "../types";
import { getLineageByAttack } from "../data/lineages";
import { getCosmeticVisual } from "../utils/cosmetics";
import { appearanceStyle } from "../utils/appearance";
import { AssetImage } from "./AssetImage";

const HUMAN_SPRITE = "/assets/players/humano-v2.png";

/** Shared hero presentation. Appearance never enters combat or equipment calculations. */
export function HeroArt({ attackId, appearance, cosmetics, name, context = "hunt", className = "", imageClassName = "" }: {
  attackId?: string | null; appearance?: CharacterAppearance; cosmetics?: CosmeticLoadout; name: string;
  context?: "hunt" | "portrait" | "boss" | "preview"; className?: string; imageClassName?: string;
}) {
  const lineage = getLineageByAttack(attackId ?? undefined);
  const human = lineage.id === "HUMANO";
  const visual = getCosmeticVisual(cosmetics);
  const primary = human ? visual.skinSprite ?? HUMAN_SPRITE : lineage.sprite;
  const [failedSkin, setFailedSkin] = useState("");
  const [failedBase, setFailedBase] = useState("");
  const source = human && primary !== HUMAN_SPRITE && failedSkin === primary ? HUMAN_SPRITE : primary;
  const signature = primary + "|" + source;
  const showAddon = context === "boss" || context === "preview";
  const label = human && source !== HUMAN_SPRITE ? `${name} · ${visual.labels[0] ?? "skin humana"}` : name;
  return <div data-hero-art={lineage.id} data-hero-source={source} data-hero-context={context} className={`hero-art ${visual.skinClassName} ${visual.matrixClassName} ${showAddon ? visual.addonClassName : ""} ${className}`}>
    {showAddon && visual.addonSprite ? <AssetImage src={visual.addonSprite} alt="" aria-hidden="true" className="hero-art-addon" /> : null}
    {failedBase === signature ? <span role="img" aria-label={name} className="hero-art-fallback">{lineage.emoji}</span> : <AssetImage key={source} src={source} alt={label}
      className={`hero-art-image ${imageClassName}`}
      style={human && source === HUMAN_SPRITE ? appearanceStyle(appearance) : undefined}
      onAllSourcesFail={() => {
        if (human && source === primary && primary !== HUMAN_SPRITE) setFailedSkin(primary);
        else setFailedBase(signature);
      }} />}
  </div>;
}
