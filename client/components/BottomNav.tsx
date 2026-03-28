import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Plus,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/applications", label: "Applications", icon: FileText },
  { path: "/add", label: "Add", icon: Plus },
  { path: "/interviews", label: "Interviews", icon: Calendar },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider">
      <div className="flex items-center justify-around h-[70px]">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-transform active:scale-95",
                isActive ? "text-primary" : "text-[#9CA3AF]"
              )}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
