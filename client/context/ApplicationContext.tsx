import React, { createContext, useContext, useState, ReactNode } from "react";
import { formatLocalYMD } from "../lib/dates";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  dateApplied: string; // ISO date string
  interviewDate?: string; // YYYY-MM-DD format (local date, no timezone)
  interviewTime?: string;
  location?: string;
  notes: string;
  initials: string;
  reminders?: {
    enabled: boolean;
    times: ("24h" | "1h" | "10m")[]; // Which reminders to send
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
  date: string; // ISO date string
  applicationId: string;
}

interface ApplicationContextType {
  applications: Application[];
  interviews: Interview[];
  addApplication: (app: Omit<Application, "id">) => void;
  updateApplication: (id: string, app: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
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

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined
);

// Helper to create mock data with proper date strings
function createMockApplications(): Application[] {
  const today = new Date();
  const in3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const in5Days = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "1",
      company: "Acme Corp",
      role: "Senior Product Manager",
      status: "Interview",
      dateApplied: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      interviewDate: formatLocalYMD(in3Days),
      interviewTime: "10:00 AM",
      location: "San Francisco, CA",
      notes: "Great company, interested in remote options",
      initials: "AC",
    },
    {
      id: "2",
      company: "Tech Startup Inc",
      role: "Full Stack Engineer",
      status: "Interview",
      dateApplied: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      interviewDate: formatLocalYMD(in5Days),
      interviewTime: "2:00 PM",
      location: "Zoom",
      notes: "Series B funded, fast-growing",
      initials: "TS",
    },
    {
      id: "3",
      company: "Design Co",
      role: "UI/UX Designer",
      status: "Rejected",
      dateApplied: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Rejected after first round",
      initials: "DC",
    },
    {
      id: "4",
      company: "Finance Solutions",
      role: "Data Analyst",
      status: "Offer",
      dateApplied: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Pending decision, $120k offer",
      initials: "FS",
    },
    {
      id: "5",
      company: "CloudBase Systems",
      role: "DevOps Engineer",
      status: "Interview",
      dateApplied: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      interviewDate: formatLocalYMD(in7Days),
      interviewTime: "11:30 AM",
      location: "New York, NY",
      notes: "Cloud infrastructure focus",
      initials: "CB",
    },
    {
      id: "6",
      company: "AI Innovations",
      role: "ML Engineer",
      status: "Applied",
      dateApplied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Looking for ML engineers",
      initials: "AI",
    },
    {
      id: "7",
      company: "WebFlow Agency",
      role: "Frontend Developer",
      status: "Applied",
      dateApplied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Remote-friendly, no meetings culture",
      initials: "WA",
    },
    {
      id: "8",
      company: "DataStream Corp",
      role: "Backend Engineer",
      status: "Applied",
      dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Interesting tech stack",
      initials: "DC",
    },
  ];
}

// Mock data with realistic ISO dates
const mockApplicationsData = createMockApplications();

const mockInterviewsData: Interview[] = [
  {
    id: "int-1",
    company: "Acme Corp",
    role: "Senior Product Manager",
    time: "10:00 AM",
    location: "San Francisco, CA",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    applicationId: "1",
  },
  {
    id: "int-2",
    company: "Tech Startup Inc",
    role: "Full Stack Engineer",
    time: "2:00 PM",
    location: "Zoom",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicationId: "2",
  },
  {
    id: "int-3",
    company: "CloudBase Systems",
    role: "DevOps Engineer",
    time: "11:30 AM",
    location: "New York, NY",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    applicationId: "5",
  },
];

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(mockApplicationsData);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviewsData);

  const addApplication = (app: Omit<Application, "id">) => {
    const newApp: Application = {
      ...app,
      id: Date.now().toString(),
    };
    setApplications([...applications, newApp]);
  };

  const updateApplication = (id: string, app: Partial<Application>) => {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, ...app } : a))
    );
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter((a) => a.id !== id));
    setInterviews(interviews.filter((i) => i.applicationId !== id));
  };

  const getApplicationById = (id: string) => {
    return applications.find((a) => a.id === id);
  };

  const getInterviewsByDate = (date: Date) => {
    const key = formatLocalYMD(date);

    return applications
      .filter((a) => a.interviewDate === key)
      .map((a) => ({
        id: a.id,
        company: a.company,
        role: a.role,
        date: a.interviewDate || "",
        time: a.interviewTime ?? "TBD",
        location: a.location ?? "TBD",
        applicationId: a.id,
      }));
  };

  const getApplicationStats = () => {
    return {
      applied: applications.filter((a) => a.status === "Applied").length,
      interviewing: applications.filter((a) => a.status === "Interview").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
      offers: applications.filter((a) => a.status === "Offer").length,
    };
  };

  const getNextInterview = () => {
    const upcoming = applications
      .filter((a) => a.interviewDate)
      .map((a) => ({
        ...a,
        interviewDateObj: new Date(a.interviewDate!),
      }))
      .filter((a) => a.interviewDateObj >= new Date(new Date().toISOString().split("T")[0]))
      .sort((a, b) => a.interviewDateObj.getTime() - b.interviewDateObj.getTime());

    const next = upcoming[0];
    if (!next) return null;

    return {
      id: next.id,
      company: next.company,
      role: next.role,
      date: next.interviewDate || "",
      time: next.interviewTime ?? "TBD",
      location: next.location ?? "TBD",
      applicationId: next.id,
    };
  };

  const getUpcomingInterviews = () => {
    const today = new Date(new Date().toISOString().split("T")[0]);
    const now = today.getTime();

    return applications
      .filter((a) => a.interviewDate)
      .map((a) => {
        const dateObj = new Date(a.interviewDate!);
        return {
          id: a.id,
          company: a.company,
          role: a.role,
          date: dateObj.getTime(),
          time: a.interviewTime,
          location: a.location ?? "TBD",
        };
      })
      .filter((i) => i.date >= now)
      .sort((a, b) => a.date - b.date);
  };

  const getAllInterviews = () => {
    return interviews;
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        interviews,
        addApplication,
        updateApplication,
        deleteApplication,
        getApplicationById,
        getInterviewsByDate,
        getApplicationStats,
        getNextInterview,
        getAllInterviews,
        getUpcomingInterviews,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within ApplicationProvider");
  }
  return context;
}
