let lastSfxAt = 0;

/** Efeitos curtos de combate, respeitando o mute/volume da interface. */
export function playCombatSfx(kind: "hit" | "beast" = "hit") {
  if (typeof window === "undefined" || localStorage.getItem("mythreon_mute") === "true") return;
  const now = Date.now();
  if (now - lastSfxAt < 180) return;
  lastSfxAt = now;
  const audio = new Audio(`/assets/sfx/${kind}.mp3`);
  audio.volume = Number(localStorage.getItem("mythreon_volume") ?? 0.45) * (kind === "beast" ? 0.8 : 0.55);
  audio.onerror = () => {
    // Fallback curto enquanto os assets finais não forem adicionados.
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "beast" ? "triangle" : "square";
      oscillator.frequency.value = kind === "beast" ? 180 : 320;
      gain.gain.value = audio.volume * 0.08;
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + 0.07);
    } catch { /* áudio opcional */ }
  };
  audio.play().catch(() => undefined);
}
