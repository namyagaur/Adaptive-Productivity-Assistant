import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [mood, setMood] = useState(localStorage.getItem("mood") || "");
  const [tip, setTip] = useState("");
  const [quote, setQuote] = useState("");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/api/tasks");
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    const res = await API.post("/api/tasks", form);
    setTasks([res.data.task, ...tasks]);
    setForm({ title: "", description: "", priority: "medium" });
  };

  const toggleComplete = async (id, currentStatus) => {
    await API.put(`/api/tasks/${id}`, { completed: !currentStatus });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/api/tasks/${id}`);
    fetchTasks();
  };

  // 🧘 Mood tracker
  const handleMood = (m) => {
    setMood(m);
    localStorage.setItem("mood", m);
  };

  // ⏱ Pomodoro Timer
  useEffect(() => {
    let timer;
    if (running && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      alert("Session complete! 🎉 Take a 5-min break.");
      setRunning(false);
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // 🌤 Tips & Quotes
  useEffect(() => {
    const tips = [
      "💡 Break big goals into smaller steps.",
      "🎧 Try focus music for deep work.",
      "🌤 Do your hardest task before noon.",
      "🧘 Take 5-min breathing breaks hourly.",
    ];
    const quotes = [
      "Success is built on small daily wins.",
      "Discipline beats motivation.",
      "Your future depends on what you do today.",
    ];
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="container">
      <h1>Adaptive Productivity Assistant ✨</h1>

      {/* AI Tip */}
      <div className="card" style={{ textAlign: "center" }}>
        <h3>AI Focus Suggestion 🤖</h3>
        <p>{tip}</p>
      </div>

      {/* Mood */}
      <div className="card">
        <h3>How are you feeling today?</h3>
        <div className="mood-options">
          {["🔥", "😌", "😴", "💭", "🧘"].map((m) => (
            <button
              key={m}
              className={`mood-btn ${mood === m ? "active" : ""}`}
              onClick={() => handleMood(m)}
            >
              {m}
            </button>
          ))}
        </div>
        {mood && <p>Current mood: {mood}</p>}
      </div>

      {/* Stats */}
      <div className="card">
        <h3>📊 Productivity Stats</h3>
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {completedCount}</p>
      </div>

      {/* Timer */}
      <div className="card">
        <h3>Pomodoro Timer ⏱️</h3>
        <p style={{ fontSize: "2rem" }}>{formatTime(timeLeft)}</p>
        <button className="btn" onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            setRunning(false);
            setTimeLeft(25 * 60);
          }}
        >
          Reset
        </button>
      </div>

      {/* Add Task */}
      <div className="card">
        <h2>Add Task</h2>
        <form onSubmit={addTask} className="row">
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button className="btn">Add</button>
        </form>
      </div>

      {/* Active Tasks */}
      <div className="card">
        <h2>📝 Active Tasks</h2>
        {tasks.filter((t) => !t.completed).length === 0 ? (
          <p>No active tasks.</p>
        ) : (
          tasks
            .filter((t) => !t.completed)
            .map((t) => (
              <div key={t._id} className={`task ${t.priority}`}>
                <div>
                  <strong>{t.title}</strong>
                  <br />
                  <small>{t.description}</small>
                </div>
                <div className="row">
                  <button
                    className="btn"
                    onClick={() => toggleComplete(t._id, t.completed)}
                  >
                    ✅ Done
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => deleteTask(t._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Completed Tasks */}
      <div className="card">
        <h2>🎯 Completed Tasks</h2>
        {completedCount === 0 ? (
          <p>No completed tasks yet.</p>
        ) : (
          tasks
            .filter((t) => t.completed)
            .map((t) => (
              <div
                key={t._id}
                className="task completed"
                style={{
                  opacity: 0.7,
                  textDecoration: "line-through",
                  borderLeftColor: "#10b981",
                }}
              >
                <div>
                  <strong>{t.title}</strong>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => toggleComplete(t._id, t.completed)}
                >
                  🔁 Undo
                </button>
              </div>
            ))
        )}
      </div>

      {/* Quote */}
      <div className="card">
        <h3>🌤 Daily Motivation</h3>
        <p>“{quote}”</p>
      </div>
    </div>
  );
}
