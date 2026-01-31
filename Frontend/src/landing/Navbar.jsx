import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Smooth scroll helper with offset for fixed navbar
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80; // offset for fixed navbar
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    setIsLoggedIn(Boolean(localStorage.getItem("token")));

    const onStorage = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-md shadow-lg py-4 border-b border-slate-800" : "bg-transparent py-6"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div
          className="text-white font-bold text-xl tracking-tight flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-slate-900 font-bold text-lg">L</span>
          </div>
          LogiNav
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#problem" onClick={(e) => { e.preventDefault(); scrollToSection('problem'); }} className="hover:text-white transition-colors">
            The Problem
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
            className="hover:text-white transition-colors"
          >
            How it Works
          </a>
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-white transition-colors">
            Features
          </a>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-sm text-slate-200 hover:text-white">Dashboard</Link>
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-200 hover:text-white">Login</Link>
              <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar
