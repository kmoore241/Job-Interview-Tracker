import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Briefcase, Building2, Clock, Edit2, MapPin } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";
import { useState } from "react";
import ApplicationEditForm from "@/components/ApplicationEditForm";
import { useBackspacePrevention } from "@/hooks/useBackspacePrevention";
import { STATUS_STYLES } from "@/lib/status";
import { parseLocalDate } from "@/lib/dates";

export default function InterviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApplicationById } = useApplications();
  const [isEditing, setIsEditing] = useState(false);
  useBackspacePrevention();

  const application = id ? getApplicationById(id) : null;

  if (!application || !application.interviewDate) {
    return (
      <div className="page-container text-center">
        <p className="text-sm text-[#6b7280]">Interview not found</p>
        <Link to="/interviews" className="mt-3 inline-block text-sm font-semibold text-primary">Back to Interviews</Link>
      </div>
    );
  }

  const interviewDate = parseLocalDate(application.interviewDate);

  if (isEditing) {
    return (
      <div className="page-container space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsEditing(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title text-[30px]">Edit Interview</h1>
        </div>
        <ApplicationEditForm application={application} onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="page-container space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/interviews")} className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <h1 className="page-title text-[30px]">Interview</h1>
      </div>

      <section className="surface-card p-5 space-y-5">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Building2 size={18} className="text-primary mt-1" />
            <div>
              <p className="text-xs text-[#6b7280]">Company</p>
              <p className="text-lg font-semibold text-[#0f172a]">{application.company}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Briefcase size={18} className="text-primary mt-1" />
            <div>
              <p className="text-xs text-[#6b7280]">Role</p>
              <p className="text-lg font-semibold text-[#0f172a]">{application.role}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#edf0f5] pt-4 space-y-3">
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-amber-600 mt-1" />
            <div>
              <p className="text-xs text-[#6b7280]">Date & Time</p>
              <p className="text-sm font-semibold text-[#0f172a]">{interviewDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              <p className="text-xs text-[#6b7280]">{application.interviewTime || "Time TBD"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-rose-500 mt-1" />
            <div>
              <p className="text-xs text-[#6b7280]">Location</p>
              <p className="text-sm font-semibold text-[#0f172a]">{application.location || "TBD"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#edf0f5] pt-4">
          <p className="text-xs text-[#6b7280] mb-2">Application status</p>
          <span className={`pill ${STATUS_STYLES[application.status].pill}`}>{application.status}</span>
        </div>
      </section>

      <button onClick={() => setIsEditing(true)} className="w-full rounded-2xl bg-[#111827] text-white py-3 font-semibold inline-flex items-center justify-center gap-2"><Edit2 size={16} />Edit Interview</button>

      <Link to={`/applications/${application.id}`} className="block w-full rounded-2xl bg-white py-3 text-center text-sm font-semibold text-[#0f172a] shadow-sm">
        View Application Details
      </Link>
    </div>
  );
}
