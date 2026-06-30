import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, Upload, CheckCircle2, Clock, User, Shield } from "lucide-react";
import jsonService from "@/lib/jsonService";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

const initialForm = {
  name: "", company: "", email: "", phone: "", country: "",
  industry: "", employees_needed: "", start_date: "", message: "",
};

export default function ContactSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      let fileUrl = null;
      if (file) {
        const res = await jsonService.integrations.Core.UploadFile({ file });
        fileUrl = res.file_url;
      }
      await jsonService.integrations.Core.SendEmail({
        to: import.meta.env.VITE_CONTACT_EMAIL || "info@philmanpower.com",
        subject: `New Consultation Request from ${form.name} — ${form.company}`,
        body: `
Name: ${form.name}
Company: ${form.company}
Email: ${form.email}
Phone: ${form.phone}
Country: ${form.country}
Industry: ${form.industry}
Employees Needed: ${form.employees_needed}
Preferred Start Date: ${form.start_date}
Message: ${form.message}
${fileUrl ? `Attachment: ${fileUrl}` : ""}
        `.trim(),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setSending(false);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl bg-slate-mist border border-transparent text-navy text-sm placeholder:text-navy/35 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-navy/60 mb-1.5 tracking-wide uppercase";

  const countries = [t("regions.germany"), t("regions.austria"), t("regions.spain")];

  if (sent) {
    return (
      <section id="contact" className="py-24 lg:py-32 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-gold" />
          </div>
          <h2 className="font-heading font-semibold text-navy text-3xl mb-3">
            {t("contact.thankYouTitle")}
          </h2>
          <p className="text-navy/55 leading-relaxed">
            {t("contact.thankYouText")}
          </p>
        </div>
      </section>
    );
  }

  const industryOptions = Array.from({ length: 6 }, (_, i) => t(`contact.formIndustry${i + 1}`));

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left - Why Consult */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <SectionLabel>{t("contact.label")}</SectionLabel>
              <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-6">
                {t("contact.title")}
              </h2>
              <p className="text-navy/55 leading-relaxed mb-10">
                {t("contact.subtitle")}
              </p>

              <div className="space-y-6">
                {[
                  { icon: Clock, key: "perk1" },
                  { icon: User, key: "perk2" },
                  { icon: Shield, key: "perk3" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/8 flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-gold" />
                    </div>
                    <span className="text-sm text-navy/65 font-medium">
                      {t(`contact.${item.key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-navy/[0.06] shadow-[0_20px_50px_rgba(10,25,47,0.06)] p-8 sm:p-10"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t("contact.formFullName")} *</label>
                    <input
                      required value={form.name} onChange={update("name")}
                      placeholder={t("contact.formFullNamePlaceholder")} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formCompany")} *</label>
                    <input
                      required value={form.company} onChange={update("company")}
                      placeholder={t("contact.formCompanyPlaceholder")} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formEmail")} *</label>
                    <input
                      required type="email" value={form.email} onChange={update("email")}
                      placeholder={t("contact.formEmailPlaceholder")} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formPhone")}</label>
                    <input
                      value={form.phone} onChange={update("phone")}
                      placeholder={t("contact.formPhonePlaceholder")} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formCountry")} *</label>
                    <select required value={form.country} onChange={update("country")} className={inputClass}>
                      <option value="">{t("contact.formCountryPlaceholder")}</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formIndustry")} *</label>
                    <select required value={form.industry} onChange={update("industry")} className={inputClass}>
                      <option value="">{t("contact.formIndustryPlaceholder")}</option>
                      {industryOptions.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formEmployeesNeeded")}</label>
                    <input
                      type="number" min="1" value={form.employees_needed}
                      onChange={update("employees_needed")}
                      placeholder={t("contact.formEmployeesNeededPlaceholder")} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("contact.formStartDate")}</label>
                    <input
                      type="date" value={form.start_date}
                      onChange={update("start_date")} className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelClass}>{t("contact.formMessage")} *</label>
                  <textarea
                    required rows={4} value={form.message} onChange={update("message")}
                    placeholder={t("contact.formMessagePlaceholder")}
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div className="mt-5">
                  <label className={labelClass}>{t("contact.formAttachment")}</label>
                  <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-mist border border-dashed border-navy/15 cursor-pointer hover:border-gold transition-colors duration-200">
                    <Upload size={16} className="text-navy/40" />
                    <span className="text-sm text-navy/45">
                      {file ? file.name : t("contact.formAttachmentPlaceholder")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full mt-8 px-8 py-4 rounded-full bg-gold text-white font-semibold text-base hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      {t("contact.formSending")}
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      {t("contact.formSubmit")} <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
