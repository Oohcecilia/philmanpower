import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/adminAudit";
import { Plus, Trash2, Eye, EyeOff, X, Copy, Megaphone, ArrowRight, Info, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const COLOR_OPTIONS = [
  { value: "info",      label: "Info",      bg: "bg-blue-600",    icon: Info },
  { value: "success",   label: "Success",   bg: "bg-emerald-600", icon: CheckCircle },
  { value: "warning",   label: "Warning",   bg: "bg-amber-500",   icon: AlertTriangle },
  { value: "important", label: "Important", bg: "bg-orange-600",  icon: AlertOctagon },
];

const SCHEDULE_MODES = [
  { value: "now",    label: "Show now",       description: "Display immediately, no date restriction" },
  { value: "auto",   label: "Schedule",        description: "Auto-publish and auto-expire on dates" },
  { value: "draft",  label: "Draft / Manual",  description: "Hidden until manually enabled" },
];

const EMPTY = {
  title: "",
  message: "",
  color: "info",
  cta_text: "",
  cta_link: "",
  is_enabled: false,
  start_date: "",
  end_date: "",
  // schedule_mode is derived — not stored
};

function PreviewBanner({ form }) {
  const colorOpt = COLOR_OPTIONS.find(c => c.value === form.color) || COLOR_OPTIONS[0];
  const Icon = colorOpt.icon;
  return (
    <div className={`${colorOpt.bg} text-white relative rounded-lg overflow-hidden`}>
      <div className="flex items-center gap-3 px-5 py-3">
        <Icon size={16} className="flex-shrink-0 opacity-90" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
          {form.title && (
            <span className="font-semibold text-sm flex-shrink-0">{form.title}</span>
          )}
          <span className="text-sm opacity-90 truncate">
            {form.message || <em className="opacity-50 not-italic">Your message here…</em>}
          </span>
        </div>
        {(form.cta_text && form.cta_link) && (
          <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors bg-white/20">
            {form.cta_text} <ArrowRight size={12} />
          </span>
        )}
        <span className="flex-shrink-0 opacity-40 p-1 rounded cursor-default">
          <X size={15} />
        </span>
      </div>
    </div>
  );
}

function getRelativeTimeLabel(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString);
  const now = new Date();
  // Strip time for day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round((targetDay - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;
  if (diffDays === 0) return "Auto-publishes today";
  if (diffDays === 1) return "Auto-publishes tomorrow";
  if (diffDays <= 7) return `Auto-publishes in ${diffDays} days`;
  if (diffDays <= 30) return `Auto-publishes in ${Math.round(diffDays / 7)} weeks`;
  return `Auto-publishes ${target.toLocaleDateString()}`;
}

