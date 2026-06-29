import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import jsonService from "@/lib/jsonService";
import {
  LayoutDashboard, FileText, HelpCircle,
  GitBranch, Star, Mail, Settings, ChevronLeft, ChevronRight,
  LogOut, Menu, X, Palette, BarChart2, Megaphone
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Submissions", icon: Mail, path: "/admin/submissions" },
  { divider: true, label: "Content" },
  { label: "Announcements", icon: Megaphone, path: "/admin/announcements" },
  { label: "Site Content", icon: FileText, path: "/admin/content" },
  { label: "Process Steps", icon: GitBranch, path: "/admin/process" },
  { label: "Testimonials", icon: Star, path: "/admin/testimonials" },
  { label: "FAQ", icon: HelpCircle, path: "/admin/faq" },
  { divider: true, label: "Site" },
  { label: "Theme", icon: Palette, path: "/admin/theme" },
  { label: "Audit Log", icon: BarChart2, path: "/admin/audit" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = "/";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center px-4 py-5 border-b border-slate-800 ${collapsed ? "justify-center" : ""}`}>
        {collapsed ? (
          <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">P</span>
          </div>
        ) : (
          <img
            src="/philmanpower_logo.png"
            alt="PhilManPower"
            className="h-7 w-auto"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV.map((item, i) => {
          if (item.divider) return (
            <div key={i} className={`${collapsed ? "hidden" : ""} px-3 pt-4 pb-1`}>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{item.label}</span>
            </div>
          );
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                active
                  ? "bg-orange-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className={`px-2 pb-4 border-t border-slate-800 pt-3 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            <div className="text-xs text-slate-600 capitalize">{user?.role || "admin"}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all w-full ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-900 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-56"}`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full bg-slate-900 border border-slate-700 rounded-r-md p-1 text-slate-400 hover:text-white z-10"
          style={{ left: collapsed ? 64 : 224 }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-slate-900 z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1 text-slate-500">
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-slate-700 hidden sm:block">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-orange-600 transition-colors"
            >
              View Site →
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
