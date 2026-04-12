type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED";

export interface SupabaseUser {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token?: string;
  user: SupabaseUser;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_KEY = "jit.supabase.session";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

class SupabaseLikeClient {
  private listeners = new Set<(event: AuthChangeEvent, session: SupabaseSession | null) => void>();

  private get session(): SupabaseSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SupabaseSession;
    } catch {
      return null;
    }
  }

  private setSession(session: SupabaseSession | null, event: AuthChangeEvent) {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }

    this.listeners.forEach((listener) => listener(event, session));
  }

  auth = {
    getSession: async () => ({ data: { session: this.session } }),

    onAuthStateChange: (callback: (event: AuthChangeEvent, session: SupabaseSession | null) => void) => {
      this.listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.listeners.delete(callback);
            },
          },
        },
      };
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();
      if (!res.ok) return { error: { message: body.msg ?? body.message ?? "Sign in failed" } };

      const session: SupabaseSession = {
        access_token: body.access_token,
        refresh_token: body.refresh_token,
        user: body.user,
      };
      this.setSession(session, "SIGNED_IN");
      return { data: { session }, error: null };
    },

    signUp: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) return { error: { message: body.msg ?? body.message ?? "Sign up failed" }, data: { session: null } };

      const session = body.access_token
        ? ({ access_token: body.access_token, refresh_token: body.refresh_token, user: body.user } as SupabaseSession)
        : null;
      if (session) this.setSession(session, "SIGNED_IN");

      return { data: { session }, error: null };
    },

    signInWithOAuth: async ({ provider, options }: { provider: string; options?: { redirectTo?: string } }) => {
      const redirectTo = encodeURIComponent(options?.redirectTo ?? window.location.origin);
      const url = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}`;
      window.location.assign(url);
      return { error: null };
    },

    resetPasswordForEmail: async (email: string, { redirectTo }: { redirectTo?: string }) => {
      const res = await fetch(`${supabaseUrl}/auth/v1/recover`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, redirect_to: redirectTo }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return { error: { message: body.msg ?? body.message ?? "Reset failed" } };
      return { error: null };
    },

    signOut: async () => {
      this.setSession(null, "SIGNED_OUT");
      return { error: null };
    },
  };

  from(table: string) {
    return new PostgrestBuilder(table, () => this.session?.access_token);
  }

  async rpc(fn: string) {
    const token = this.session?.access_token;
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: { message: body.message ?? "RPC failed" } };
    }

    return { error: null };
  }
}

class PostgrestBuilder {
  private filters: string[] = [];
  private orderBy = "";
  private mode: "select" | "insert" | "update" | "delete" = "select";
  private payload: any = null;
  private wantsSingle = false;
  private tokenGetter: () => string | undefined;

  constructor(private table: string, tokenGetter: () => string | undefined) {
    this.tokenGetter = tokenGetter;
  }

  select(_columns?: string) {
    this.mode = "select";
    return this;
  }

  order(column: string, { ascending }: { ascending: boolean }) {
    this.orderBy = `order=${column}.${ascending ? "asc" : "desc"}`;
    return this;
  }

  insert(payload: any) {
    this.mode = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: any) {
    this.mode = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  eq(column: string, value: string) {
    this.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
    return this;
  }

  single() {
    this.wantsSingle = true;
    return this.execute();
  }

  maybeSingle() {
    this.wantsSingle = true;
    return this.execute();
  }


  async execute() {
    const params = ["select=*", ...this.filters];
    if (this.orderBy) params.push(this.orderBy);

    const query = params.join("&");
    const url = `${supabaseUrl}/rest/v1/${this.table}?${query}`;
    const token = this.tokenGetter();

    const method = this.mode === "select" ? "GET" : this.mode === "insert" ? "POST" : this.mode === "update" ? "PATCH" : "DELETE";

    const res = await fetch(url, {
      method,
      headers: {
        apikey: supabaseAnonKey,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        Prefer: this.mode === "select" ? "" : "return=representation",
      },
      body: this.mode === "select" || this.mode === "delete" ? undefined : JSON.stringify(this.payload),
    });

    const body = await res.json().catch(() => []);
    if (!res.ok) return { data: null, error: { message: body.message ?? "Database request failed" } };

    const data = this.wantsSingle ? (Array.isArray(body) ? body[0] ?? null : body) : body;
    return { data, error: null };
  }
}

export const supabase = new SupabaseLikeClient();
