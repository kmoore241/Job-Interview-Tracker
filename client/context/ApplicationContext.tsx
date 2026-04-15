import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatLocalYMD, parseLocalDate } from "@/lib/dates";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  dateApplied: string;
  interviewDate?: string;
  interviewTime?: string;
  location?: string;
  notes: string;
  initials: string;
  reminders?: {
    enabled: boolean;
    times: ("24h" | "1h" | "10m")[];
  };
  preparation?: {
    interviewerName?: string;
    meetingLink?: string;
    prepNotes?: string;
    checklist?: {
      id: string;
      text: string;
      completed: boolean;
    }[];
  };
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  time: string;
  location: string;
  date: string;
  applicationId: string;
}

interface ApplicationContextType {
  applications: Application[];
  interviews: Interview[];
  isHydrating: boolean;
  persistenceError: string | null;
  addApplication: (app: Omit<Application, "id">) => Promise<void>;
  updateApplication: (id: string, app: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  clearAllApplications: () => Promise<void>;
  getApplicationById: (id: string) => Application | undefined;
  getInterviewsByDate: (date: Date) => Interview[];
  getApplicationStats: () => {
    applied: number;
    interviewing: number;
    rejected: number;
    offers: number;
  };
  getNextInterview: () => Interview | null;
  getAllInterviews: () => Interview[];
  getUpcomingInterviews: () => Array<{
    id: string;
    company: string;
    role: string;
    date: number;
    time?: string;
    location: string;
  }>;
}

interface ApplicationRow {
  id: string;
  company: string;
  role: string;
  status: Application["status"];
  date_applied: string;
  interview_date: string | null;
  interview_time: string | null;
  location: string | null;
  notes: string | null;
  initials: string | null;
  reminders: Application["reminders"] | null;
  preparation: Application["preparation"] | null;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

function mapDbRowToApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    dateApplied: row.date_applied,
    interviewDate: row.interview_date ?? undefined,
    interviewTime: row.interview_time ?? undefined,
    location: row.location ?? undefined,
    notes: row.notes ?? "",
    initials: row.initials ?? "",
    reminders: row.reminders ?? undefined,
    preparation: row.preparation ?? undefined,
  };
}

function mapApplicationToDbPayload(
  app: Omit<Application, "id"> | Partial<Application>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (app.company !== undefined) payload.company = app.company;
  if (app.role !== undefined) payload.role = app.role;
  if (app.status !== undefined) payload.status = app.status;
  if (app.dateApplied !== undefined) payload.date_applied = app.dateApplied;
  if (app.interviewDate !== undefined) payload.interview_date = app.interviewDate ?? null;
  if (app.interviewTime !== undefined) payload.interview_time = app.interviewTime ?? null;
  if (app.location !== undefined) payload.location = app.location ?? null;
  if (app.notes !== undefined) payload.notes = app.notes;
  if (app.initials !== undefined) payload.initials = app.initials;
  if (app.reminders !== undefined) payload.reminders = app.reminders ?? null;
  if (app.preparation !== undefined) payload.preparation = app.preparation ?? null;

  return payload;
}

