import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/api/auth/login", form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setMsg("✅ Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "❌ Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px" }}>
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
          <button className="btn" type="submit">
            Login
          </button>
        </form>
        {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#e11d48", cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
