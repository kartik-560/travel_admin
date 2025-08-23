import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

/** Checks /api/auth/me; redirects to /login on 401 */
export default function RequireAuth({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let active = true;
    apiFetch("/api/auth/me")
      .then((r) => active && setAllowed(r.ok))
      .catch(() => active && setAllowed(false));
    return () => { active = false; };
  }, []);

  if (allowed === null) return null; // simple "loading gate"
  if (!allowed) {
    window.location.replace("/login");
    return null;
  }
  return <>{children}</>;
}
