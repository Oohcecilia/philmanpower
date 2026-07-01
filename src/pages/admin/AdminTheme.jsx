import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/adminAudit";
import { Save, Upload } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

const THEME_FIELDS = [
  { key: "theme_primary_color", label: "Primary Color (Navy)", type: "color", default: "#0A192F" },
  { key: "theme_accent_color", label: "Accent Color (Orange)", type: "color", default: "#d36216" },
  { key: "theme_bg_color", label: "Background Color", type: "color", default: "#ffffff" },
  { key: "theme_logo_url", label: "Logo Image", type: "image" },
  { key: "theme_favicon_url", label: "Favicon", type: "image" },
  { key: "theme_font_heading", label: "Heading Font", placeholder: "Playfair Display" },
  { key: "theme_font_body", label: "Body Font", placeholder: "Inter" },
  { key: "theme_border_radius", label: "Button Border Radius (e.g. 9999px for pill)", placeholder: "9999px" },
];

export default function AdminTheme() {
  const { toast } = useToast();
  const [values, setValues] = useState({});
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const entity = await jsonService.getEntity('SiteContent');
      entity.filter({ section: "theme" }).then(r => {
        setRecords(r);
        const map = {};
        r.forEach(i => { map[i.key] = i.value; });
        setValues(map);
      });
    }
    load();
  }, []);

  const handleUpload = async (key, file) => {
    const res = await jsonService.integrations.Core.UploadFile({ file });
    setValues(p => ({ ...p, [key]: res.file_url }));
    toast({ title: "Uploaded" });
  };

  const handleSave = async () => {
    setSaving(true);
    const entity = await jsonService.getEntity('SiteContent');
    for (const f of THEME_FIELDS) {
      const val = values[f.key] || f.default || "";
      const existing = records.find(r => r.key === f.key);
      if (existing) {
        await entity.update(existing.id, { value: val });
      } else {
        const created = await entity.create({ section: "theme", key: f.key, label: f.label, value: val });
        setRecords(p => [...p, created]);
      }
    }
    await logAudit({ action: "Updated", section: "Theme", description: "Updated theme settings" });
    toast({ title: "Theme settings saved" });
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100";

  return (
    <AdminGuard>
      <PageHeader title="Theme Settings" description="Customize colors, fonts, and branding" />
      <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid sm:grid-cols-2 gap-5">
          {THEME_FIELDS.map(f => (
            <div key={f.key} className="col-span-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              {f.type === "color" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={values[f.key] || f.default || "#000000"}
                    onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={values[f.key] || f.default || ""}
                    onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                    className={inputClass}
                    placeholder="#000000"
                  />
                </div>
              ) : f.type === "image" ? (
                <div className="space-y-2">
                  {values[f.key] && <img src={getImageUrl(values[f.key])} alt="" className="h-12 object-contain border rounded-lg p-1" />}
                  <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-400 text-sm text-slate-500 w-fit">
                    <Upload size={13} /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(f.key, e.target.files[0])} />
                  </label>
                </div>
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
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50">
            <Save size={15} /> {saving ? "Saving..." : "Save Theme"}
          </button>
          <p className="text-xs text-slate-400 mt-3">Note: Color and font changes are stored in the CMS. Apply them to the live site by updating the CSS variables in the codebase.</p>
        </div>
      </div>
    </AdminGuard>
  );
}