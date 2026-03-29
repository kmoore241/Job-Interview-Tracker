import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import ApplicationCard from "@/components/ApplicationCard";
import { useApplications } from "@/context/ApplicationContext";
import { STATUS_ORDER } from "@/lib/status";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | (typeof STATUS_ORDER)[number]>("All");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Company">("Newest");
  const { applications, deleteApplication } = useApplications();

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

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplication(id);
    }
  };

  return (
    <div className="page-container space-y-5">
      <header>
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Search, filter, and track every role in your pipeline.</p>
      </header>

      <div className="surface-card p-3 space-y-3">
        <div className="flex items-center gap-2 rounded-2xl bg-[#f4f6fa] px-3 py-2.5">
          <Search size={18} className="text-[#8b95a6]" />
          <input
            type="text"
            placeholder="Search company or role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca5b5]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="input-native appearance-none pr-8"
            >
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
              <option value="Newest">Newest</option>
              <option value="Company">Company A-Z</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b95a6]" />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              company={app.company}
              role={app.role}
              status={app.status}
              initials={app.initials}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="surface-card p-8 text-center text-sm text-[#6b7280]">No applications found.</div>
        )}
      </div>
    </div>
  );
}
