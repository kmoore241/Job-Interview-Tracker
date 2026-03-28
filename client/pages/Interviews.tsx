import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useApplications } from "@/context/ApplicationContext";
import { formatLocalYMD } from "@/lib/dates";

export default function Interviews() {
  const location = useLocation();
  const { getInterviewsByDate, applications } = useApplications();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Read day from query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const day = params.get("day");
    if (day) {
      const [yyyy, mm, dd] = day.split("-");
      setSelectedDate(new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd)));
    }
  }, [location.search]);

  // Build interview lookup map by day from applications
  const interviewsByDay = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getInterviewsByDate>>();

    // Create a set of all unique dates in applications
    const allDates = new Set<string>();
    applications.forEach((app) => {
      if (app.interviewDate) {
        allDates.add(app.interviewDate);
      }
    });

    // Build the map for each date with interviews
    allDates.forEach((dateKey) => {
      const [y, m, d] = dateKey.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      const interviews = getInterviewsByDate(dateObj);
      if (interviews.length > 0) {
        map.set(dateKey, interviews);
      }
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
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const selectedKey = formatLocalYMD(selectedDate);
  const selectedInterviews = interviewsByDay.get(selectedKey) ?? [];

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-semibold text-primary-text mb-6">Interviews</h1>

      {/* Calendar */}
      <div className="bg-white rounded-[16px] p-4 mb-6 shadow-sm">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary-text">
            {monthName} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-[#F9FAFB] rounded-lg transition"
            >
              <ChevronLeft size={20} className="text-primary-text" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-[#F9FAFB] rounded-lg transition"
            >
              <ChevronRight size={20} className="text-primary-text" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-secondary-text py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} />;
            }

            const dateObj = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const key = formatLocalYMD(dateObj);
            const isSelected = formatLocalYMD(selectedDate) === key;
            const hasInterview = interviewsByDay.has(key);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`relative p-2 rounded-lg text-center transition ${
                  isSelected
                    ? "bg-primary text-white font-semibold"
                    : "text-primary-text hover:bg-[#F9FAFB]"
                }`}
              >
                {day}
                {hasInterview && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Interviews */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-primary-text mb-4">
            {selectedDate.toLocaleDateString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedInterviews.length > 0 ? (
            <div className="space-y-3">
              {selectedInterviews.map((interview) => (
                <Link
                  key={interview.id}
                  to={`/interviews/${interview.id}`}
                  className="block bg-[#FFFBEB] rounded-[16px] p-4 border border-[#FEF3C7] hover:shadow-md hover:border-warning transition group"
                  style={{ minHeight: "80px" }}
                >
                  <div className="font-semibold text-primary-text mb-1 group-hover:text-primary">
                    {interview.company}
                  </div>
                  <div className="text-sm text-secondary-text mb-2">
                    {interview.role}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary-text mb-1">
                    <Clock size={14} />
                    {interview.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary-text">
                    <MapPin size={14} />
                    {interview.location}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-secondary-text text-sm text-center py-6">
              No interviews scheduled for this date
            </p>
          )}
        </div>
      )}
    </div>
  );
}
