import { Link, useLocation } from "react-router-dom";
import { Home, BriefcaseBusiness, CalendarDays, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { path: "/interviews", label: "Interviews", icon: CalendarDays },
  { path: "/insights", label: "Insights", icon: LineChart },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#e8ecf2] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[84px] w-full max-w-[520px] items-center justify-around px-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex w-[72px] flex-col items-center gap-1 rounded-2xl py-2 transition",
                isActive ? "text-primary" : "text-[#8c97a8]"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
