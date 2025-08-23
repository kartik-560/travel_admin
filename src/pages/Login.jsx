import React, { useState } from "react";
import { apiFetch, setBasicToken, clearBasicToken } from "../api/client";
import "./styles/Login.css"; // 👈 import CSS file

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const basicHeader = "Basic " + btoa(`${email.trim()}:${password}`);
      setBasicToken(basicHeader);

      const res = await apiFetch("/api/auth/me");
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();

      sessionStorage.setItem("adminName", data?.user?.name || "Admin");
      window.location.replace("/");
    } catch (e) {
      clearBasicToken();
      setErr(e.message === "unauthorized" ? "Invalid email or password" : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h1 className="login-title">Admin Login</h1>

        <label className="login-label">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="username"
          />
        </label>

        <label className="login-label">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        {err && <div className="login-error">{err}</div>}

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
