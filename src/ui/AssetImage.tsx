import React, { useEffect, useState } from "react";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
  pixelated?: boolean;
  preferAnimated?: boolean;
  removeWhite?: boolean;
  onAllSourcesFail?: () => void;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

/** Prefer animated .gif assets, then fall back to the supplied file and its .png counterpart. */
export function AssetImage({ src, fallbackSrc, pixelated = true, preferAnimated = !src.startsWith("/assets/players/"), removeWhite = false, style, onAllSourcesFail, onError, ...props }: Props) {
  const candidates = React.useMemo(() => {
    const isLocalAsset = src.startsWith("/assets/");
    const stem = src.replace(/\.(png|giff?|jpe?g|webp|avif)$/i, "");
    const extension = src.match(/\.(png|giff?|jpe?g|webp|avif)$/i)?.[1]?.toLowerCase();
    const slash = stem.lastIndexOf("/");
    const base = stem.slice(slash + 1);
    const titleStem = stem.slice(0, slash + 1) + base.charAt(0).toUpperCase() + base.slice(1);
    const list = isLocalAsset && extension
      ? [...(!preferAnimated ? [stem + ".png", titleStem + ".png", src] : []), stem + ".gif", titleStem + ".gif", stem + ".giff", titleStem + ".giff", src, stem + ".png", titleStem + ".png", ...(fallbackSrc ? [fallbackSrc] : [])]
      : [src, ...(fallbackSrc ? [fallbackSrc] : [])];
    return [...new Set(list)];
  }, [src, fallbackSrc, preferAnimated]);
  const [attempt, setAttempt] = useState({ src: "", index: 0 });
  const index = attempt.src === src ? attempt.index : 0;
  useEffect(() => { if (index >= candidates.length) onAllSourcesFail?.(); }, [index, candidates.length, onAllSourcesFail]);

  if (index >= candidates.length) return null;
  return <img {...props} src={candidates[index]} style={{ ...(pixelated ? { imageRendering: "pixelated" } : {}), ...(removeWhite ? { mixBlendMode: "multiply" as const } : {}), ...style }} onError={(event) => {
    if (index + 1 < candidates.length) setAttempt({ src, index: index + 1 });
    else { setAttempt({ src, index: candidates.length }); onError?.(event); }
  }} />;
}
