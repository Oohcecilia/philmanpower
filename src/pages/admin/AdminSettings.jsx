import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/adminAudit";
import { Save } from "lucide-react";

const SETTINGS_FIELDS = [
  { key: "company_name", label: "Company Name", placeholder: "PhilManPower GmbH" },
  { key: "company_tagline", label: "Tagline" },
  { key: "contact_email_to", label: "Form Submissions Sent To", placeholder: "info@philmanpower.com" },
  { key: "footer_copyright", label: "Footer Copyright Text" },
  { key: "maintenance_mode", label: "Maintenance Mode", type: "boolean" },
];

export default function AdminSettings() {
  const { toast } = useToast();
  const [values, setValues] = useState({});
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const entity = await jsonService.getEntity('SiteContent');
      entity.filter({ section: "settings" }).then(r => {
        setRecords(r);
        const map = {};
        r.forEach(i => { map[i.key] = i.value; });
        setValues(map);
      });
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const entity = await jsonService.getEntity('SiteContent');
    for (const f of SETTINGS_FIELDS) {
      const val = values[f.key] || "";
      const existing = records.find(r => r.key === f.key);
      if (existing) {
        await entity.update(existing.id, { value: val });
      } else {
        const created = await entity.create({ section: "settings", key: f.key, label: f.label, value: val });
        setRecords(p => [...p, created]);
      }
    }
    await logAudit({ action: "Updated", section: "Settings", description: "Updated general settings" });
    toast({ title: "Settings saved" });
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100";

  return (
    <AdminGuard>
      <PageHeader title="Settings" description="General website settings" />
      <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {SETTINGS_FIELDS.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
            {f.type === "boolean" ? (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values[f.key] === "true"}
                  onChange={e => setValues(p => ({ ...p, [f.key]: e.target.checked ? "true" : "false" }))}
                  className="w-4 h-4 accent-orange-600"
                />
                <span className="text-sm text-slate-700">Enabled</span>
              </label>
            ) : (
              <input
                type="text"
                value={values[f.key] || ""}
                onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50">
          <Save size={15} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </AdminGuard>
  );
}