function getExpiryLabel(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round((targetDay - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Expires today";
  if (diffDays === 1) return "Expires tomorrow";
  if (diffDays <= 7) return `Expires in ${diffDays} days`;
  if (diffDays <= 30) return `Expires in ${Math.round(diffDays / 7)} weeks`;
  return `Expires ${target.toLocaleDateString()}`;
}

export default function AdminAnnouncements() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scheduleMode, setScheduleMode] = useState("draft");
  const [tick, setTick] = useState(0);

  // Re-render every 60 seconds to keep countdown timers fresh
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const load = async () => {
    const entity = await jsonService.getEntity('Announcement');
    entity.list("-created_date", 50).then(r => {
      setItems(r);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY);
    setScheduleMode("draft");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item, start_date: item.start_date?.slice(0, 10) || "", end_date: item.end_date?.slice(0, 10) || "" });
    setScheduleMode(getScheduleMode(item));
    setShowForm(true);
  };

  const handleScheduleModeChange = (mode) => {
    setScheduleMode(mode);
    if (mode === "now") {
      setForm(p => ({ ...p, is_enabled: true, start_date: "", end_date: "" }));
    } else if (mode === "draft") {
      setForm(p => ({ ...p, is_enabled: false, start_date: "", end_date: "" }));
    }
    // mode === "auto" — let admin fill in dates manually
  };

  const handleSave = async () => {
    if (!form.message.trim()) {
      toast({ title: "Message is required", variant: "destructive" });
      return;
    }
    if (scheduleMode === "auto" && !form.start_date && !form.end_date) {
      toast({ title: "Please set a start date or expiry date for scheduled announcements", variant: "destructive" });
      return;
    }
    setSaving(true);
    const entity = await jsonService.getEntity('Announcement');
    const payload = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };
    if (editingId) {
      await entity.update(editingId, payload);
      setItems(p => p.map(i => i.id === editingId ? { ...i, ...payload } : i));
      await logAudit({ action: "Updated", section: "Announcements", description: `Updated: ${form.title || form.message}` });
      toast({ title: "Announcement updated" });
    } else {
      const created = await entity.create(payload);
      setItems(p => [created, ...p]);
      await logAudit({ action: "Created", section: "Announcements", description: `Created: ${form.title || form.message}` });
      toast({ title: "Announcement created" });
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
  };

  const toggleEnabled = async (item) => {
    const entity = await jsonService.getEntity('Announcement');
    const updated = { ...item, is_enabled: !item.is_enabled };
    await entity.update(item.id, { is_enabled: updated.is_enabled });
    setItems(p => p.map(i => i.id === item.id ? updated : i));
    toast({ title: updated.is_enabled ? "Announcement published" : "Announcement disabled" });
  };

  const handleDuplicate = async (item) => {
    try {
      const entity = await jsonService.getEntity('Announcement');
      const clone = {
        title: item.title ? `${item.title} (copy)` : "",
        message: item.message,
        color: item.color,
        cta_text: item.cta_text || "",
        cta_link: item.cta_link || "",
        is_enabled: false,
        start_date: null,
        end_date: null,
      };
      const created = await entity.create(clone);
      setItems(p => [created, ...p]);
      toast({ title: "Announcement duplicated" });
    } catch {
      toast({ title: "Failed to duplicate", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    const entity = await jsonService.getEntity('Announcement');
    await entity.delete(deleteId);
    setItems(p => p.filter(i => i.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Deleted" });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100 bg-white";

  const getStatus = (item) => {
    const now = new Date();
    const hasDates = item.start_date || item.end_date;

    if (hasDates) {
      const startPassed = !item.start_date || new Date(item.start_date) <= now;
      const endPassed = item.end_date && new Date(item.end_date) < now;

      if (endPassed) return "expired";
      if (!startPassed) return "scheduled";
      return "live";
    }

    // No dates — depends on manual toggle
    return item.is_enabled ? "live" : "draft";
  };

  const getScheduleMode = (item) => {
    const hasDates = item.start_date || item.end_date;
    if (hasDates) return "auto";
    if (item.is_enabled) return "now";
    return "draft";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "live":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 flex-shrink-0">Live</span>;
      case "scheduled":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">Upcoming</span>;
      case "expired":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100 flex-shrink-0">Expired</span>;
      case "draft":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <AdminGuard>
      <PageHeader
        title="Announcements"
        description="Manage the banner displayed at the top of the landing page"
        action={
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
            <Plus size={15} /> New Announcement
          </button>
        }
      />

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-orange-200 p-6 mb-6 space-y-5">
          <h3 className="font-semibold text-slate-800">{editingId ? "Edit Announcement" : "New Announcement"}</h3>

          {/* Live Preview */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Preview</p>
            <PreviewBanner form={form} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="e.g. Now Hiring" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Banner Color</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, color: c.value }))}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border-2 text-xs font-medium transition-all ${form.color === c.value ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <span className={`w-5 h-5 rounded-full ${c.bg}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Message <span className="text-red-400">*</span></label>
              <textarea rows={2} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className={inputClass + " resize-none"} placeholder="What do you want to announce?" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">CTA Button Text <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
              <input type="text" value={form.cta_text} onChange={e => setForm(p => ({ ...p, cta_text: e.target.value }))} className={inputClass} placeholder="e.g. Learn More" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">CTA Button Link</label>
              <input type="text" value={form.cta_link} onChange={e => setForm(p => ({ ...p, cta_link: e.target.value }))} className={inputClass} placeholder="https:// or #section" />
            </div>
          </div>

          {/* Scheduling */}
          <div className="pt-1 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Scheduling</p>
            <div className="flex flex-wrap gap-2">
              {SCHEDULE_MODES.map(m => {
                const isSelected = scheduleMode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => handleScheduleModeChange(m.value)}
                    className={`flex-1 min-w-[140px] text-left px-3.5 py-2.5 rounded-lg border-2 text-sm transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className={`font-semibold text-xs ${isSelected ? "text-orange-700" : "text-slate-600"}`}>
                      {m.label}
                    </span>
                    <p className={`text-xs mt-0.5 ${isSelected ? "text-orange-600/70" : "text-slate-400"}`}>
                      {m.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Date fields shown only in Schedule mode */}
            {scheduleMode === "auto" && (
              <div className="mt-4 grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Start Date <span className="text-slate-300 normal-case font-normal">(auto-publish)</span>
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={e => {
                      setForm(p => ({ ...p, start_date: e.target.value, is_enabled: true }));
                      if (e.target.value) setScheduleMode("auto");
                    }}
                    className={inputClass}
                  />
                  {form.start_date && (
                    <p className="text-xs text-blue-600 mt-1">
                      Will auto-publish on {new Date(form.start_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Expiry Date <span className="text-slate-300 normal-case font-normal">(auto-expire)</span>
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={e => {
                      setForm(p => ({ ...p, end_date: e.target.value, is_enabled: true }));
                      if (e.target.value) setScheduleMode("auto");
                    }}
                    className={inputClass}
                  />
                  {form.end_date && (
                    <p className="text-xs text-amber-600 mt-1">
                      Will auto-expire on {new Date(form.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
            <div className="flex gap-3 ml-auto">
              <button onClick={() => { setShowForm(false); setForm(EMPTY); setEditingId(null); }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50">
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />)}</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Megaphone size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No announcements yet. Click "New Announcement" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(item => {
              const status = getStatus(item);
              const colorOpt = COLOR_OPTIONS.find(c => c.value === item.color) || COLOR_OPTIONS[0];
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${colorOpt.bg}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 truncate">{item.title || item.message}</span>
                      {getStatusBadge(status)}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {item.title ? item.message : ""}
                      {item.start_date && status === "scheduled" && <span className="ml-2">{getRelativeTimeLabel(item.start_date)}</span>}
                      {item.end_date && (status === "live" || status === "scheduled") && <span className="ml-2 text-amber-500">{getExpiryLabel(item.end_date)}</span>}
                      {item.end_date && status === "expired" && <span className="ml-2 text-red-400">Expired {new Date(item.end_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleEnabled(item)} title={item.is_enabled ? "Disable" : "Enable"} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      {item.is_enabled ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-slate-300" />}
                    </button>
                    <button onClick={() => handleDuplicate(item)} title="Duplicate" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-slate-600">
                      Edit
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete announcement?"
        description="This will permanently delete this announcement."
        onConfirm={handleDelete}
      />
    </AdminGuard>
  );
}