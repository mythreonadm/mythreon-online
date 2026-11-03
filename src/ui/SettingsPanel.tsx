import React, { useEffect, useState } from "react";

type VideoMode = "auto" | "compat" | "reduced";

function readBool(key: string, fallback = true) {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  return value === null ? fallback : value !== "false";
}

function notifySettingsChanged() {
  window.dispatchEvent(new Event("mythreon-settings-change"));
}

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [videoMode, setVideoMode] = useState<VideoMode>(() => (localStorage.getItem("mythreon_video_mode") as VideoMode) || "auto");
  const [animations, setAnimations] = useState(() => readBool("mythreon_animations_enabled"));
  const [effects, setEffects] = useState(() => readBool("mythreon_effects_enabled"));
  const [sound, setSound] = useState(() => !readBool("mythreon_mute", false));
  const [combatSfx, setCombatSfx] = useState(() => readBool("mythreon_sfx_enabled"));

  useEffect(() => {
    if (!open) return;
    const sync = () => {
      setVideoMode((localStorage.getItem("mythreon_video_mode") as VideoMode) || "auto");
      setAnimations(readBool("mythreon_animations_enabled"));
      setEffects(readBool("mythreon_effects_enabled"));
      setSound(!readBool("mythreon_mute", false));
      setCombatSfx(readBool("mythreon_sfx_enabled"));
    };
    sync();
    window.addEventListener("mythreon-settings-change", sync);
    return () => window.removeEventListener("mythreon-settings-change", sync);
  }, [open]);

  if (!open) return null;
  const save = (key: string, value: string) => { localStorage.setItem(key, value); notifySettingsChanged(); };
  const setVideo = (value: VideoMode) => { setVideoMode(value); save("mythreon_video_mode", value); };
  const setAnimationsValue = (value: boolean) => { setAnimations(value); save("mythreon_animations_enabled", String(value)); };
  const setEffectsValue = (value: boolean) => { setEffects(value); save("mythreon_effects_enabled", String(value)); };
  const setSoundValue = (value: boolean) => { setSound(value); save("mythreon_mute", String(!value)); };
  const setSfxValue = (value: boolean) => { setCombatSfx(value); save("mythreon_sfx_enabled", String(value)); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label="Configurações">
      <div className="w-full max-w-lg rounded-2xl border border-arcane-border bg-arcane-panel p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-arcane-border pb-3">
          <div><h2 className="text-xl font-black text-arcane-gold">⚙️ Configurações</h2><p className="text-xs text-gray-400">Ajuste a apresentação do combate para o seu dispositivo.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-xl text-gray-300 hover:bg-white/10" aria-label="Fechar configurações">×</button>
        </div>
        <section className="space-y-3">
          <label className="block text-sm font-bold text-gray-200">Modo de vídeo
            <select value={videoMode} onChange={e => setVideo(e.target.value as VideoMode)} className="mt-1 w-full rounded-lg border border-arcane-border bg-arcane-bg px-3 py-2 text-sm text-white">
              <option value="auto">Automático — efeitos completos</option>
              <option value="compat">Compatibilidade — marcador de HIT garantido</option>
              <option value="reduced">Econômico — menos animações</option>
            </select>
          </label>
          <p className="rounded-lg border border-cyan-400/20 bg-cyan-950/20 p-3 text-xs text-cyan-100">Se você não vê projéteis, impactos ou o combo, use <strong>Compatibilidade</strong>. O jogo mantém os números de dano e exibe um marcador de impacto mais simples.</p>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-arcane-border bg-black/20 px-3 py-2 text-sm"><span>✨ Animações de combate</span><input type="checkbox" checked={animations} onChange={e => setAnimationsValue(e.target.checked)} className="h-4 w-4 accent-arcane-gold" /></label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-arcane-border bg-black/20 px-3 py-2 text-sm"><span>💥 Efeitos visuais e marcadores de HIT</span><input type="checkbox" checked={effects} onChange={e => setEffectsValue(e.target.checked)} className="h-4 w-4 accent-arcane-gold" /></label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-arcane-border bg-black/20 px-3 py-2 text-sm"><span>🔊 Música geral</span><input type="checkbox" checked={sound} onChange={e => setSoundValue(e.target.checked)} className="h-4 w-4 accent-arcane-gold" /></label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-arcane-border bg-black/20 px-3 py-2 text-sm"><span>⚔️ Sons de ataques e combos</span><input type="checkbox" checked={combatSfx} onChange={e => setSfxValue(e.target.checked)} className="h-4 w-4 accent-arcane-gold" /></label>
        </section>
        <div className="mt-5 flex justify-end"><button type="button" onClick={onClose} className="rounded-lg bg-arcane-gold px-4 py-2 font-bold text-black hover:brightness-110">Concluído</button></div>
      </div>
    </div>
  );
}
