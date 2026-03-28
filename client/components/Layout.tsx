import BottomNav from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      <div className="flex-1 pb-[70px] overflow-y-auto">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
