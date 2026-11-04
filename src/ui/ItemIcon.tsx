import { rarityArtClass } from './itemRarity';
import React, { useState, useEffect } from "react";
import { Item } from "../types";
import { AssetImage } from "./AssetImage";

interface Props {
  item: Item;
  className?: string;
  style?: React.CSSProperties;
}

export function ItemIcon({ item, className = "text-3xl mb-1", style }: Props) {
  const [hasError, setHasError] = useState(false);

  // Reseta o erro se o item mudar (ex: na troca de um equipamento)
  useEffect(() => {
    setHasError(false);
  }, [item.templateId]);

  const imagePath = `/assets/items/${item.templateId === "SKIN_CAPA_PRIMEIRO_CANTO" ? "SKIN_PREMIUM_MES_01" : item.templateId === "ISCA_CICATRIZ" ? "ISCA_RARA" : item.templateId}.png`;

  const aura = rarityArtClass(item.rarity);
  if (hasError) {
    // Se a imagem não existir na pasta, mostra o emoji como fallback
    return <span className={`${className} ${aura}`} style={style} data-rarity={item.rarity}><span className="rarity-image rarity-emoji">{item.icon}</span></span>;
  }

  return (
    <span className={`${className} ${aura}`} style={style} data-rarity={item.rarity}><AssetImage
      src={imagePath}
      alt={item.name}
      className="rarity-image h-full w-full object-contain"
      onAllSourcesFail={() => setHasError(true)}
    /></span>
  );
}
