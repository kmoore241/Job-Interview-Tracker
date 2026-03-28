import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import AddApplication from "./pages/AddApplication";
import Interviews from "./pages/Interviews";
import InterviewDetail from "./pages/InterviewDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useInterviewReminders } from "@/hooks/useInterviewReminders";

export default function App() {
  // Enable interview reminders globally
  useInterviewReminders();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/applications"
        element={
          <Layout>
            <Applications />
          </Layout>
        }
      />
      <Route
        path="/applications/:id"
        element={
          <Layout>
            <ApplicationDetail />
          </Layout>
        }
      />
      <Route
        path="/add"
        element={
          <Layout>
            <AddApplication />
          </Layout>
        }
      />
      <Route
        path="/interviews"
        element={
          <Layout>
            <Interviews />
          </Layout>
        }
      />
      <Route
        path="/interviews/:id"
        element={
          <Layout>
            <InterviewDetail />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
