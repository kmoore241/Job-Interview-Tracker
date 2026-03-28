import { Briefcase, Users, X, Gift, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import { useApplications } from "@/context/ApplicationContext";

export default function Dashboard() {
  const { getApplicationStats, getUpcomingInterviews } = useApplications();
  const stats_data = getApplicationStats();
  const upcomingInterviews = getUpcomingInterviews();

  const stats = [
    {
      label: "Applied",
      count: stats_data.applied,
      icon: Briefcase,
      color: "#3B82F6",
    },
    {
      label: "Interviewing",
      count: stats_data.interviewing,
      icon: Users,
      color: "#F59E0B",
    },
    {
      label: "Rejected",
      count: stats_data.rejected,
      icon: X,
      color: "#EF4444",
    },
    {
      label: "Offers",
      count: stats_data.offers,
      icon: Gift,
      color: "#8B5CF6",
    },
  ];

  const totalApplied = stats_data.applied;

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Greeting Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary-text">
          Good Afternoon, Kennedy
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          You've applied to {totalApplied} job{totalApplied !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-4 w-max">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                {...stat}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary-text mb-3">
            Upcoming Interviews
          </h2>

          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
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
                {interview.time && (
                  <div className="flex items-center gap-2 text-xs text-secondary-text mb-1">
                    <Clock size={14} />
                    {interview.time}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-secondary-text">
                  <MapPin size={14} />
                  {interview.location}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
