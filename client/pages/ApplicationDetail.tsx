import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Edit2, Trash2 } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";
import { useState } from "react";
import ApplicationEditForm from "@/components/ApplicationEditForm";
import { useBackspacePrevention } from "@/hooks/useBackspacePrevention";
import { STATUS_STYLES } from "@/lib/status";
import ConfirmDialog from "@/components/ConfirmDialog";
import { parseLocalDate } from "@/lib/dates";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApplicationById, deleteApplication } = useApplications();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useBackspacePrevention();

  const application = id ? getApplicationById(id) : null;

  if (!application) {
    return (
      <div className="page-container text-center">
        <p className="text-sm text-[#6b7280]">Application not found</p>
        <Link to="/applications" className="mt-3 inline-block text-sm font-semibold text-primary">Back to Applications</Link>
      </div>
    );
  }


  if (isEditing) {
    return (
      <div className="page-container space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsEditing(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title text-[30px]">Edit Application</h1>
        </div>

        <ApplicationEditForm application={application} onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  const appliedDate = new Date(application.dateApplied);
  const interviewDate = application.interviewDate ? parseLocalDate(application.interviewDate) : null;

  return (
    <div className="page-container space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/applications")} className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <h1 className="page-title text-[30px] truncate">{application.company}</h1>
      </div>

      <section className="surface-card p-5 space-y-5">
        <div>
          <p className="text-xl font-semibold text-[#0f172a]">{application.role}</p>
          <span className={`pill mt-2 ${STATUS_STYLES[application.status].pill}`}>{application.status}</span>
        </div>

        <div className="space-y-3 border-t border-[#edf0f5] pt-4">
          <div className="flex items-start gap-3">
            <Calendar size={16} className="mt-1 text-primary" />
            <div>
              <p className="text-xs text-[#6b7280]">Applied</p>
              <p className="text-sm font-semibold text-[#0f172a]">{appliedDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>

          {interviewDate && (
            <div className="flex items-start gap-3">
              <Calendar size={16} className="mt-1 text-amber-600" />
              <div>
                <p className="text-xs text-[#6b7280]">Interview</p>
                <p className="text-sm font-semibold text-[#0f172a]">{interviewDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                {application.interviewTime && <p className="text-xs text-[#6b7280] mt-0.5">{application.interviewTime}</p>}
                {application.location && <p className="text-xs text-[#6b7280]">{application.location}</p>}
              </div>
            </div>
          )}
        </div>

        {application.notes && (
          <div className="border-t border-[#edf0f5] pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Notes</p>
            <p className="mt-2 text-sm text-[#334155] leading-relaxed">{application.notes}</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setIsEditing(true)} className="rounded-2xl bg-primary text-white py-3 font-semibold inline-flex items-center justify-center gap-2"><Edit2 size={16} />Edit</button>
        <button onClick={() => setShowDeleteConfirm(true)} className="rounded-2xl bg-rose-600 text-white py-3 font-semibold inline-flex items-center justify-center gap-2"><Trash2 size={16} />Delete</button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete application?"
        description={`This will permanently remove ${application.company} from your tracker.`}
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteApplication(application.id);
          navigate("/applications");
        }}
      />
    </div>
  );
}
