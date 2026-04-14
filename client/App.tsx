import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import AddApplication from "./pages/AddApplication";
import Interviews from "./pages/Interviews";
import InterviewDetail from "./pages/InterviewDetail";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import { useInterviewReminders } from "@/hooks/useInterviewReminders";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthSignup from "./pages/auth/AuthSignup";
import AuthReset from "./pages/auth/AuthReset";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminHome from "./pages/auth/AdminHome";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="page-container text-sm text-[#64748b]">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, role, isAuthLoading } = useAuth();

  if (isAuthLoading) return <div className="page-container text-sm text-[#64748b]">Loading session...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default function App() {
  useInterviewReminders();

  return (
    <Routes>
      <Route path="/auth/login" element={<AuthLogin />} />
      <Route path="/auth/signup" element={<AuthSignup />} />
      <Route path="/auth/reset" element={<AuthReset />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminHome />
          </RequireAdmin>
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/applications"
        element={
          <RequireAuth>
            <Layout>
              <Applications />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/applications/:id"
        element={
          <RequireAuth>
            <Layout>
              <ApplicationDetail />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/add"
        element={
          <RequireAuth>
            <Layout>
              <AddApplication />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/interviews"
        element={
          <RequireAuth>
            <Layout>
              <Interviews />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/interviews/:id"
        element={
          <RequireAuth>
            <Layout>
              <InterviewDetail />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/insights"
        element={
          <RequireAuth>
            <Layout>
              <Insights />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Layout>
              <Settings />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
