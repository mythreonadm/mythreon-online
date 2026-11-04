export {};

declare global {
  type MythreonDesktopUpdateManifest = {
    version: string;
    url: string;
    sha256: string;
    notes: string;
    mandatory: boolean;
    platform: string;
    arch: string;
  };

  type MythreonDesktopUpdateResult = {
    status?: "checking" | "available" | "downloaded" | "unavailable" | "error";
    available?: boolean;
    downloaded?: boolean;
    currentVersion?: string;
    downloadPath?: string;
    error?: string;
    manifest?: MythreonDesktopUpdateManifest;
  };

  interface Window {
    mythreonDesktop?: {
      isDesktop: true;
      checkForUpdate: () => Promise<MythreonDesktopUpdateResult>;
      downloadUpdate: () => Promise<MythreonDesktopUpdateResult>;
      openUpdate: () => Promise<{ ok: boolean; error?: string }>;
      onUpdate: (callback: (payload: MythreonDesktopUpdateResult) => void) => () => void;
    };
  }
}
