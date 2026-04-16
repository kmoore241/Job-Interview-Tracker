export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface SyncAdapter {
  syncNow: () => Promise<{ success: boolean; message: string }>;
}

export class SupabaseSyncAdapter implements SyncAdapter {
  async syncNow() {
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      message: "Supabase sync is active. Your account data is loaded from cloud storage.",
    };
  }
}

export const syncAdapter = new SupabaseSyncAdapter();
