import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import ApplicationCard from "@/components/ApplicationCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useApplications } from "@/context/ApplicationContext";
import { STATUS_ORDER } from "@/lib/status";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | (typeof STATUS_ORDER)[number]>("All");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Company">("Newest");
  const { applications, deleteApplication } = useApplications();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { applications, deleteApplication, isHydrating, persistenceError } = useApplications();

  const filteredApplications = useMemo(() => {
    const base = applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" ? true : app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return [...base].sort((a, b) => {
      if (sortOrder === "Company") {
        return a.company.localeCompare(b.company);
      }
      return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
    });
  }, [applications, searchQuery, statusFilter, sortOrder]);

  const pendingApp = pendingDeleteId ? applications.find((a) => a.id === pendingDeleteId) : null;

  return (
    <div className="page-container space-y-5">
      <header>
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Search, filter, and track every role in your pipeline.</p>
      </header>

      {persistenceError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800" role="alert">
          {persistenceError}
        </div>
      )}

      <div className="surface-card p-3 space-y-3">
        <div className="flex items-center gap-2 rounded-2xl bg-[#f4f6fa] px-3 py-2.5">
          <Search size={18} className="text-[#8b95a6]" />
          <input
            type="text"
            placeholder="Search company or role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca5b5]"
            aria-label="Search applications"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="input-native appearance-none pr-8"
            >
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="input-native appearance-none pr-8" aria-label="Filter by status">
              <option value="All">All statuses</option>
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b95a6]" />
          </label>

          <label className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
              className="input-native appearance-none pr-8"
            >
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)} className="input-native appearance-none pr-8" aria-label="Sort applications">
              <option value="Newest">Newest</option>
              <option value="Company">Company A-Z</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b95a6]" />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {filteredApplications.length > 0 ? (
      <div className="space-y-3" aria-busy={isHydrating}>
        {isHydrating ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-[72px] animate-pulse rounded-2xl bg-white/70" />
          ))
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              company={app.company}
              role={app.role}
              status={app.status}
              initials={app.initials}
              onDelete={(id) => setPendingDeleteId(id)}
            />
          ))
        ) : (
          <div className="surface-card p-8 text-center text-sm text-[#6b7280]">No applications found.</div>
          <div className="surface-card p-8 text-center text-sm text-[#6b7280]">
            No applications found. Tap the floating + button to add your first role.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete application?"
        description={`This will permanently remove ${pendingApp?.company ?? "this application"}.`}
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteApplication(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
