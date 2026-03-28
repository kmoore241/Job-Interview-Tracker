import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Calendar, Edit2 } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";
import { useState } from "react";
import ApplicationEditForm from "@/components/ApplicationEditForm";
import { useBackspacePrevention } from "@/hooks/useBackspacePrevention";

const statusColors: Record<string, { bg: string; text: string }> = {
  Applied: { bg: "#DFF3FF", text: "#3B82F6" },
  Interview: { bg: "#FFEDD5", text: "#F59E0B" },
  Rejected: { bg: "#FEE2E2", text: "#EF4444" },
  Offer: { bg: "#EDD5FF", text: "#8B5CF6" },
};

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApplicationById, deleteApplication, updateApplication } = useApplications();
  const [isEditing, setIsEditing] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  useBackspacePrevention();

  const application = id ? getApplicationById(id) : null;

  if (!application) {
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-secondary-text mb-4">Application not found</p>
          <Link
            to="/applications"
            className="text-primary font-medium hover:underline"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const statusStyle = statusColors[application.status];
  const dateApplied = new Date(application.dateApplied);
  const interviewDate = application.interviewDate
    ? new Date(application.interviewDate)
    : null;

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete application for ${application.company}? This cannot be undone.`
      )
    ) {
      deleteApplication(application.id);
      navigate("/applications");
    }
  };

  if (isEditing) {
    return (
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-[#F0F0F0] rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-primary" />
          </button>
          <h1 className="text-2xl font-semibold text-primary-text">
            Edit Application
          </h1>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#F0F0F0]">
          <ApplicationEditForm
            application={application}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/applications")}
          className="p-2 hover:bg-[#F0F0F0] rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-2xl font-semibold text-primary-text">
          {application.company}
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#F0F0F0] mb-6">
        {/* Role and Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-primary-text">
              {application.role}
            </h2>
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                }}
              >
                {application.status}
              </button>

              {statusDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  {(["Applied", "Interview", "Rejected", "Offer"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateApplication(application.id, { status });
                        setStatusDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 hover:bg-[#F0F0F0] transition ${
                        application.status === status ? "font-semibold" : ""
                      }`}
                      style={{
                        color: application.status === status ? statusColors[status].text : "inherit",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4 mb-6 pb-6 border-b border-[#E5E7EB]">
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <div className="text-sm text-secondary-text">Applied</div>
              <div className="text-base font-medium text-primary-text">
                {dateApplied.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {interviewDate && (
            <div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-warning mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-secondary-text">Interview Date</div>
                  <div className="text-base font-medium text-primary-text">
                    {interviewDate.toLocaleDateString("default", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              {application.interviewTime && (
                <div className="mt-2 ml-9 text-sm text-secondary-text">
                  <span className="font-medium text-primary-text">
                    {application.interviewTime}
                  </span>
                </div>
              )}
              {application.location && (
                <div className="mt-1 ml-9 text-sm text-secondary-text">
                  <span className="font-medium text-primary-text">
                    {application.location}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {application.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-primary-text mb-3">
              Notes
            </h3>
            <p className="text-sm text-secondary-text leading-relaxed">
              {application.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-primary text-white font-medium rounded-[12px] py-3 hover:bg-blue-600 transition flex items-center justify-center gap-2"
        >
          <Edit2 size={18} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-error text-white font-medium rounded-[12px] py-3 hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
