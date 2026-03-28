import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "@/context/ApplicationContext";
import { validateApplicationForm, ValidationErrors, hasErrors } from "@/lib/validation";

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
  const [isPressed, setIsPressed] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    role: "",
    dateApplied: new Date().toISOString().split("T")[0],
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
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

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      // Get initials from company name
      const initials = formData.companyName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      // Build reminders configuration
      const reminderTimes: ("24h" | "1h" | "10m")[] = [];
      if (formData.reminder24h) reminderTimes.push("24h");
      if (formData.reminder1h) reminderTimes.push("1h");
      if (formData.reminder10m) reminderTimes.push("10m");

      // Add to store
      // interviewDate is already in YYYY-MM-DD format from the date input
      addApplication({
        company: formData.companyName,
        role: formData.role,
        status: formData.status,
        dateApplied: new Date(formData.dateApplied).toISOString(),
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

      setIsLoading(false);
      navigate("/applications");
    } catch (error) {
      console.error("Error adding application:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-semibold text-primary-text mb-6">
        Add Application
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Acme Corp"
            className={`w-full px-4 py-3 rounded-[12px] border focus:outline-none focus:ring-2 text-primary-text placeholder-secondary-text ${
              errors.company
                ? "border-error focus:ring-error"
                : "border-[#E5E7EB] focus:ring-primary"
            }`}
            required
          />
          {errors.company && (
            <p className="text-error text-sm mt-1">{errors.company}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Senior Product Manager"
            className={`w-full px-4 py-3 rounded-[12px] border focus:outline-none focus:ring-2 text-primary-text placeholder-secondary-text ${
              errors.role
                ? "border-error focus:ring-error"
                : "border-[#E5E7EB] focus:ring-primary"
            }`}
            required
          />
          {errors.role && (
            <p className="text-error text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {/* Date Applied */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Date Applied
          </label>
          <input
            type="date"
            name="dateApplied"
            value={formData.dateApplied}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>

        {/* Interview Date */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Interview Date (Optional)
          </label>
          <input
            type="date"
            name="interviewDate"
            value={formData.interviewDate}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-[12px] border focus:outline-none focus:ring-2 text-primary-text ${
              errors.interviewDate
                ? "border-error focus:ring-error"
                : "border-[#E5E7EB] focus:ring-primary"
            }`}
          />
          {errors.interviewDate && (
            <p className="text-error text-sm mt-1">{errors.interviewDate}</p>
          )}
        </div>

        {/* Interview Time */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Interview Time (Optional)
          </label>
          <input
            type="time"
            name="interviewTime"
            value={formData.interviewTime}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-[12px] border focus:outline-none focus:ring-2 text-primary-text ${
              errors.interviewTime
                ? "border-error focus:ring-error"
                : "border-[#E5E7EB] focus:ring-primary"
            }`}
          />
          {errors.interviewTime && (
            <p className="text-error text-sm mt-1">{errors.interviewTime}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Interview Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA or Zoom"
            className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text placeholder-secondary-text"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes about this application..."
            rows={4}
            className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text placeholder-secondary-text resize-none"
          />
        </div>

        {/* Interview Reminders */}
        {formData.interviewDate && formData.interviewTime && (
          <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="remindersEnabled"
                name="remindersEnabled"
                checked={formData.remindersEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label
                htmlFor="remindersEnabled"
                className="text-sm font-medium text-primary-text cursor-pointer"
              >
                Enable interview reminders
              </label>
            </div>

            {formData.remindersEnabled && (
              <div className="space-y-2 ml-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="reminder24h"
                    checked={formData.reminder24h}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-primary-text">24 hours before</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="reminder1h"
                    checked={formData.reminder1h}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-primary-text">1 hour before</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="reminder10m"
                    checked={formData.reminder10m}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-primary-text">10 minutes before</span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`w-full bg-primary text-white font-medium rounded-[12px] transition-transform duration-120 ${
              isPressed ? "scale-[0.96]" : "scale-100"
            } disabled:opacity-50`}
            style={{ height: "52px" }}
          >
            {isLoading ? "Saving..." : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
