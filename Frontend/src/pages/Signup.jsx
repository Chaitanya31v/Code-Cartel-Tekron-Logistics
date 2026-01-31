import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Signup failed");
      }
      // On success, redirect to login
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Sign up</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded">
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">Create account</button>
            <button type="button" onClick={() => navigate("/login")} className="text-sm text-slate-500">Have an account? Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
