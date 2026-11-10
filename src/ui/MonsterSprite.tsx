import { useEffect, useRef, useState } from "react";
import type { Enemy } from "../types";
import { monsterAtlasCell, type MonsterAtlasCell } from "../data/monsterAtlases";
import { AssetImage } from "./AssetImage";

const urls = import.meta.glob<string>([
  "../../imagens/monstros/*.jfif",
  "!../../imagens/monstros/{party hunt,gargula,enguia}.jfif",
], { query: "?url", import: "default", eager: true });
const sheets = new Map<string, Promise<HTMLImageElement>>();
const frames = new Map<string, HTMLCanvasElement>();

function loadSheet(file: string) {
  const cached = sheets.get(file);
  if (cached) return cached;
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const url = urls[`../../imagens/monstros/${file}.jfif`];
    if (!url) { reject(Error("Prancha ausente")); return; }
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(Error("Prancha indisponível"));
    image.src = url;
  });
  sheets.set(file, pending);
  if (sheets.size > 4) sheets.delete(sheets.keys().next().value!);
  return pending;
}

function sheetCell(image: HTMLImageElement, cell: MonsterAtlasCell) {
  const atlas = document.createElement("canvas");
  atlas.width = Math.min(688, image.naturalWidth);
  atlas.height = Math.round(atlas.width * image.naturalHeight / image.naturalWidth);
  const context = atlas.getContext("2d", { willReadFrequently: true });
  if (!context) return;
  const { width, height } = atlas;
  context.drawImage(image, 0, 0, width, height);
  const top = Math.floor(height * cell.top);
  const bottom = Math.floor(height * cell.bottom);
  const source = context.getImageData(0, top, width, bottom - top);
  const { data, height: artHeight } = source;
  const size = width * artHeight;
  const background = [0, 1, 2].map(channel => {
    const samples = [0.025, 0.065, 0.1, 0.9, 0.935, 0.975].flatMap(x =>
      [0.02, 0.06, 0.14].map(y => data[(Math.floor(y * artHeight) * width + Math.floor(x * width)) * 4 + channel])
    );
    samples.sort((a, b) => a - b);
    return samples[samples.length >> 1];
  });
  const distance = new Uint8Array(size);
  const columnWeight = new Float32Array(width);
  const [red, green, blue] = background;
  for (let i = 0; i < size; i++) {
    const p = i * 4;
    const delta = Math.max(Math.abs(red - data[p]), Math.abs(green - data[p + 1]), Math.abs(blue - data[p + 2]));
    distance[i] = delta;
    columnWeight[i % width] += Math.min(45, Math.max(0, delta - 18));
  }

  let left = 0;
  let right = width;
  if (!cell.portrait) {
    // Find the gaps between the five poses. Later forms can be wider than the earlier ones.
    const cuts = [0, ...[0.164, 0.355, 0.543, 0.731].map((estimate, index) => {
      const expected = Math.round(estimate * width);
      const radius = Math.floor(width * (index === 0 ? 0.065 : 0.071));
      let best = expected;
      let bestCost = Infinity;
      for (let x = expected - radius; x <= expected + radius; x++) {
        const cost = columnWeight[x - 1] + columnWeight[x] + columnWeight[x + 1] + Math.abs(x - expected) * 12;
        if (cost < bestCost) { bestCost = cost; best = x; }
      }
      return best;
    }), width];
    left = cuts[cell.index];
    right = cuts[cell.index + 1];
  }

  // Only clear the backdrop reachable from the cell edges. Dark pixels enclosed
  // by the creature's outline are part of the art.
  const visited = new Uint8Array(size);
  const queue = new Int32Array((right - left) * artHeight);
  let length = 0;
  function visit(x: number, y: number) {
    if (x < left || x >= right || y < 0 || y >= artHeight) return;
    const i = y * width + x;
    if (visited[i] || distance[i] > 27) return;
    visited[i] = 1;
    queue[length++] = i;
    data[i * 4 + 3] = Math.max(0, (distance[i] - 15) * 17);
  }
  for (let x = left; x < right; x++) { visit(x, 0); visit(x, artHeight - 1); }
  for (let y = 0; y < artHeight; y++) { visit(left, y); visit(right - 1, y); }
  for (let i = 0; i < length; i++) {
    const x = queue[i] % width;
    const y = Math.floor(queue[i] / width);
    visit(x - 1, y); visit(x + 1, y); visit(x, y - 1); visit(x, y + 1);
  }
  if (!cell.portrait) {
    // Adjacent drawings can spill across a cut. Remove detached side fragments.
    visited.fill(0);
    const fragments: number[][] = [];
    let largest = 0;
    for (let y = 0; y < artHeight; y++) for (let x = left; x < right; x++) {
      const start = y * width + x;
      if (visited[start] || data[start * 4 + 3] < 80) continue;
      const pixels = [start];
      visited[start] = 1;
      let side = false;
      function enqueue(i: number) {
        if (visited[i] || data[i * 4 + 3] < 80) return;
        visited[i] = 1; pixels.push(i);
      }
      for (let p = 0; p < pixels.length; p++) {
        const i = pixels[p];
        const column = i % width;
        side ||= column <= left + 1 || column >= right - 2;
        if (column > left) enqueue(i - 1);
        if (column + 1 < right) enqueue(i + 1);
        if (i >= width) enqueue(i - width);
        if (i + width < size) enqueue(i + width);
      }
      largest = Math.max(largest, pixels.length);
      if (side) fragments.push(pixels);
    }
    for (const pixels of fragments) {
      if (pixels.length < largest * 0.32) for (const i of pixels) data[i * 4 + 3] = 0;
    }
  }
  let x0 = right, x1 = left, y0 = artHeight, y1 = 0;
  for (let y = 0; y < artHeight; y++) for (let x = left; x < right; x++) {
    if (data[(y * width + x) * 4 + 3] < 160) continue;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x);
    y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  if (x1 - x0 < 8 || y1 - y0 < 8) return;
  const frame = document.createElement("canvas");
  frame.width = x1 - x0 + 1;
  frame.height = y1 - y0 + 1;
  frame.getContext("2d")?.putImageData(source, -x0, -y0, x0, y0, frame.width, frame.height);
  return frame;
}

