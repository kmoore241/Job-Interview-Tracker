import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    const { error } = await signIn(email, password);
    if (error) {
      setMessage(error);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="page-container max-w-md mx-auto space-y-4">
      <h1 className="page-title text-[30px]">Admin sign in</h1>
      {message && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</div>}
      <form onSubmit={handleSubmit} className="surface-card p-4 space-y-3">
        <input className="input-native" type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input-native" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white" type="submit">Continue</button>
      </form>
    </div>
  );
}
