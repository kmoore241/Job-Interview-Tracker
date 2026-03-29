import { useState } from "react";
import { Bell, ChevronRight, Download, Info, Shield, Trash2 } from "lucide-react";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleExportData = () => {
    alert("Export functionality would be implemented here");
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all applications? This cannot be undone.")) {
      alert("All applications deleted");
    }
  };

  return (
    <div className="page-container space-y-6">
      <header>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage reminders, data, and app preferences.</p>
      </header>

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
                <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} className="sr-only peer" />
                <div className="h-6 w-11 rounded-full bg-[#dbe2eb] peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="group-label">Data</p>
        <div className="surface-card p-2">
          <button onClick={handleExportData} className="form-row w-full text-left">
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

          <button onClick={handleDeleteAll} className="form-row form-row-divider w-full text-left">
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
                <p className="text-xs text-[#6b7280]">Version 2.0 · Mobile-first redesign</p>
              </div>
            </div>
          </div>
          <div className="form-row form-row-divider">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><Shield size={16} /></div>
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">Privacy-first architecture</p>
                <p className="text-xs text-[#6b7280]">Ready for future auth and cloud sync integrations</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
