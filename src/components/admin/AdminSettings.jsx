"use client";
import { useState } from "react";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { apiFetch } from "@/lib/api";
import ImageUploader from "./ImageUploader";

const FIELDS = [
  ["siteName", "siteName"],
  ["phone", "phone"],
  ["email", "email"],
  ["whatsapp", "whatsapp"],
  ["facebook", "facebook"],
  ["instagram", "instagram"],
  ["tiktok", "tiktok"],
  ["address", "address"],
  ["footerText", "footerText"],
];

export default function AdminSettings({ initial }) {
  const { lang } = useLang();
  const t = getAdminDict(lang);
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    const res = await apiFetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
    setSaving(false);
    setMsg(res.ok ? t.saved : t.error);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t.settingsTitle}</h1>
      <form onSubmit={save} className="bg-white rounded-2xl shadow-sm border border-beige-dark p-6 max-w-2xl space-y-4">
        <div>
          <label className="label">{t.logo}</label>
          {form.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.logo} alt="logo" className="h-20 object-contain mb-2" />
          )}
          <ImageUploader value={form.logo ? [form.logo] : []} onChange={(v) => setForm({ ...form, logo: v[0] || "" })} t={t} />
        </div>
        {FIELDS.map(([key, label]) => (
          <div key={key}>
            <label className="label">{t[label]}</label>
            {key === "footerText" ? (
              <textarea rows={2} className="input" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ) : (
              <input className="input" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button disabled={saving} className="btn-gold disabled:opacity-50">{saving ? "..." : t.save}</button>
          {msg && <span className="text-sm text-gold">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
