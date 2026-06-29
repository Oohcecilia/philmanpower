import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/adminAudit";
import { Save, Globe } from "lucide-react";

const SEO_FIELDS = [
  { key: "seo_title", label: "Page Title", placeholder: "PhilManPower GmbH — International Recruitment" },
  { key: "seo_description", label: "Meta Description", type: "textarea", placeholder: "Up to 160 characters..." },
  { key: "seo_keywords", label: "Keywords (comma-separated)", placeholder: "recruitment, healthcare, Philippines..." },
  { key: "seo_og_title", label: "Open Graph Title" },
  { key: "seo_og_description", label: "Open Graph Description", type: "textarea" },
  { key: "seo_canonical", label: "Canonical URL", type: "url" },
  { key: "ga_id", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
  { key: "gtm_id", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX" },
  { key: "fb_pixel_id", label: "Facebook Pixel ID" },
  { key: "recaptcha_site_key", label: "reCAPTCHA Site Key" },
];

export default function AdminSEO() {
  const { toast } = useToast();
  const [values, setValues] = useState({});
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const entity = await jsonService.getEntity('SiteContent');
      entity.filter({ section: "seo" }).then(r => {
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
    for (const f of SEO_FIELDS) {
      const val = values[f.key] || "";
      const existing = records.find(r => r.key === f.key);
      if (existing) {
        await entity.update(existing.id, { value: val });
      } else {
        const created = await entity.create({ section: "seo", key: f.key, label: f.label, value: val });
        setRecords(p => [...p, created]);
      }
    }
    await logAudit({ action: "Updated", section: "SEO", description: "Updated SEO & tracking settings" });
    toast({ title: "SEO settings saved" });
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100";

  return (
    <AdminGuard>
      <PageHeader title="SEO & Tracking" description="Manage search engine optimization and analytics" />
      <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {SEO_FIELDS.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea rows={3} value={values[f.key] || ""} onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className={inputClass + " resize-none"} />
            ) : (
              <input type={f.type === "url" ? "url" : "text"} value={values[f.key] || ""} onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className={inputClass} />
            )}
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50">
          <Save size={15} /> {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </div>
    </AdminGuard>
  );
}