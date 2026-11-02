// Parâmetros compartilhados do combate. Unidades de regeneração: pontos por tick de 3 s.
export const BALANCE = {
  resistanceCap: 0.60,
  armorCap: 0.70,
  killRecovery: 0.02,
  equipmentDrop: 0.18,
  bossEquipmentDrop: 0.65,
};
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function mitigatedDamage(raw: number, armor: number): number {
  if (raw <= 0) return 0;
  const reduction = clamp(Math.max(0, armor) / (Math.max(0, armor) + raw + 40), 0, BALANCE.armorCap);
  return Math.max(1, raw * (1 - reduction));
}
