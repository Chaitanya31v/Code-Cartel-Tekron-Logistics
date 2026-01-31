import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

    fetchMe();
  }, [navigate]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">Logout</button>
          </div>
        </div>

        {user ? (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
            <p className="mt-2 text-sm text-slate-600">Role: {user.role}</p>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
