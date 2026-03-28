import { useState } from "react";
import { Bell, Download, Trash2, ChevronRight } from "lucide-react";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleExportData = () => {
    alert("Export functionality would be implemented here");
  };

  const handleDeleteAll = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all applications? This cannot be undone."
      )
    ) {
      alert("All applications deleted");
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-semibold text-primary-text mb-6">Settings</h1>

      <div className="space-y-2">
        {/* Notifications */}
        <div className="bg-white rounded-[12px] p-4 flex items-center justify-between mb-3 border border-[#F0F0F0]">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-primary" />
            <div>
              <div className="font-medium text-primary-text">Notifications</div>
              <div className="text-xs text-secondary-text mt-1">
                Interview reminders and updates
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Export Data */}
        <button
          onClick={handleExportData}
          className="w-full bg-white rounded-[12px] p-4 flex items-center justify-between border border-[#F0F0F0] hover:bg-[#F9FAFB] transition mb-3"
        >
          <div className="flex items-center gap-3">
            <Download size={20} className="text-primary" />
            <div className="text-left">
              <div className="font-medium text-primary-text">Export Data</div>
              <div className="text-xs text-secondary-text mt-1">
                Download your applications as CSV
              </div>
            </div>
          </div>
          <ChevronRight size={20} className="text-secondary-text" />
        </button>

        {/* Delete All Applications */}
        <button
          onClick={handleDeleteAll}
          className="w-full bg-white rounded-[12px] p-4 flex items-center justify-between border border-[#F0F0F0] hover:bg-[#FEE2E2] transition mb-3"
        >
          <div className="flex items-center gap-3">
            <Trash2 size={20} className="text-error" />
            <div className="text-left">
              <div className="font-medium text-error">Delete All Applications</div>
              <div className="text-xs text-secondary-text mt-1">
                Permanently remove all data
              </div>
            </div>
          </div>
          <ChevronRight size={20} className="text-secondary-text" />
        </button>

        {/* App Version */}
        <div className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-[#F0F0F0]">
          <div>
            <div className="font-medium text-primary-text">App Version</div>
            <div className="text-xs text-secondary-text mt-1">
              1.0.0
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
        <p className="text-xs text-secondary-text">
          Built with care for your job search journey
        </p>
      </div>
    </div>
  );
}
