import React, { useEffect, useState } from "react";
import { apiFetch, hydrateBasicTokenFromSession } from "../api/client";

/** Checks /api/auth/me; redirects to /login on 401 */
export default function RequireAuth({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let active = true;
    hydrateBasicTokenFromSession();

    apiFetch("/api/auth/me")
      .then((r) => active && setAllowed(r.ok))
      .catch(() => active && setAllowed(false));
    return () => {
      active = false;
    };
  }, []);

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center animate-bounce">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
          </div>
          <span className="text-xs font-semibold text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!allowed) {
    window.location.replace("/login");
    return null;
  }

  return <>{children}</>;
}
