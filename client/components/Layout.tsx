import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import OnboardingModal from "./OnboardingModal";

const ONBOARDING_KEY = "jit.onboarding.complete";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAddPage = location.pathname === "/add";
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setShowOnboarding(true);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  return (
    <div className="app-shell">
      <div className="mx-auto w-full max-w-[520px] min-h-screen bg-transparent relative">
        <main className="pb-[calc(96px+env(safe-area-inset-bottom))]" role="main">
          {children}
        </main>

        {!isAddPage && (
          <Link
            to="/add"
            aria-label="Add application"
            className="fixed bottom-[calc(104px+env(safe-area-inset-bottom))] right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-[0_14px_30px_rgba(59,130,246,0.35)] transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <Plus size={24} />
          </Link>
        )}

        <BottomNav />
      </div>

      <OnboardingModal open={showOnboarding} onClose={completeOnboarding} />
    </div>
  );
}
