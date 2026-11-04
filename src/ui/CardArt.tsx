import React, { useState } from "react";
import type { CardTemplate } from "../types";
import { ZONES } from "../data/zones";
import { AssetImage } from "./AssetImage";

export function CardArt({ template, hidden = false, className = "" }: { template: CardTemplate; hidden?: boolean; className?: string }) {
  const monster = ZONES[template.region]?.enemies.find(enemy => enemy.id === template.monsterId);
  const src = template.sprite ?? monster?.sprite ?? `/assets/monsters/${template.monsterId}.png`;
  const [failed, setFailed] = useState("");
  return <div className={`relative grid h-28 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-black ${className}`}>
    <span aria-hidden="true" className="absolute inset-x-6 bottom-2 h-3 rounded-[50%] bg-violet-400/15 blur-sm" />
    {hidden ? <span className="text-5xl text-slate-700" aria-label="Memória não descoberta">?</span> : failed === src ? <span className="relative text-6xl" role="img" aria-label={template.name}>{template.emoji}</span> : <AssetImage src={src} alt={template.name} className="relative h-full w-full object-contain p-2" onAllSourcesFail={() => setFailed(src)} />}
  </div>;
}
