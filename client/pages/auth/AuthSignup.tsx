import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthSignup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { error, needsEmailVerification } = await signUp(email, password);
    if (error) {
      setMessage(error);
    } else {
      setMessage(needsEmailVerification ? "Check your email to confirm your account." : "Account created. You can sign in now.");
    }
    setLoading(false);
  };

  return (
    <div className="page-container max-w-md mx-auto space-y-4">
      <h1 className="page-title text-[30px]">Create account</h1>
      {message && <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</div>}
      <form onSubmit={handleSubmit} className="surface-card p-4 space-y-3">
        <input className="input-native" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input-native" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        <button className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <Link to="/auth/login" className="text-primary font-medium text-sm">Back to sign in</Link>
    </div>
  );
}
