"use client";

import { useState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div className="admin-card">
      <h1 className="admin-title" style={{ marginBottom: "0.75rem" }}>
        Admin Login
      </h1>
      <p className="admin-note" style={{ marginBottom: "1.25rem" }}>
        Sign in to add, edit, or remove portfolio projects.
      </p>
      <form action={handleSubmit} className="admin-grid">
        <div>
          <label className="admin-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="admin-input"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="admin-error">{error}</p>}
      </form>
    </div>
  );
}
