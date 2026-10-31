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

  const imagePath = `/assets/items/${item.templateId}.png`;

  if (hasError) {
    // Se a imagem não existir na pasta, mostra o emoji como fallback
    return <div className={className} style={style}>{item.icon}</div>;
  }

  return (
    <AssetImage
      src={imagePath}
      alt={item.name}
      className={`${className} object-contain`}
      style={style}
      onAllSourcesFail={() => setHasError(true)}
    />
  );
}
