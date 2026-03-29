export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface SyncAdapter {
  syncNow: () => Promise<{ success: boolean; message: string }>;
}

export class LocalOnlySyncAdapter implements SyncAdapter {
  async syncNow() {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      message: "Local-first mode enabled. Cloud sync adapter can be plugged in later.",
    };
  }
}

export const syncAdapter = new LocalOnlySyncAdapter();
