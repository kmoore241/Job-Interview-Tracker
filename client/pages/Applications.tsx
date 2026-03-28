import { useState } from "react";
import { Search } from "lucide-react";
import ApplicationCard from "@/components/ApplicationCard";
import { useApplications } from "@/context/ApplicationContext";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const { applications } = useApplications();

  const { deleteApplication } = useApplications();

  const filteredApplications = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplication(id);
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-2 bg-white rounded-[12px] px-3 py-2 border border-[#E5E7EB]" style={{ height: "48px" }}>
          <Search size={20} className="text-secondary-text" />
          <input
            type="text"
            placeholder="Search company or role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-primary-text placeholder-secondary-text"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-0">
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
          <div className="text-center py-8">
            <p className="text-secondary-text text-sm">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
