import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
   const toggleTheme = () => {
    document.body.classList.toggle('light');
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="card" style={{ display: "flex", justifyContent: "space-between" }}>
      <Link to="/" className="btn-ghost">
        Adaptive Productivity
      </Link>
      <div>
        <button onClick={toggleTheme} className="theme-toggle">🌓</button>
        {!token ? (
          <>
            <Link to="/login" className="btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn-ghost">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="btn-ghost">
              Dashboard
            </Link>
            <button onClick={logout} className="btn-ghost">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}
