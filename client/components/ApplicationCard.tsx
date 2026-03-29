import { Link } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { STATUS_STYLES } from "@/lib/status";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  initials?: string;
  onDelete?: (id: string) => void;
}

export default function ApplicationCard({
  id,
  company,
  role,
  status,
  initials = "AC",
  onDelete,
}: ApplicationCardProps) {
  const style = STATUS_STYLES[status];

  return (
    <Link to={`/applications/${id}`} className="list-row group">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0f172a] text-xs font-semibold text-white">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0f172a]">{company}</p>
        <p className="truncate text-xs text-[#6b7280]">{role}</p>
      </div>

      <div className={cn("pill", style.pill)}>{status}</div>

      <ChevronRight size={16} className="text-[#a4acb9]" />

      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(id);
          }}
          className="p-1 text-[#9ea7b7] hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
          aria-label={`Delete ${company}`}
        >
          <X size={16} />
        </button>
      )}
    </Link>
  );
}
