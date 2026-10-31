const POTION_GOLD_BY_TIER = [30, 110, 320, 900, 2600];

export function getPotionUsePrice(templateId?: string | null): number {
  if (!templateId) return 0;
  const match = templateId.match(/_(\d+)$/);
  if (!match) return 0;
  const tier = Number(match[1]);
  return POTION_GOLD_BY_TIER[tier - 1] ?? 0;
}
