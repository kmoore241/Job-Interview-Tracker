import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthReset() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await sendPasswordReset(email);
    setMessage(error ?? "Password reset email sent.");
  };

  return (
    <div className="page-container max-w-md mx-auto space-y-4">
      <h1 className="page-title text-[30px]">Reset password</h1>
      {message && <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</div>}
      <form onSubmit={handleSubmit} className="surface-card p-4 space-y-3">
        <input className="input-native" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white" type="submit">Send reset email</button>
      </form>
      <Link to="/auth/login" className="text-primary font-medium text-sm">Back to sign in</Link>
    </div>
  );
}
