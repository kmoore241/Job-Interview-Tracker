import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAddPage = location.pathname === "/add";

  return (
    <div className="app-shell">
      <div className="mx-auto w-full max-w-[520px] min-h-screen bg-transparent relative">
        <main className="pb-[96px]">{children}</main>

        {!isAddPage && (
          <Link
            to="/add"
            aria-label="Add application"
            className="fixed bottom-[104px] right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-[0_14px_30px_rgba(59,130,246,0.35)] transition hover:scale-[1.03]"
          >
            <Plus size={24} />
          </Link>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
