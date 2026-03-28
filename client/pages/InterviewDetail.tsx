import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Building2, Briefcase, Edit2 } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";
import { useState } from "react";
import ApplicationEditForm from "@/components/ApplicationEditForm";
import { useBackspacePrevention } from "@/hooks/useBackspacePrevention";

export default function InterviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApplicationById } = useApplications();
  const [isEditing, setIsEditing] = useState(false);
  useBackspacePrevention();

  const application = id ? getApplicationById(id) : null;

  if (!application || !application.interviewDate) {
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-secondary-text mb-4">Interview not found</p>
          <Link
            to="/interviews"
            className="text-primary font-medium hover:underline"
          >
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  // Parse the YYYY-MM-DD format safely to a Date object
  const interviewDate = application.interviewDate
    ? new Date(application.interviewDate)
    : new Date();

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
            Edit Interview
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
          onClick={() => navigate("/interviews")}
          className="p-2 hover:bg-[#F0F0F0] rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-2xl font-semibold text-primary-text">
          Interview
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-[#FFFBEB] rounded-[16px] p-6 border border-[#FEF3C7] mb-6">
        {/* Company and Role */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Building2 size={24} className="text-warning flex-shrink-0" />
            <div>
              <div className="text-sm text-secondary-text">Company</div>
              <div className="text-xl font-semibold text-primary-text">
                {application.company}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase size={24} className="text-primary flex-shrink-0" />
            <div>
              <div className="text-sm text-secondary-text">Role</div>
              <div className="text-xl font-semibold text-primary-text">
                {application.role}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FEF3C7] pt-6">
          {/* Date and Time */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm text-secondary-text">Date & Time</div>
                <div className="text-base font-medium text-primary-text">
                  {interviewDate.toLocaleDateString("default", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                {application.interviewTime && (
                  <div className="text-base font-medium text-primary-text">
                    {application.interviewTime}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-error mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm text-secondary-text">Location</div>
                <div className="text-base font-medium text-primary-text">
                  {application.location || "TBD"}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full bg-[#F3F4F6] text-primary-text font-medium rounded-[12px] py-3 hover:bg-[#E5E7EB] transition flex items-center justify-center gap-2"
          >
            <Edit2 size={18} />
            Edit Interview
          </button>

          {/* Application Status */}
          <div className="mt-6 pt-6 border-t border-[#FEF3C7]">
            <div className="text-sm text-secondary-text mb-2">
              Application Status
            </div>
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor:
                  application.status === "Applied"
                    ? "#DFF3FF"
                    : application.status === "Interview"
                    ? "#FFEDD5"
                    : application.status === "Rejected"
                    ? "#FEE2E2"
                    : "#EDD5FF",
                color:
                  application.status === "Applied"
                    ? "#3B82F6"
                    : application.status === "Interview"
                    ? "#F59E0B"
                    : application.status === "Rejected"
                    ? "#EF4444"
                    : "#8B5CF6",
              }}
            >
              {application.status}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Link
        to={`/applications/${application.id}`}
        className="block w-full bg-primary text-white font-medium rounded-[12px] py-3 text-center hover:bg-blue-600 transition"
      >
        View Application Details
      </Link>
    </div>
  );
}
