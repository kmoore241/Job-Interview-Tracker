import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "@/context/ApplicationContext";
import { validateApplicationForm, ValidationErrors, hasErrors } from "@/lib/validation";
import { formatLocalYMD, parseLocalDate } from "@/lib/dates";

interface FormData {
  companyName: string;
  role: string;
  dateApplied: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  interviewDate: string;
  interviewTime: string;
  location: string;
  notes: string;
  remindersEnabled: boolean;
  reminder24h: boolean;
  reminder1h: boolean;
  reminder10m: boolean;
}

export default function AddApplication() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    role: "",
    dateApplied: formatLocalYMD(new Date()),
    status: "Applied",
    interviewDate: "",
    interviewTime: "",
    location: "",
    notes: "",
    remindersEnabled: false,
    reminder24h: false,
    reminder1h: true,
    reminder10m: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name } = target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateApplicationForm({
      company: formData.companyName,
      role: formData.role,
      status: formData.status,
      dateApplied: formData.dateApplied,
      interviewDate: formData.interviewDate,
      interviewTime: formData.interviewTime,
    });

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitMessage("");
    setIsLoading(true);

    try {
      const initials = formData.companyName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const reminderTimes: ("24h" | "1h" | "10m")[] = [];
      if (formData.reminder24h) reminderTimes.push("24h");
      if (formData.reminder1h) reminderTimes.push("1h");
      if (formData.reminder10m) reminderTimes.push("10m");

      addApplication({
        company: formData.companyName,
        role: formData.role,
        status: formData.status,
        dateApplied: parseLocalDate(formData.dateApplied).toISOString(),
        interviewDate: formData.interviewDate || undefined,
        interviewTime: formData.interviewTime || undefined,
        location: formData.location || undefined,
        notes: formData.notes,
        initials,
        reminders: formData.remindersEnabled
          ? {
              enabled: true,
              times: reminderTimes,
            }
          : undefined,
      });

      setSubmitMessage("Application saved successfully.");
      navigate("/applications");
    } catch (error) {
      console.error("Error adding application:", error);
      setSubmitMessage("Could not save application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container space-y-6">
      <header>
        <h1 className="page-title">New Application</h1>
        <p className="page-subtitle">Capture role details, schedule interviews, and enable reminders.</p>
      </header>

      {submitMessage && <div className="rounded-2xl bg-blue-50 px-4 py-3 text-xs text-blue-700" role="status" aria-live="polite">{submitMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <section>
          <p className="group-label">Role details</p>
          <div className="form-group">
            <div className="form-row">
              <label className="text-sm font-medium text-[#0f172a]">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Acme Inc" className="input-native" required />
              {errors.company && <p className="text-xs text-red-600">{errors.company}</p>}
            </div>
            <div className="form-row form-row-divider">
              <label className="text-sm font-medium text-[#0f172a]">Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Product Designer" className="input-native" required />
              {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
            </div>
            <div className="form-row form-row-divider">
              <label className="text-sm font-medium text-[#0f172a]">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-native">
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div className="form-row form-row-divider">
              <label className="text-sm font-medium text-[#0f172a]">Date Applied</label>
              <input type="date" name="dateApplied" value={formData.dateApplied} onChange={handleChange} className="input-native" required />
            </div>
          </div>
        </section>

        <section>
          <p className="group-label">Interview (optional)</p>
          <div className="form-group">
            <div className="form-row">
              <label className="text-sm font-medium text-[#0f172a]">Interview Date</label>
              <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="input-native" />
              {errors.interviewDate && <p className="text-xs text-red-600">{errors.interviewDate}</p>}
            </div>
            <div className="form-row form-row-divider">
              <label className="text-sm font-medium text-[#0f172a]">Interview Time</label>
              <input type="time" name="interviewTime" value={formData.interviewTime} onChange={handleChange} className="input-native" />
              {errors.interviewTime && <p className="text-xs text-red-600">{errors.interviewTime}</p>}
            </div>
            <div className="form-row form-row-divider">
              <label className="text-sm font-medium text-[#0f172a]">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Zoom or office address" className="input-native" />
            </div>
          </div>
        </section>

        <section>
          <p className="group-label">Notes</p>
          <div className="form-group">
            <div className="form-row">
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} placeholder="Anything important to remember for this role" className="input-native resize-none" />
            </div>
          </div>
        </section>

        {formData.interviewDate && formData.interviewTime && (
          <section>
            <p className="group-label">Reminder settings</p>
            <div className="surface-card p-4 space-y-3">
              <label className="flex items-center gap-3 text-sm font-medium text-[#0f172a]">
                <input type="checkbox" name="remindersEnabled" checked={formData.remindersEnabled} onChange={handleChange} className="h-4 w-4 rounded" />
                Enable interview reminders
              </label>

              {formData.remindersEnabled && (
                <div className="grid grid-cols-1 gap-2 pl-7 text-sm text-[#475569]">
                  <label className="flex items-center gap-2"><input type="checkbox" name="reminder24h" checked={formData.reminder24h} onChange={handleChange} className="h-4 w-4 rounded" />24 hours before</label>
                  <label className="flex items-center gap-2"><input type="checkbox" name="reminder1h" checked={formData.reminder1h} onChange={handleChange} className="h-4 w-4 rounded" />1 hour before</label>
                  <label className="flex items-center gap-2"><input type="checkbox" name="reminder10m" checked={formData.reminder10m} onChange={handleChange} className="h-4 w-4 rounded" />10 minutes before</label>
                </div>
              )}
            </div>
          </section>
        )}

        <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,130,246,0.32)] disabled:opacity-60">
          {isLoading ? "Saving..." : "Save Application"}
        </button>
      </form>
    </div>
  );
}
