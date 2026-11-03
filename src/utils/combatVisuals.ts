export function getSpellEffect(ataqueId: string) {
  switch(ataqueId) {
    case "A1": return "🦷";
    case "A2": return "🐝";
    case "A3": return "🔥";
    case "A4": return "🐾";
    case "A5": return "🐍";
    case "A6": return "🗡️";
    case "A7": return "🌿";
    case "A8": return "🦴";
    case "A9": return "🪨";
    case "A10": return "🪶";
    case "A16": return "☣️";
    case "A17": return "🪽";
    case "A18": return "🪢";
    case "A19": return "🦷";
    case "A20": return "👑";
    default: return "✨";
  }
}

export function getWeaponAnimation(weaponId?: string) {
  if (!weaponId) return "animate-swing"; // Padrão
  if (weaponId.includes("ARCO")) return "animate-shoot";
  if (weaponId.includes("CAJADO") || weaponId.includes("VARINHA")) return "animate-cast";
  return "animate-swing"; // Espadas e Machados
}
