import { Sparkles, CalendarDays, LineChart, PlusCircle } from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Welcome to Job Interview Tracker">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-2 text-primary">
          <Sparkles size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-[#0f172a]">Welcome to Job Interview Tracker</h2>
        <p className="mt-2 text-sm text-[#64748b]">Track applications, prepare for interviews, and review insights in one calm, mobile-first workspace.</p>

        <ul className="mt-5 space-y-3 text-sm text-[#334155]">
          <li className="flex items-center gap-2"><PlusCircle size={16} className="text-primary" /> Add applications quickly from any screen</li>
          <li className="flex items-center gap-2"><CalendarDays size={16} className="text-primary" /> Keep interview dates timezone-safe</li>
          <li className="flex items-center gap-2"><LineChart size={16} className="text-primary" /> Measure conversion rates in Insights</li>
        </ul>

        <button onClick={onClose} className="mt-6 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white">Get Started</button>
      </div>
    </div>
  );
}
