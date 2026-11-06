import React, { useEffect, useState } from "react";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string | string[];
  pixelated?: boolean;
  preferAnimated?: boolean;
  removeWhite?: boolean;
  onAllSourcesFail?: () => void;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

/**
 * Prefer animated .gif assets, then fall back to the supplied file and its
 * static counterparts. This is intentionally shared by every visual asset:
 * maps, monsters, players, pets, items, UI art and profession scenes.
 */
export function AssetImage({ src, fallbackSrc, pixelated = true, preferAnimated = true, removeWhite = false, style, onAllSourcesFail, onError, ...props }: Props) {
  const candidates = React.useMemo(() => {
    const isRemote = /^(?:data:|blob:|https?:|mailto:)/i.test(src);
    const isSameOriginUrl = (() => {
      if (!isRemote || typeof window === "undefined") return false;
      try { return new URL(src, window.location.href).origin === window.location.origin; } catch { return false; }
    })();
    const isLocalAsset = !isRemote || isSameOriginUrl;
    const queryIndex = src.search(/[?#]/);
    const path = queryIndex >= 0 ? src.slice(0, queryIndex) : src;
    const suffix = queryIndex >= 0 ? src.slice(queryIndex) : "";
    const stem = path.replace(/\.(png|giff?|jpe?g|webp|avif)$/i, "");
    const slash = stem.lastIndexOf("/");
    const base = stem.slice(slash + 1);
    const titleStem = stem.slice(0, slash + 1) + base.charAt(0).toUpperCase() + base.slice(1);
    const withSuffix = (candidate: string) => `${candidate}${suffix}`;
    const fallbacks = Array.isArray(fallbackSrc) ? fallbackSrc : fallbackSrc ? [fallbackSrc] : [];
    const animated = [withSuffix(`${stem}.gif`), withSuffix(`${titleStem}.gif`), withSuffix(`${stem}.giff`), withSuffix(`${titleStem}.giff`)];
    const staticImages = [withSuffix(`${stem}.png`), withSuffix(`${titleStem}.png`)];
    const list = isLocalAsset
      ? (preferAnimated ? [...animated, src, ...staticImages, ...fallbacks] : [...staticImages, src, ...animated, ...fallbacks])
      : [src, ...fallbacks];
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
