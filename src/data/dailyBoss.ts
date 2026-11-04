import { ZONES } from "./zones";

export type DailyBossStatus = "open" | "defeated" | "expired";

export interface DailyBossTemplate {
  id: string;
  enemyId: string;
  name: string;
  title: string;
  element?: string;
  level: number;
  baseHpMultiplier: number;
}

export const DAILY_BOSS_TEMPLATES: DailyBossTemplate[] = [
  { id: "DAILY_BRASA", enemyId: "ESPECTRO", name: "Espectro de Brasa", title: "A Fagulha que Recusa o Fim", element: "FOGO", level: 15, baseHpMultiplier: 120 },
  { id: "DAILY_COLOSSO", enemyId: "COLOSSO", name: "Colosso de Dhor", title: "A Montanha em Movimento", element: "TERRA", level: 24, baseHpMultiplier: 100 },
  { id: "DAILY_LEVIATA", enemyId: "LEVIATA", name: "Leviatã de Azhar", title: "O Eco sob as Marés", element: "AGUA", level: 43, baseHpMultiplier: 85 },
  { id: "DAILY_MATRIARCA", enemyId: "MATRIARCA_LODO", name: "Matriarca do Lodo", title: "A Raiz que Lembra", element: "VENENO", level: 44, baseHpMultiplier: 85 },
  { id: "DAILY_SENTINELA", enemyId: "SENTINELA_ZENITE", name: "Sentinela do Zênite", title: "O Olho sobre as Dunas", element: "METAL", level: 68, baseHpMultiplier: 70 },
  { id: "DAILY_DEVORADOR", enemyId: "DEVORADOR", name: "Devorador da Cicatriz", title: "A Fome entre os Ecos", element: "MORTE", level: 95, baseHpMultiplier: 55 },
];

export function dailyCycleKey(date = new Date()): string {
  const utc = new Date(date);
  const segment = utc.getUTCHours() < 8 ? "M" : utc.getUTCHours() < 16 ? "T" : "N";
  return `${utc.toISOString().slice(0, 10)}-${segment}`;
}

export function dailyBossTemplate(cycle = dailyCycleKey()): DailyBossTemplate {
  let hash = 0;
  for (const char of cycle) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return DAILY_BOSS_TEMPLATES[hash % DAILY_BOSS_TEMPLATES.length];
}

export function findBossEnemy(template: DailyBossTemplate) {
  return Object.values(ZONES).flatMap(zone => zone.enemies).find(enemy => enemy.id === template.enemyId);
}
