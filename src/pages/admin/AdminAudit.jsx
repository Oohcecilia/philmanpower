import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import { Clock, User } from "lucide-react";

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const entity = await jsonService.getEntity('AuditLog');
      entity.list("-created_date", 100).then(r => {
        setLogs(r);
        setLoading(false);
      });
    }
    load();
  }, []);

  const ACTION_COLORS = {
    Updated: "bg-blue-50 text-blue-600",
    Created: "bg-green-50 text-green-600",
    Deleted: "bg-red-50 text-red-500",
  };

  return (
    <AdminGuard>
      <PageHeader title="Audit Log" description="Track all content changes and admin activity" />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No activity logged yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Section</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{log.section}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-xs truncate">{log.description}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      {log.user_email || "System"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {log.created_date ? new Date(log.created_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminGuard>
  );
}