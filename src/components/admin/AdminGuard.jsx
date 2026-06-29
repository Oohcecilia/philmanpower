import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jsonService from "@/lib/jsonService";
import AdminLayout from "./AdminLayout";

export default function AdminGuard({ children }) {
  const [state, setState] = useState("loading"); // loading | ok | forbidden | unauthenticated
  const [user, setUser] = useState(null);

  useEffect(() => {
    jsonService.auth.me()
      .then((u) => {
        setUser(u);
        if (u.role === "admin") setState("ok");
        else setState("forbidden");
      })
      .catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin" />
    </div>
  );
  if (state === "unauthenticated") return <Navigate to="/login" replace />;
  if (state === "forbidden") return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-4xl mb-3">🚫</div>
        <h2 className="text-lg font-semibold text-slate-800">Access Denied</h2>
        <p className="text-sm text-slate-500 mt-1">Admin access required.</p>
        <a href="/" className="mt-4 inline-block text-sm text-orange-600 hover:underline">Go Home</a>
      </div>
    </div>
  );

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
