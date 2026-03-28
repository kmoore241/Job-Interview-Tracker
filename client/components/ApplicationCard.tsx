import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface ApplicationCardProps {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  initials?: string;
  onDelete?: (id: string) => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Applied: { bg: "#DFF3FF", text: "#3B82F6" },
  Interview: { bg: "#FFEDD5", text: "#F59E0B" },
  Rejected: { bg: "#FEE2E2", text: "#EF4444" },
  Offer: { bg: "#EDD5FF", text: "#8B5CF6" },
};

export default function ApplicationCard({
  id,
  company,
  role,
  status,
  initials = "AC",
  onDelete,
}: ApplicationCardProps) {
  const statusStyle = statusColors[status];

  return (
    <Link
      to={`/applications/${id}`}
      className="block bg-white rounded-lg p-3 flex items-center gap-3 mb-3 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:border-primary transition group"
      style={{ height: "72px" }}
    >
      {/* Company Avatar */}
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "#4F46E5",
        }}
      >
        {initials}
      </div>

      {/* Company Info */}
      <div className="flex-1">
        <div className="font-semibold text-primary-text text-sm">
          {company}
        </div>
        <div className="text-secondary-text text-xs mt-1">{role}</div>
      </div>

      {/* Status Tag */}
      <div
        className="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
        style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.text,
        }}
      >
        {status}
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(id);
          }}
          className="p-1 text-secondary-text hover:text-error opacity-0 group-hover:opacity-100 transition flex-shrink-0"
        >
          <X size={18} />
        </button>
      )}
    </Link>
  );
}
