import { useState } from "react";
import { useApplications } from "@/context/ApplicationContext";
import { Application } from "@/context/ApplicationContext";
import { parseLocalDate } from "@/lib/dates";
import { validateApplicationForm, ValidationErrors, hasErrors } from "@/lib/validation";

interface ApplicationEditFormProps {
  application: Application;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function ApplicationEditForm({ application, onSave, onCancel }: ApplicationEditFormProps) {
  const { updateApplication } = useApplications();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    company: application.company,
    role: application.role,
    status: application.status,
    dateApplied: application.dateApplied.split("T")[0],
    interviewDate: application.interviewDate || "",
    interviewTime: application.interviewTime || "",
    location: application.location || "",
    notes: application.notes,
    remindersEnabled: application.reminders?.enabled || false,
    reminder24h: application.reminders?.times?.includes("24h") || false,
    reminder1h: application.reminders?.times?.includes("1h") || false,
    reminder10m: application.reminders?.times?.includes("10m") || false,
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
      company: formData.company,
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
      const reminderTimes: ("24h" | "1h" | "10m")[] = [];
      if (formData.reminder24h) reminderTimes.push("24h");
      if (formData.reminder1h) reminderTimes.push("1h");
      if (formData.reminder10m) reminderTimes.push("10m");

      updateApplication(application.id, {
        company: formData.company,
        role: formData.role,
        status: formData.status as Application["status"],
        dateApplied: parseLocalDate(formData.dateApplied).toISOString(),
        interviewDate: formData.interviewDate || undefined,
        interviewTime: formData.interviewTime || undefined,
        location: formData.location || undefined,
        notes: formData.notes,
        reminders: formData.remindersEnabled
          ? {
              enabled: true,
              times: reminderTimes,
            }
          : undefined,
      });

      onSave?.();
    } catch (error) {
      console.error("Error updating application:", error);
      setSubmitMessage("Changes saved.");
      onSave?.();
    } catch (error) {
      console.error("Error updating application:", error);
      setSubmitMessage("Could not save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitMessage && <div className="rounded-2xl bg-blue-50 px-4 py-3 text-xs text-blue-700" role="status" aria-live="polite">{submitMessage}</div>}
      <section>
        <p className="group-label">Role details</p>
        <div className="form-group">
          <div className="form-row">
            <label className="text-sm font-medium text-[#0f172a]">Company Name</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-native" required />
            {errors.company && <p className="text-xs text-red-600">{errors.company}</p>}
          </div>
          <div className="form-row form-row-divider">
            <label className="text-sm font-medium text-[#0f172a]">Role</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="input-native" required />
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
        <p className="group-label">Interview details</p>
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
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-native" />
          </div>
        </div>
      </section>

      <section>
        <p className="group-label">Notes</p>
        <div className="form-group">
          <div className="form-row">
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="input-native resize-none" />
          </div>
        </div>
      </section>

      {formData.interviewDate && formData.interviewTime && (
        <section>
          <p className="group-label">Reminder settings</p>
          <div className="surface-card p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remindersEnabled" checked={formData.remindersEnabled} onChange={handleChange} className="h-4 w-4" />Enable reminders</label>
            {formData.remindersEnabled && (
              <div className="grid gap-2 pl-6 text-sm text-[#475569]">
                <label className="flex items-center gap-2"><input type="checkbox" name="reminder24h" checked={formData.reminder24h} onChange={handleChange} className="h-4 w-4" />24 hours before</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="reminder1h" checked={formData.reminder1h} onChange={handleChange} className="h-4 w-4" />1 hour before</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="reminder10m" checked={formData.reminder10m} onChange={handleChange} className="h-4 w-4" />10 minutes before</label>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button type="submit" disabled={isLoading} className="rounded-2xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-60">
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-2xl bg-white py-3 text-sm font-semibold text-[#0f172a] shadow-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
