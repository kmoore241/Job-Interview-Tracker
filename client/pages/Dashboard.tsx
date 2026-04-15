import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarClock, CheckCircle2, CircleX, TrendingUp } from "lucide-react";
import { useApplications } from "@/context/ApplicationContext";

export default function Dashboard() {
  const { applications, getApplicationStats, getUpcomingInterviews, isHydrating } = useApplications();
  const stats = getApplicationStats();
  const upcoming = getUpcomingInterviews().slice(0, 3);
  const recent = [...applications]
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
    .slice(0, 4);

  const total = applications.length;
  const interviewRate = total ? Math.round((stats.interviewing / total) * 100) : 0;

  const summaryCards = [
    { label: "Applications", value: total, icon: Briefcase, tone: "text-sky-700 bg-sky-50" },
    { label: "Interviews", value: stats.interviewing, icon: CalendarClock, tone: "text-amber-700 bg-amber-50" },
    { label: "Offers", value: stats.offers, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50" },
    { label: "Rejected", value: stats.rejected, icon: CircleX, tone: "text-rose-700 bg-rose-50" },
  ];

  return (
    <div className="page-container space-y-6">
      {isHydrating && <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs text-[#64748b]">Loading your tracker data...</div>}
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your job search at a glance, with focus on what is next.</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        {summaryCards.map((item) => (
          <div key={item.label} className="surface-card p-4">
            <div className={`inline-flex rounded-xl p-2 ${item.tone}`}>
              <item.icon size={16} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#0f172a]">{item.value}</p>
            <p className="text-xs text-[#6b7280]">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="surface-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="group-label">Pipeline health</p>
            <p className="text-2xl font-semibold text-[#0f172a]">{interviewRate}% interview rate</p>
          </div>
          <TrendingUp className="text-primary" size={20} />
        </div>
        <div className="mt-4 h-2 rounded-full bg-[#e9edf4]">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(interviewRate, 100)}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px]">
          <div>
            <p className="font-semibold text-sky-700">{stats.applied}</p>
            <p className="text-[#768193]">Applied</p>
          </div>
          <div>
            <p className="font-semibold text-amber-700">{stats.interviewing}</p>
            <p className="text-[#768193]">Interview</p>
          </div>
          <div>
            <p className="font-semibold text-emerald-700">{stats.offers}</p>
            <p className="text-[#768193]">Offers</p>
          </div>
          <div>
            <p className="font-semibold text-rose-700">{stats.rejected}</p>
            <p className="text-[#768193]">Rejected</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Upcoming interviews</h2>
          <Link to="/interviews" className="text-xs font-semibold text-primary inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="surface-card p-5 text-sm text-[#7b8698]">No interviews scheduled yet.</div>
        ) : (
          upcoming.map((item) => (
            <Link key={item.id} to={`/interviews/${item.id}`} className="list-row">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 grid place-items-center text-amber-700 text-xs font-semibold">
                {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0f172a] truncate">{item.company}</p>
                <p className="text-xs text-[#6b7280] truncate">{item.role} · {item.time ?? "TBD"}</p>
              </div>
              <ArrowRight size={16} className="text-[#9aa3b2]" />
            </Link>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Recent activity</h2>
        <div className="surface-card p-2">
          {recent.length === 0 ? (
            <div className="form-row text-sm text-[#64748b]">No activity yet. Add your first application to begin.</div>
          ) : recent.map((app, idx) => (
            <Link
              key={app.id}
              to={`/applications/${app.id}`}
              className={`form-row ${idx !== 0 ? "form-row-divider" : ""}`}
            >
              <p className="text-sm font-semibold text-[#0f172a]">{app.company}</p>
              <p className="text-xs text-[#6b7280]">{app.role} · {app.status}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
