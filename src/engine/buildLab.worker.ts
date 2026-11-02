import { analyzeBuild } from "./buildLab";
import { Character, Race } from "../types";

self.onmessage = (event: MessageEvent<{ character: Character; zoneId: string; races?: Race[]; compareCollection?: boolean }>) => {
  try {
    const report = analyzeBuild(event.data.character, event.data.zoneId, message => self.postMessage({ type: "progress", message }), event.data.races ?? [], event.data.compareCollection ?? false);
    self.postMessage({ type: "result", report });
  } catch (error) { self.postMessage({ type: "error", message: error instanceof Error ? error.message : "Falha na simulação." }); }
};
