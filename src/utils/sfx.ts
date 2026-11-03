let lastSfxAt = 0;

/** Efeitos curtos de combate, respeitando o mute/volume da interface. */
export function playCombatSfx(kind: "hit" | "beast" = "hit") {
  if (typeof window === "undefined" || localStorage.getItem("mythreon_mute") === "true" || localStorage.getItem("mythreon_sfx_enabled") === "false") return;
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

type AttackSfxProfile = { frequency: number; wave: OscillatorType; duration: number; detune?: number };

const ATTACK_SFX: Record<string, AttackSfxProfile> = {
  A1: { frequency: 150, wave: "sawtooth", duration: .12 }, A2: { frequency: 330, wave: "square", duration: .10 },
  A3: { frequency: 520, wave: "sine", duration: .18 }, A4: { frequency: 115, wave: "triangle", duration: .14 },
  A5: { frequency: 260, wave: "square", duration: .13 }, A6: { frequency: 420, wave: "sawtooth", duration: .09 },
  A7: { frequency: 210, wave: "triangle", duration: .12 }, A8: { frequency: 105, wave: "sawtooth", duration: .16 },
  A9: { frequency: 80, wave: "square", duration: .20 }, A10: { frequency: 600, wave: "triangle", duration: .10 },
  A11: { frequency: 740, wave: "sine", duration: .18 }, A12: { frequency: 190, wave: "sawtooth", duration: .17 },
  A13: { frequency: 880, wave: "square", duration: .11 }, A14: { frequency: 125, wave: "sawtooth", duration: .19 },
  A15: { frequency: 980, wave: "sine", duration: .24 }, A16: { frequency: 230, wave: "square", duration: .17 },
  A17: { frequency: 680, wave: "sawtooth", duration: .10 }, A18: { frequency: 460, wave: "sine", duration: .22 },
  A19: { frequency: 175, wave: "triangle", duration: .20 }, A20: { frequency: 95, wave: "sawtooth", duration: .28 },
};

/** Efeito procedural por componente de Ataque; não depende de arquivos de áudio externos. */
export function playAttackSfx(attackId?: string, combo = false) {
  if (typeof window === "undefined" || localStorage.getItem("mythreon_mute") === "true" || localStorage.getItem("mythreon_sfx_enabled") === "false") return;
  const Ctx = window.AudioContext;
  if (!Ctx) return;
  try {
    const context = new Ctx();
    const profile = ATTACK_SFX[attackId ?? ""] ?? { frequency: 320, wave: "square" as OscillatorType, duration: .1 };
    const now = context.currentTime;
    const volume = Number(localStorage.getItem("mythreon_volume") ?? 0.45) * (combo ? 0.22 : 0.10);
    const playTone = (frequency: number, offset: number, length: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = profile.wave;
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      if (combo) oscillator.detune.setValueAtTime(offset === 0 ? -12 : 12, now + offset);
      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.002, volume), now + offset + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + length);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset); oscillator.stop(now + offset + length + 0.02);
    };
    playTone(profile.frequency * (combo ? 1.25 : 1), 0, profile.duration);
    if (combo) playTone(profile.frequency * 1.5, Math.min(.13, profile.duration * .65), profile.duration * .8);
    window.setTimeout(() => context.close().catch(() => undefined), 500);
  } catch { /* áudio é opcional e nunca deve interromper a caça */ }
}
