import { useState } from "react";
import { Bell, ChevronRight, Cloud, Download, Info, Shield, Trash2 } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import { syncAdapter, SyncStatus } from "@/services/sync";
import { isNativePlatform } from "@/lib/platform";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { clearAllApplications } = useApplications();

  const handleExportData = () => {
    setStatusMessage("Export functionality is stubbed and ready for CSV implementation.");
  };

  const handleSyncNow = async () => {
    setSyncStatus("syncing");
    const result = await syncAdapter.syncNow();
    setSyncStatus(result.success ? "success" : "error");
    setStatusMessage(result.message);
  };

  return (
    <div className="page-container space-y-6">
      <header>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage reminders, data, and app preferences.</p>
      </header>

      {statusMessage && (
        <div className={`rounded-2xl px-4 py-3 text-xs ${syncStatus === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`} role="status" aria-live="polite">
          {statusMessage}
        </div>
      )}

      <section>
        <p className="group-label">Preferences</p>
        <div className="surface-card p-2">
          <div className="form-row">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-primary"><Bell size={16} /></div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">Notifications</p>
                  <p className="text-xs text-[#6b7280]">Interview reminders and updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} className="sr-only peer" aria-label="Enable notifications" />
                <div className="h-6 w-11 rounded-full bg-[#dbe2eb] peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="group-label">Data & sync</p>
        <div className="surface-card p-2">
          <button onClick={handleExportData} className="form-row w-full text-left" aria-label="Export data">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><Download size={16} /></div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">Export data</p>
                  <p className="text-xs text-[#6b7280]">Download your applications as CSV</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#9aa3b2]" />
            </div>
          </button>

          <button onClick={handleSyncNow} className="form-row form-row-divider w-full text-left" aria-label="Sync now">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-primary"><Cloud size={16} /></div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">Sync now</p>
                  <p className="text-xs text-[#6b7280]">Future-ready hook for cloud sync providers</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#64748b]">{syncStatus === "syncing" ? "Syncing..." : "Local"}</span>
            </div>
          </button>

          <button onClick={() => setShowDeleteConfirm(true)} className="form-row form-row-divider w-full text-left" aria-label="Delete all applications">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600"><Trash2 size={16} /></div>
                <div>
                  <p className="text-sm font-semibold text-rose-700">Delete all applications</p>
                  <p className="text-xs text-[#6b7280]">Permanently remove tracker data</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#9aa3b2]" />
            </div>
          </button>
        </div>
      </section>

      <section>
        <p className="group-label">App info</p>
        <div className="surface-card p-2">
          <div className="form-row">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><Info size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">Job Interview Tracker</p>
                <p className="text-xs text-[#6b7280]">Version 2.1 · App Store polish pass</p>
              </div>
            </div>
          </div>
          <div className="form-row form-row-divider">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><Shield size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">Platform mode</p>
                <p className="text-xs text-[#6b7280]">{isNativePlatform() ? "Running in native shell" : "Running in web mode"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete all applications?"
        description="This removes all job applications and interview entries from local storage."
        confirmLabel="Delete All"
        tone="danger"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          clearAllApplications();
          setShowDeleteConfirm(false);
          setStatusMessage("All application records were removed.");
          setSyncStatus("success");
        }}
      />
    </div>
  );
}
