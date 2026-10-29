import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { ZONES } from "../data/zones";

export function AudioManager() {
  const { isTickRunning, currentZoneId } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Inicializa o áudio apenas uma vez
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    // Recupera a preferência salva
    const savedMute = localStorage.getItem("mythreon_mute") === "true";
    setIsMuted(savedMute);
    audioRef.current.muted = savedMute;
  }, []);

  // Lógica para trocar a música baseada no estado do jogo
  useEffect(() => {
    if (!audioRef.current) return;

    let trackName = "home";
    
    // Se estiver caçando, usa o tema da zona. Se não, usa a música da casa.
    if (isTickRunning) {
      trackName = ZONES[currentZoneId]?.theme || "forest";
    }

    const trackPath = `/assets/music/${trackName}.mp3`;
    
    // Se a música atual já é a correta, não faz nada (evita reiniciar do zero)
    if (audioRef.current.src.includes(trackPath)) return;

    audioRef.current.src = trackPath;
    
    // Tenta tocar (o navegador pode bloquear se não houver clique do usuário)
    audioRef.current.play().catch((err) => {
      console.log("Áudio bloqueado pelo navegador até que o jogador interaja.", err);
    });
  }, [isTickRunning, currentZoneId]);

  // Função para mutar/desmutar
  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    audioRef.current.muted = newMute;
    localStorage.setItem("mythreon_mute", String(newMute));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={toggleMute} 
        className="bg-arcane-panel border-2 border-arcane-border hover:border-arcane-gold p-3 rounded-full shadow-2xl text-2xl transition-all hover:scale-110 flex items-center justify-center"
        title={isMuted ? "Ativar Som" : "Desativar Som"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}