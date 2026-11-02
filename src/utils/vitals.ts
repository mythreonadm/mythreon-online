/** One presentation rule for every HP/MP bar; combat keeps fractional precision. */
export function vitalValue(value: number): number { return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0; }
export function vitalPercent(current: number, maximum: number): number {
 return Number.isFinite(current) && Number.isFinite(maximum) && maximum > 0 ? Math.max(0,Math.min(100,current/maximum*100)) : 0;
}
export function formatVital(value: number): string { return vitalValue(value).toLocaleString('pt-BR'); }
