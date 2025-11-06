import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/api/auth/register", form);
      setMsg(res.data.message || "✅ Registered successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px" }}>
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={onSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
          <button className="btn" type="submit">
            Register
          </button>
        </form>
        {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#e11d48", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
