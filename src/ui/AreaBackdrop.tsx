import React, { ReactNode } from "react";
import { AssetImage } from "./AssetImage";

/** Shared visual header for Mythreon areas. The art is decorative and never owns gameplay state. */
export function AreaBackdrop({
  src, kicker, title, description, children, titleClass = "text-arcane-gold",
}: {
  src: string; kicker: string; title: string; description: string; children?: ReactNode; titleClass?: string;
}) {
  return <header className="relative isolate overflow-hidden rounded-2xl border border-white/15 bg-[#081116] px-5 py-6 shadow-[0_18px_55px_rgba(0,0,0,.28)] sm:px-7">
    <AssetImage src={src} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-75" />
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,12,16,.96)_0%,rgba(4,12,16,.76)_42%,rgba(4,12,16,.48)_72%,rgba(4,12,16,.82)_100%),linear-gradient(180deg,rgba(3,10,15,.2),rgba(3,10,15,.88))]" />
    <div className="relative z-10 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-3xl"><p className="online-eyebrow text-arcane-cyan">{kicker}</p><h1 className={`mt-1 text-3xl font-black tracking-wide ${titleClass}`}>{title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200/85">{description}</p></div>
      {children ? <div className="flex flex-wrap items-center justify-end gap-2">{children}</div> : null}
    </div>
  </header>;
}
