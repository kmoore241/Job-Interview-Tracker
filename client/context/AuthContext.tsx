import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, SupabaseSession, SupabaseUser } from "@/lib/supabase";

type AppRole = "user" | "admin";

interface AuthContextType {
  session: SupabaseSession | null;
  user: SupabaseUser | null;
  role: AppRole;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string; needsEmailVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  deleteAccount: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<AppRole>("user");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsAuthLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      if (!user) {
        setRole("user");
        return;
      }

      const metadataRole = user.app_metadata?.role;
      if (metadataRole === "admin" || metadataRole === "user") {
        setRole(metadataRole);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (data?.role === "admin" || data?.role === "user") {
        setRole(data.role);
      } else {
        setRole("user");
      }
    };

    loadRole();
  }, [user]);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      user,
      role,
      isAuthLoading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return {};
      },
      signUp: async (email, password) => {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message };
        return { needsEmailVerification: !data.session };
      },
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });
        if (error) return { error: error.message };
        return {};
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      sendPasswordReset: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        });
        if (error) return { error: error.message };
        return {};
      },
      deleteAccount: async () => {
        const { error } = await supabase.rpc("delete_my_account");
        if (error) return { error: error.message };
        await supabase.auth.signOut();
        return {};
      },
    }),
    [session, user, role, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