function toInterview(application: Application): Interview | null {
  if (!application.interviewDate) return null;

  return {
    id: application.id,
    company: application.company,
    role: application.role,
    time: application.interviewTime ?? "TBD",
    location: application.location ?? "TBD",
    date: application.interviewDate,
    applicationId: application.id,
  };
}

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      if (!user) {
        if (!active) return;
        setApplications([]);
        setPersistenceError(null);
        setIsHydrating(false);
        return;
      }

      setIsHydrating(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("date_applied", { ascending: false })
        .execute();

      if (!active) return;

      if (error) {
        setApplications([]);
        setPersistenceError(error.message);
      } else {
        const rows = (data ?? []) as ApplicationRow[];
        setApplications(rows.map(mapDbRowToApplication));
        setPersistenceError(null);
      }

      setIsHydrating(false);
    };

    hydrate();

    return () => {
      active = false;
    };
  }, [user]);

  const interviews = useMemo(() => {
    return applications
      .map((application) => toInterview(application))
      .filter((interview): interview is Interview => Boolean(interview));
  }, [applications]);

  const addApplication = useCallback(
    async (app: Omit<Application, "id">) => {
      if (!user) return;

      const { data, error } = await supabase
        .from("applications")
        .insert({ ...mapApplicationToDbPayload(app), user_id: user.id })
        .select("*")
        .single();

      if (error) {
        setPersistenceError(error.message);
        return;
      }

      if (!data) {
        setPersistenceError("No application was returned after create.");
        return;
      }

      setPersistenceError(null);
      setApplications((prev) => [mapDbRowToApplication(data as ApplicationRow), ...prev]);
    },
    [user],
  );

  const updateApplication = useCallback(
    async (id: string, app: Partial<Application>) => {
      if (!user) return;

      const { data, error } = await supabase
        .from("applications")
        .update(mapApplicationToDbPayload(app))
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        setPersistenceError(error.message);
        return;
      }

      if (!data) {
        setPersistenceError("No application was returned after update.");
        return;
      }

      setPersistenceError(null);
      setApplications((prev) =>
        prev.map((existing) =>
          existing.id === id ? mapDbRowToApplication(data as ApplicationRow) : existing,
        ),
      );
    },
    [user],
  );

  const deleteApplication = useCallback(
    async (id: string) => {
      if (!user) return;

      const { error } = await supabase.from("applications").delete().eq("id", id).execute();

      if (error) {
        setPersistenceError(error.message);
        return;
      }

      setPersistenceError(null);
      setApplications((prev) => prev.filter((existing) => existing.id !== id));
    },
    [user],
  );

  const clearAllApplications = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("user_id", user.id)
      .execute();

    if (error) {
      setPersistenceError(error.message);
      return;
    }

    setPersistenceError(null);
    setApplications([]);
  }, [user]);

  const getApplicationById = useCallback(
    (id: string) => applications.find((application) => application.id === id),
    [applications],
  );

  const getInterviewsByDate = useCallback(
    (date: Date) => {
      const targetDate = formatLocalYMD(date);
      return interviews.filter((interview) => interview.date === targetDate);
    },
    [interviews],
  );

  const getApplicationStats = useCallback(() => {
    return {
      applied: applications.filter((application) => application.status === "Applied").length,
      interviewing: applications.filter((application) => application.status === "Interview").length,
      rejected: applications.filter((application) => application.status === "Rejected").length,
      offers: applications.filter((application) => application.status === "Offer").length,
    };
  }, [applications]);

  const getNextInterview = useCallback((): Interview | null => {
    const today = parseLocalDate(formatLocalYMD(new Date())).getTime();

    const next = interviews
      .map((interview) => ({
        interview,
        time: parseLocalDate(interview.date).getTime(),
      }))
      .filter((item) => item.time >= today)
      .sort((a, b) => a.time - b.time)[0];

    return next?.interview ?? null;
  }, [interviews]);

  const getAllInterviews = useCallback(() => interviews, [interviews]);

  const getUpcomingInterviews = useCallback(() => {
    const today = parseLocalDate(formatLocalYMD(new Date())).getTime();

    return interviews
      .map((interview) => ({
        id: interview.id,
        company: interview.company,
        role: interview.role,
        date: parseLocalDate(interview.date).getTime(),
        time: interview.time,
        location: interview.location,
      }))
      .filter((interview) => interview.date >= today)
      .sort((a, b) => a.date - b.date);
  }, [interviews]);

  const value = useMemo<ApplicationContextType>(
    () => ({
      applications,
      interviews,
      isHydrating,
      persistenceError,
      addApplication,
      updateApplication,
      deleteApplication,
      clearAllApplications,
      getApplicationById,
      getInterviewsByDate,
      getApplicationStats,
      getNextInterview,
      getAllInterviews,
      getUpcomingInterviews,
    }),
    [
      applications,
      interviews,
      isHydrating,
      persistenceError,
      addApplication,
      updateApplication,
      deleteApplication,
      clearAllApplications,
      getApplicationById,
      getInterviewsByDate,
      getApplicationStats,
      getNextInterview,
      getAllInterviews,
      getUpcomingInterviews,
    ],
  );

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within ApplicationProvider");
  }
  return context;
}
