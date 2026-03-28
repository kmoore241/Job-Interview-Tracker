import { useState } from "react";
import { Check, X, Plus } from "lucide-react";

interface PreparationData {
  interviewerName: string;
  meetingLink: string;
  prepNotes: string;
  checklist: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

interface InterviewPreparationFormProps {
  preparation?: {
    interviewerName?: string;
    meetingLink?: string;
    prepNotes?: string;
    checklist?: Array<{
      id: string;
      text: string;
      completed: boolean;
    }>;
  };
  onSave: (data: PreparationData) => void;
}

const DEFAULT_CHECKLIST = [
  { id: "1", text: "Research company", completed: false },
  { id: "2", text: "Review resume", completed: false },
  { id: "3", text: "Prepare questions", completed: false },
];

export default function InterviewPreparationForm({
  preparation,
  onSave,
}: InterviewPreparationFormProps) {
  const [formData, setFormData] = useState<PreparationData>({
    interviewerName: preparation?.interviewerName || "",
    meetingLink: preparation?.meetingLink || "",
    prepNotes: preparation?.prepNotes || "",
    checklist: preparation?.checklist || DEFAULT_CHECKLIST,
  });

  const [newChecklistItem, setNewChecklistItem] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleChecklistItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newChecklistItem,
        completed: false,
      };
      setFormData((prev) => ({
        ...prev,
        checklist: [...prev.checklist, newItem],
      }));
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== id),
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      {/* Interviewer Name */}
      <div>
        <label className="block text-sm font-medium text-primary-text mb-2">
          Interviewer Name (Optional)
        </label>
        <input
          type="text"
          name="interviewerName"
          value={formData.interviewerName}
          onChange={handleChange}
          placeholder="e.g., John Smith"
          className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text placeholder-secondary-text"
        />
      </div>

      {/* Meeting Link */}
      <div>
        <label className="block text-sm font-medium text-primary-text mb-2">
          Meeting Link (Optional)
        </label>
        <input
          type="url"
          name="meetingLink"
          value={formData.meetingLink}
          onChange={handleChange}
          placeholder="e.g., https://zoom.us/j/..."
          className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text placeholder-secondary-text"
        />
      </div>

      {/* Preparation Notes */}
      <div>
        <label className="block text-sm font-medium text-primary-text mb-2">
          Preparation Notes (Optional)
        </label>
        <textarea
          name="prepNotes"
          value={formData.prepNotes}
          onChange={handleChange}
          placeholder="Add any preparation notes..."
          rows={4}
          className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text placeholder-secondary-text resize-none"
        />
      </div>

      {/* Preparation Checklist */}
      <div>
        <label className="block text-sm font-medium text-primary-text mb-3">
          Preparation Checklist
        </label>

        <div className="space-y-2 mb-4 bg-[#F9FAFB] rounded-[12px] p-4">
          {formData.checklist.length > 0 ? (
            formData.checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 group hover:bg-white p-2 rounded transition"
              >
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    item.completed
                      ? "bg-primary border-primary"
                      : "border-[#E5E7EB] hover:border-primary"
                  }`}
                >
                  {item.completed && <Check size={16} className="text-white" />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    item.completed
                      ? "text-secondary-text line-through"
                      : "text-primary-text"
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeChecklistItem(item.id)}
                  className="flex-shrink-0 p-1 text-secondary-text hover:text-error rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-secondary-text">No checklist items yet</p>
          )}
        </div>

        {/* Add Checklist Item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
            placeholder="Add checklist item..."
            className="flex-1 px-4 py-3 rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary text-primary-text placeholder-secondary-text"
          />
          <button
            onClick={addChecklistItem}
            className="px-4 py-3 bg-primary text-white rounded-[12px] hover:bg-blue-600 transition flex items-center gap-2"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-primary text-white font-medium rounded-[12px] py-3 hover:bg-blue-600 transition"
      >
        Save Preparation
      </button>
    </div>
  );
}