const ART_CLASS = "h-full w-full object-contain object-bottom [image-rendering:pixelated]";

export function MonsterSprite({ enemy, baseSprite, preferAnimated }: {
  enemy: Pick<Enemy, "id" | "name" | "sprite" | "emoji">;
  baseSprite?: string;
  preferAnimated: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [readyId, setReadyId] = useState<string>();
  const [imageError, setImageError] = useState(false);
  const { id, name, sprite, emoji } = enemy;
  const ready = readyId === id;
  // Lobo already has five independent PNGs. Other families can display their
  // base portrait while the atlas is fetched or when a new sheet is missing.
  const fallback = id.startsWith("LOBO_") ? sprite : baseSprite ?? sprite;
  useEffect(() => {
    const cell = monsterAtlasCell(id);
    if (!cell) return;
    let cancelled = false;
    loadSheet(cell.file).then(image => {
      const target = canvas.current;
      if (!target || cancelled) return;
      const frameKey = `${cell.file}:${cell.index}`;
      const frame = frames.get(frameKey) ?? sheetCell(image, cell);
      const context = target.getContext("2d");
      if (!frame || !context) return;
      frames.set(frameKey, frame);
      if (frames.size > 20) frames.delete(frames.keys().next().value!);
      target.width = frame.width;
      target.height = frame.height;
      context.drawImage(frame, 0, 0);
      setReadyId(id);
    }).catch(() => { /* the original PNG or icon remains visible */ });
    return () => { cancelled = true; };
  }, [id]);
  return <>
    <canvas ref={canvas} className={ART_CLASS} hidden={!ready} role="img" aria-label={name} data-monster-atlas={ready ? id : undefined} />
    {!ready && (fallback && !imageError
      ? <AssetImage src={fallback} fallbackSrc={fallback !== baseSprite ? baseSprite : undefined} preferAnimated={preferAnimated} alt={name} className={ART_CLASS} onAllSourcesFail={() => setImageError(true)} />
      : <span className="text-[80px] md:text-[120px] leading-none select-none drop-shadow-lg" role="img" aria-label={name}>{emoji || "👾"}</span>)}
  </>;
}
