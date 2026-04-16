import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ label, count, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-[16px] p-4 w-[140px] flex flex-col items-center justify-center shadow-[0px_2px_6px_rgba(0,0,0,0.06)]">
      <div style={{ color, marginBottom: "8px" }}>
        <Icon size={32} />
      </div>
      <div className="text-3xl font-bold text-primary-text">{count}</div>
      <div className="text-xs text-secondary-text text-center mt-1">{label}</div>
    </div>
  );
}
