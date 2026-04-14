import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await signIn(email, password);
    if (error) {
      setMessage(error);
      setLoading(false);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="page-container max-w-md mx-auto space-y-4">
      <h1 className="page-title text-[30px]">Sign in</h1>
      <p className="page-subtitle">Access your private interview tracker.</p>

      {message && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</div>}

      <form onSubmit={handleSubmit} className="surface-card p-4 space-y-3">
        <input className="input-native" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input-native" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <button onClick={() => signInWithGoogle()} className="w-full rounded-2xl border border-[#e5e7eb] bg-white py-3 text-sm font-semibold text-[#0f172a]">
        Continue with Google
      </button>

      <div className="flex justify-between text-sm">
        <Link to="/auth/signup" className="text-primary font-medium">Create account</Link>
        <Link to="/auth/reset" className="text-primary font-medium">Forgot password?</Link>
      </div>
    </div>
  );
}
