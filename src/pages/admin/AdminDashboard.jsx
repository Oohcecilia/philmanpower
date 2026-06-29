import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import { Mail, Star, HelpCircle, GitBranch, Building2, Briefcase, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function StatCard({ icon: IconComp, label, value, to, color }) {
  return (
    <Link to={to} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <IconComp size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value ?? <span className="text-slate-300 text-lg animate-pulse">...</span>}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [newSubmissions, setNewSubmissions] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    async function loadData() {
      const contactEntity = await jsonService.getEntity('ContactSubmission');
      const testimonialEntity = await jsonService.getEntity('Testimonial');
      const faqEntity = await jsonService.getEntity('FAQ');
      const serviceEntity = await jsonService.getEntity('Service');
      const industryEntity = await jsonService.getEntity('Industry');
      const processEntity = await jsonService.getEntity('ProcessStep');
      const auditEntity = await jsonService.getEntity('AuditLog');

      const [sub, t, f, s, i, p, audit] = await Promise.all([
        contactEntity.filter({ status: "new" }).then(r => ({ newSubmissions: r.length, sub: r.slice(0, 5) })),
        testimonialEntity.list().then(r => ({ testimonials: r.length })),
        faqEntity.list().then(r => ({ faq: r.length })),
        serviceEntity.list().then(r => ({ services: r.length })),
        industryEntity.list().then(r => ({ industries: r.length })),
        processEntity.list().then(r => ({ steps: r.length })),
        auditEntity.list("-created_date", 8).then(r => r),
      ]);
      setCounts({ ...sub, ...t, ...f, ...s, ...i, ...p });
      setNewSubmissions(sub.sub);
      setAuditLog(audit);
    }
    loadData().catch(() => {});
  }, []);

  const quickActions = [
    { label: "Edit Hero", to: "/admin/content", icon: FileText },
    { label: "Add FAQ", to: "/admin/faq", icon: HelpCircle },
    { label: "View Submissions", to: "/admin/submissions", icon: Mail },
    { label: "Manage Testimonials", to: "/admin/testimonials", icon: Star },
  ];

  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome to the PhilManPower CMS</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={Mail} label="New Submissions" value={counts.newSubmissions} to="/admin/submissions" color="bg-orange-500" />
          <StatCard icon={Star} label="Testimonials" value={counts.testimonials} to="/admin/testimonials" color="bg-blue-500" />
          <StatCard icon={HelpCircle} label="FAQ Items" value={counts.faq} to="/admin/faq" color="bg-purple-500" />
          <StatCard icon={Briefcase} label="Services" value={counts.services} to="/admin/services" color="bg-emerald-500" />
          <StatCard icon={Building2} label="Industries" value={counts.industries} to="/admin/industries" color="bg-cyan-500" />
          <StatCard icon={GitBranch} label="Process Steps" value={counts.steps} to="/admin/process" color="bg-rose-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* New submissions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Mail size={16} className="text-orange-500" /> New Submissions
            </h2>
            {newSubmissions.length === 0 ? (
              <p className="text-sm text-slate-400">No new submissions.</p>
            ) : (
              <div className="space-y-3">
                {newSubmissions.map(s => (
                  <div key={s.id} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.company} · {s.country}</div>
                    </div>
                    <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full flex-shrink-0">New</span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/submissions" className="mt-4 block text-xs text-orange-600 hover:underline">View all →</Link>
          </div>

          {/* Audit log */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-slate-500" /> Recent Activity
            </h2>
            {auditLog.length === 0 ? (
              <p className="text-sm text-slate-400">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {auditLog.map(log => (
                  <div key={log.id} className="text-sm">
                    <span className="font-medium text-slate-700">{log.action}</span>
                    <span className="text-slate-400"> in </span>
                    <span className="text-slate-600">{log.section}</span>
                    {log.description && <div className="text-xs text-slate-400 mt-0.5 truncate">{log.description}</div>}
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/audit" className="mt-4 block text-xs text-orange-600 hover:underline">View full log →</Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map(a => (
              <Link
                key={a.to}
                to={a.to}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-center"
              >
                <a.icon size={20} className="text-orange-600" />
                <span className="text-xs font-medium text-slate-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}