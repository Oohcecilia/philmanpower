import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/adminAudit";
import { Save, Upload } from "lucide-react";

const SECTIONS = [
  {
    id: "hero",
    label: "Hero Section",
    fields: [
      { key: "hero_title", label: "Hero Title", type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "hero_cta_primary", label: "Primary CTA Text", type: "text" },
      { key: "hero_cta_secondary", label: "Secondary CTA Text", type: "text" },
    ],
  },
  {
    id: "about",
    label: "About Section",
    fields: [
      { key: "about_title", label: "Section Title", type: "text" },
      { key: "about_description", label: "Company Description", type: "textarea" },
      { key: "about_description2", label: "Second Paragraph", type: "textarea" },
      { key: "about_value_1", label: "Value 1", type: "text" },
      { key: "about_value_2", label: "Value 2", type: "text" },
      { key: "about_value_3", label: "Value 3", type: "text" },
      { key: "about_value_4", label: "Value 4", type: "text" },
      { key: "about_stat_label", label: "Stat Label (e.g. 450+)", type: "text" },
    ],
  },
  {
    id: "contact_info",
    label: "Contact Information",
    fields: [
      { key: "contact_email", label: "Email", type: "text" },
      { key: "contact_phone", label: "Phone", type: "text" },
      { key: "contact_address", label: "Address", type: "text" },
      { key: "contact_whatsapp", label: "WhatsApp Number", type: "text" },
      { key: "contact_hours", label: "Business Hours", type: "text" },
    ],
  },
  {
    id: "social",
    label: "Social Media",
    fields: [
      { key: "social_linkedin", label: "LinkedIn URL", type: "url" },
      { key: "social_facebook", label: "Facebook URL", type: "url" },
      { key: "social_instagram", label: "Instagram URL", type: "url" },
      { key: "social_twitter", label: "X (Twitter) URL", type: "url" },
      { key: "social_youtube", label: "YouTube URL", type: "url" },
      { key: "social_tiktok", label: "TikTok URL", type: "url" },
    ],
  },
];

export default function AdminContent() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("hero");
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allRecords, setAllRecords] = useState([]);

  useEffect(() => {
    async function load() {
      const entity = await jsonService.getEntity('SiteContent');
      entity.list().then((records) => {
        setAllRecords(records);
        const map = {};
        records.forEach(r => { map[r.key] = r.value; });
        setValues(map);
        setLoading(false);
      });
    }
    load();
  }, []);

  const section = SECTIONS.find(s => s.id === activeSection);

  const handleSave = async () => {
    setSaving(true);
    const entity = await jsonService.getEntity('SiteContent');
    const fields = section.fields;
    for (const f of fields) {
      const val = values[f.key] ?? "";
      const existing = allRecords.find(r => r.key === f.key);
      if (existing) {
        await entity.update(existing.id, { value: val });
      } else {
        const created = await entity.create({ section: activeSection, key: f.key, label: f.label, value: val });
        setAllRecords(p => [...p, created]);
      }
    }
    await logAudit({ action: "Updated", section: section.label, description: `Updated ${fields.length} fields` });
    toast({ title: "Saved", description: `${section.label} updated successfully.` });
    setSaving(false);
  };

  const handleUpload = async (key, file) => {
    try {
      const res = await jsonService.integrations.Core.UploadFile({ file });
      setValues(p => ({ ...p, [key]: res.file_url }));
      toast({ title: "Uploaded", description: "Image uploaded successfully." });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all";

  return (
    <AdminGuard>
      <PageHeader title="Site Content" description="Edit website text and information" />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section tabs */}
        <div className="lg:w-48 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 flex-shrink-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === s.id
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-5">{section?.label}</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {section?.fields.map(f => (
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
                  ) : f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[f.key] || ""}
                      onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                      className={inputClass + " resize-none"}
                    />
                  ) : f.type === "image" ? (
                    <div className="flex gap-3 items-center">
                      {values[f.key] && <img src={values[f.key]} alt="" className="w-20 h-14 object-cover rounded-lg border" />}
                      <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors text-sm text-slate-500">
                        <Upload size={14} /> Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(f.key, e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <input
                      type={f.type === "url" ? "url" : "text"}
                      value={values[f.key] || ""}
                      onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                      className={inputClass}
                      placeholder={f.type === "url" ? "https://" : ""}
                    />
                  )}
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}