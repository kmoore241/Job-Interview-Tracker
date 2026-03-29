import { useMemo } from "react";
import { useApplications } from "@/context/ApplicationContext";

export default function Insights() {
  const { applications, getApplicationStats } = useApplications();
  const stats = getApplicationStats();
  const total = applications.length;

  const rates = useMemo(() => {
    const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);
    return {
      interview: pct(stats.interviewing + stats.offers + stats.rejected),
      offer: pct(stats.offers),
      rejection: pct(stats.rejected),
    };
  }, [stats, total]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 4 }).map((_, idx) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (3 - idx), 1);
      const label = monthDate.toLocaleDateString(undefined, { month: "short" });
      const count = applications.filter((app) => {
        const d = new Date(app.dateApplied);
        return d.getFullYear() === monthDate.getFullYear() && d.getMonth() === monthDate.getMonth();
      }).length;
      return { label, count };
    });
  }, [applications]);

  const max = Math.max(...monthlyTrend.map((m) => m.count), 1);

  return (
    <div className="page-container space-y-6">
      <header>
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Performance metrics and trends across your application pipeline.</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <div className="surface-card p-4">
          <p className="group-label">Total applications</p>
          <p className="text-3xl font-semibold text-[#0f172a]">{total}</p>
        </div>
        <div className="surface-card p-4">
          <p className="group-label">Interview rate</p>
          <p className="text-3xl font-semibold text-[#0f172a]">{rates.interview}%</p>
        </div>
        <div className="surface-card p-4">
          <p className="group-label">Offer rate</p>
          <p className="text-3xl font-semibold text-emerald-700">{rates.offer}%</p>
        </div>
        <div className="surface-card p-4">
          <p className="group-label">Rejection rate</p>
          <p className="text-3xl font-semibold text-rose-700">{rates.rejection}%</p>
        </div>
      </section>

      <section className="surface-card p-5 space-y-4">
        <h2 className="section-title">Application trend (last 4 months)</h2>
        {monthlyTrend.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-[#e9edf4]">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="surface-card p-5">
        <h2 className="section-title mb-4">Pipeline distribution</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span className="text-[#6b7280]">Applied</span><span className="font-semibold">{stats.applied}</span></div>
          <div className="flex items-center justify-between"><span className="text-[#6b7280]">Interviewing</span><span className="font-semibold">{stats.interviewing}</span></div>
          <div className="flex items-center justify-between"><span className="text-[#6b7280]">Offers</span><span className="font-semibold text-emerald-700">{stats.offers}</span></div>
          <div className="flex items-center justify-between"><span className="text-[#6b7280]">Rejected</span><span className="font-semibold text-rose-700">{stats.rejected}</span></div>
        </div>
      </section>
    </div>
  );
}
