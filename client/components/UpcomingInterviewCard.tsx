import { useState, useMemo } from "react";
import { Calendar, MapPin } from "lucide-react";
import { getCountdown } from "@/lib/dateKey";

interface UpcomingInterviewCardProps {
  company: string;
  role: string;
  date: Date;
  location?: string;
}

export default function UpcomingInterviewCard({
  company,
  role,
  date,
  location = "Zoom",
}: UpcomingInterviewCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const { days, hours } = useMemo(() => getCountdown(date), [date]);

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`w-full bg-[#FFFBEB] rounded-[16px] p-4 flex items-start justify-between transition-transform duration-150 ${
        isPressed ? "scale-[0.97]" : "scale-100"
      }`}
      style={{ height: "100px" }}
    >
      <div className="flex-1">
        <div className="font-semibold text-primary-text text-sm">{company}</div>
        <div className="text-secondary-text text-xs mt-1">{role}</div>
        <div className="flex items-center gap-1 mt-2">
          <Calendar size={14} className="text-[#F59E0B]" />
          <span className="text-xs text-secondary-text">
            {date.toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[#F59E0B] font-semibold text-sm">
          {days}d {hours}h
        </div>
        <div className="flex items-center gap-1 mt-2">
          <MapPin size={14} className="text-secondary-text" />
          <span className="text-xs text-secondary-text">{location}</span>
        </div>
      </div>
    </button>
  );
}
