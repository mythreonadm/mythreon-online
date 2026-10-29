import { BuffVialTemplate } from "../types";

export const VIALS: Record<string, BuffVialTemplate> = {
  VIAL_TITAN_1: { id: "VIAL_TITAN_1", name: "Vial do Titã I", description: "+15 Força (ATK) por 15 min", durationMinutes: 15, icon: "🧪", stats: { atk: 15 }, price: 500 },
  VIAL_SAGE_1: { id: "VIAL_SAGE_1", name: "Vial do Sábio I", description: "+15 Inteligência (MATK) por 15 min", durationMinutes: 15, icon: "🧪", stats: { matk: 15 }, price: 500 },
  VIAL_SHADOW_1: { id: "VIAL_SHADOW_1", name: "Vial da Sombra I", description: "+5% Crítico e +5% Precisão por 15 min", durationMinutes: 15, icon: "🧪", stats: { crit: 0.05, hit: 0.05 }, price: 500 },
  VIAL_GALE_1: { id: "VIAL_GALE_1", name: "Vial da Ventania I", description: "+10% Vel. Ataque (SPD) por 15 min", durationMinutes: 15, icon: "🧪", stats: { spd: 0.10 }, price: 500 },
  VIAL_AEGIS_1: { id: "VIAL_AEGIS_1", name: "Vial da Égide I", description: "+20 Armadura e +100 Vida por 15 min", durationMinutes: 15, icon: "🧪", stats: { arm: 20, hp: 100 }, price: 500 },

  VIAL_TITAN_2: { id: "VIAL_TITAN_2", name: "Vial do Titã II", description: "+40 Força (ATK) por 30 min", durationMinutes: 30, icon: "⚗️", stats: { atk: 40 }, price: 2500 },
  VIAL_SAGE_2: { id: "VIAL_SAGE_2", name: "Vial do Sábio II", description: "+40 Inteligência (MATK) por 30 min", durationMinutes: 30, icon: "⚗️", stats: { matk: 40 }, price: 2500 },
  VIAL_SHADOW_2: { id: "VIAL_SHADOW_2", name: "Vial da Sombra II", description: "+10% Crítico e +10% Precisão por 30 min", durationMinutes: 30, icon: "⚗️", stats: { crit: 0.10, hit: 0.10 }, price: 2500 },
  VIAL_GALE_2: { id: "VIAL_GALE_2", name: "Vial da Ventania II", description: "+20% Vel. Ataque (SPD) por 30 min", durationMinutes: 30, icon: "⚗️", stats: { spd: 0.20 }, price: 2500 },
  VIAL_AEGIS_2: { id: "VIAL_AEGIS_2", name: "Vial da Égide II", description: "+50 Armadura e +300 Vida por 30 min", durationMinutes: 30, icon: "⚗️", stats: { arm: 50, hp: 300 }, price: 2500 },

  VIAL_TITAN_3: { id: "VIAL_TITAN_3", name: "Vial do Titã III", description: "+100 Força (ATK) por 60 min", durationMinutes: 60, icon: "🔮", stats: { atk: 100 }, price: 10000 },
  VIAL_SAGE_3: { id: "VIAL_SAGE_3", name: "Vial do Sábio III", description: "+100 Inteligência (MATK) por 60 min", durationMinutes: 60, icon: "🔮", stats: { matk: 100 }, price: 10000 },
  VIAL_SHADOW_3: { id: "VIAL_SHADOW_3", name: "Vial da Sombra III", description: "+15% Crítico e +15% Precisão por 60 min", durationMinutes: 60, icon: "🔮", stats: { crit: 0.15, hit: 0.15 }, price: 10000 },
  VIAL_GALE_3: { id: "VIAL_GALE_3", name: "Vial da Ventania III", description: "+30% Vel. Ataque (SPD) por 60 min", durationMinutes: 60, icon: "🔮", stats: { spd: 0.30 }, price: 10000 },
  VIAL_AEGIS_3: { id: "VIAL_AEGIS_3", name: "Vial da Égide III", description: "+100 Armadura e +800 Vida por 60 min", durationMinutes: 60, icon: "🔮", stats: { arm: 100, hp: 800 }, price: 10000 },
};