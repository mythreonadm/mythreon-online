import { useLayoutEffect, useRef, useState } from "react";
import type { HuntBeat, HuntImpact } from "../engine/huntPresentation";
import { playAttackSfx, playCombatSfx } from "../utils/sfx";
import "./huntVisuals.css";

const labels: Record<HuntImpact["kind"], string> = {
  basic: "Golpe", combo: "Combo", spell: "Magia", pet: "Pet", elemental: "Elemento",
  counter: "Contra-ataque", miss: "Errou", dodge: "Esquiva", heal: "Cura",
};

type Frame = { beat: HuntBeat; count: number; defeated: boolean };
type Playback = { cancel: () => void; isCombo: boolean };

export function useHuntTimeline(beat: HuntBeat | undefined, scope: string, active: boolean) {
  const [frame, setFrame] = useState<Frame>();
  const seen = useRef({ characterId: beat?.characterId, tick: beat?.tick ?? -1 });
  const playing = useRef<Playback>();
  const pending = useRef<HuntBeat>();
  const key = beat && `${beat.characterId}:${beat.tick}`;

  useLayoutEffect(() => {
    const cancel = () => { playing.current?.cancel(); playing.current = undefined; pending.current = undefined; };
    const onVisibility = () => { if (document.hidden) { cancel(); setFrame(undefined); } };
    setFrame(undefined);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { cancel(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [scope, active]);

  useLayoutEffect(() => {
    if (!active || !beat) {
      playing.current?.cancel(); playing.current = undefined; pending.current = undefined;
      setFrame(undefined);
      return;
    }
    if (seen.current.characterId === beat.characterId && seen.current.tick >= beat.tick) return;
    seen.current = { characterId: beat.characterId, tick: beat.tick };
    if (document.hidden || !beat.impacts.length) return;
    if (playing.current?.isCombo) {
      pending.current = beat;
      return;
    }
    playing.current?.cancel();
    play(beat);

    function play(next: HuntBeat) {
      const timers: ReturnType<typeof setTimeout>[] = [];
      playing.current = {
        isCombo: next.impacts.some(impact => impact.kind === "combo"),
        cancel: () => timers.forEach(clearTimeout),
      };
      setFrame({ beat: next, count: 0, defeated: false });
      const step = next.impacts.length > 7 ? 100 : 145;
      const firstBasic = next.impacts.findIndex(impact => impact.kind === "basic");
      next.impacts.forEach((impact, index) => {
        timers.push(setTimeout(() => {
          setFrame({ beat: next, count: index + 1, defeated: false });
          if (impact.comboHit === 1) playAttackSfx(undefined, true);
          if (impact.kind === "spell") playAttackSfx(impact.sourceId);
          if (impact.kind === "pet") playCombatSfx("beast");
          if (index === firstBasic) playCombatSfx("hit");
        }, 140 + index * step));
      });
      const end = 140 + (next.impacts.length - 1) * step;
      if (next.outcome === "victory") timers.push(setTimeout(() => {
        setFrame({ beat: next, count: next.impacts.length, defeated: true });
      }, end + 130));
      timers.push(setTimeout(() => {
        playing.current = undefined;
        const queued = pending.current;
        pending.current = undefined;
        if (queued && !document.hidden) play(queued);
        else setFrame(undefined);
      }, end + 650));
    }
    // A confirmed tick can reappear as a newly cloned snapshot. Use its identity.
  }, [key, scope, active]);

  return active && beat && frame?.beat.characterId === beat.characterId &&
    frame.beat.zoneId === beat.zoneId && frame.beat.baseEnemyId === beat.baseEnemyId ? frame : undefined;
}

const elementColor: Partial<Record<NonNullable<HuntImpact["element"]>, string>> = {
  FOGO: "#fb9160", GELO: "#9deaff", TERRA: "#adf18a", AGUA: "#75c8ff", VENENO: "#adf18a",
  ELETRICIDADE: "#ffe676", MORTE: "#ca9bff", SAGRADO: "#fff0b1", PSIQUICO: "#faa3f1", VENTO: "#c0ffef", METAL: "#c0d6ea",
};

export function HuntVisuals({ frame, motion, effects }: { frame: Frame; motion: boolean; effects: boolean }) {
  const activeImpact = frame.beat.impacts[frame.count - 1];
  const nextImpact = frame.beat.impacts[frame.count];
  const projectile = nextImpact?.kind === "pet" || nextImpact?.kind === "spell" ||
    (nextImpact?.kind === "basic" && nextImpact.sourceId?.includes("ARCO"));
  return <div className={`hunt-visuals ${motion ? "" : "hunt-visuals-static"}`} aria-hidden="true">
    {effects && motion && projectile &&
      <span key={`trail-${frame.count}`} className={`hunt-trail ${nextImpact.kind === "pet" ? "hunt-trail-pet" : ""}`}
        style={{ color: elementColor[nextImpact.element ?? "BASE"] }} />}
    {effects && activeImpact && !["miss", "dodge", "heal"].includes(activeImpact.kind) &&
      <svg key={frame.count} viewBox="0 0 48 48" className={`hunt-mark hunt-mark-${activeImpact.kind} ${activeImpact.target === "hero" ? "hunt-mark-hero" : ""}`}
        style={{ color: elementColor[activeImpact.element ?? "BASE"] }} shapeRendering="crispEdges">
        {activeImpact.kind === "combo" ? <path d="M22 1h4v9h4v4h4v4h4v4h9v4h-9v4h-4v4h-4v4h-4v9h-4v-9h-4v-4h-4v-4h-4v-4H1v-4h9v-4h4v-4h4v-4h4zM24 15l-9 9 9 9 9-9z" fill="currentColor" fillRule="evenodd" />
          : activeImpact.kind === "pet" ? <path d="M4 30h10v-5h8v-5h7V7h5v8h5v-4h5v10h-5v5H28v5h-9v5H9v5H4z" fill="currentColor" />
          : activeImpact.kind === "spell" && activeImpact.sourceId === "A1" ? <path d="M5 11h10v4h4v12h-4v-8h-4v-4H5zm28 0h10v4h-6v4h-4v8h-4V15h4zM11 33h5v4h7v5h-8v-4h-4zm21 0h5v5h-4v4h-8v-5h7z" fill="currentColor" />
          : <path d="M2 38h8v-5h7v-5h7v-6h7v-6h7v-7h7v9h-6v7h-7v6h-8v6h-8v5H2z" fill="currentColor" />}
      </svg>}
    {([false, true] as const).map(hero => {
      const hits = frame.beat.impacts.slice(0, frame.count).map((impact, index) => ({ impact, index }))
        .filter(({ impact }) => (impact.target === "hero") === hero).slice(-3);
      return <div key={String(hero)} className={`hunt-hits ${hero ? "hunt-hits-hero" : "hunt-hits-enemy"}`}>
        {hits.map(({ impact, index }) => <div key={index} className={`hunt-hit hunt-hit-${impact.kind}`}
          data-hunt-impact={impact.comboHit ? `combo-${impact.comboHit}` : impact.kind}>
          <strong>{impact.amount > 0 && `${impact.kind === "heal" ? "+" : "−"}${impact.amount}`}</strong>
          <small>{labels[impact.kind]}{impact.comboHit ? ` ${impact.comboHit}/2` : ""}{impact.element && impact.element !== "BASE" ? ` · ${impact.element}` : ""}{impact.critical ? " · Crítico" : ""}</small>
        </div>)}
      </div>;
    })}
  </div>;
}
