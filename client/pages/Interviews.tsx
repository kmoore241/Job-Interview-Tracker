import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useApplications } from "@/context/ApplicationContext";
import { formatLocalYMD, parseLocalDate } from "@/lib/dates";

export default function Interviews() {
  const location = useLocation();
  const { getInterviewsByDate, applications, isHydrating } = useApplications();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const day = params.get("day");
    if (day) {
      setSelectedDate(parseLocalDate(day));
      setCurrentDate(parseLocalDate(day));
    }
  }, [location.search]);

  const interviewsByDay = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getInterviewsByDate>>();
    const allDates = new Set<string>();

    applications.forEach((app) => {
      if (app.interviewDate) allDates.add(app.interviewDate);
    });

    allDates.forEach((dateKey) => {
      const interviews = getInterviewsByDate(parseLocalDate(dateKey));
      if (interviews.length > 0) map.set(dateKey, interviews);
    });

    return map;
  }, [applications, getInterviewsByDate]);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectedKey = formatLocalYMD(selectedDate);
  const selectedInterviews = interviewsByDay.get(selectedKey) ?? [];
  const todayKey = formatLocalYMD(new Date());

  return (
    <div className="page-container space-y-6">
      {isHydrating && <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs text-[#64748b]">Preparing your interview calendar...</div>}
      <header>
        <h1 className="page-title">Interviews</h1>
        <p className="page-subtitle">Calendar-first scheduling with timezone-safe interview dates.</p>
      </header>

      <section className="surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0f172a]">{monthName} {year}</h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f6fa] text-[#334155]">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f6fa] text-[#334155]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-[#8a94a6] py-1">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} />;

            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const key = formatLocalYMD(dateObj);
            const isSelected = selectedKey === key;
            const isToday = todayKey === key;
            const hasInterview = interviewsByDay.has(key);

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(dateObj)}
                className={`relative h-10 rounded-xl text-sm transition ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-[0_6px_16px_rgba(59,130,246,0.35)]"
                    : isToday
                    ? "bg-[#dbeafe] text-primary font-semibold"
                    : "text-[#334155] hover:bg-[#f4f6fa]"
                }`}
              >
                {day}
                {hasInterview && (
                  <span
                    className={`absolute left-1/2 top-[31px] h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                      isSelected ? "bg-white" : "bg-amber-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="section-title">
          {selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
        </h3>

        {selectedInterviews.length > 0 ? (
          selectedInterviews.map((interview) => (
            <Link key={interview.id} to={`/interviews/${interview.id}`} className="list-row">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                <Clock3 size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#0f172a]">{interview.company}</p>
                <p className="truncate text-xs text-[#6b7280]">{interview.role} · {interview.time}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#7b8495]">
                  <MapPin size={12} /> {interview.location}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="surface-card p-6 text-sm text-[#6b7280] text-center">No interviews scheduled for this date.</div>
        )}
      </section>
    </div>
  );
}
