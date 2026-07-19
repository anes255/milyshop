"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { localizedName } from "@/lib/utils";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { apiFetch } from "@/lib/api";
import ImageUploader from "./ImageUploader";

const EMPTY = { nameFr: "", nameAr: "", slug: "", image: "", parentId: "" };

export default function AdminCategories({ initial }) {
  const router = useRouter();
  const { lang } = useLang();
  const t = getAdminDict(lang);
  const [cats, setCats] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit = (c) => { setForm({ nameFr: c.nameFr, nameAr: c.nameAr, slug: c.slug, image: c.image || "", parentId: c.parentId || "" }); setEditing(c.id); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editing === "new" ? "/api/admin/categories" : `/api/admin/categories/${editing}`;
    const res = await apiFetch(url, { method: editing === "new" ? "POST" : "PUT", body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setEditing(null); const c = await res.json();
      setCats((prev) => editing === "new" ? [...prev, { ...c, _count: { products: 0 } }] : prev.map((x) => x.id === c.id ? { ...x, ...c } : x));
    }
  };

  const remove = async (id) => {
    if (!confirm(t.confirmDeleteCategory)) return;
    const res = await apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) { setCats((prev) => prev.filter((c) => c.id !== id)); router.refresh(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-title">{t.categories} <span className="text-gray-300 font-normal">({cats.length})</span></h1>
        <button onClick={openNew} className="btn-gold py-2.5">+ {t.add}</button>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr>
              <th className="admin-th">{t.nameFr}</th>
              <th className="admin-th">{t.nameAr}</th>
              <th className="admin-th">{t.slug}</th>
              <th className="admin-th">{t.parent}</th>
              <th className="admin-th">{t.products}</th>
              <th className="admin-th"></th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="admin-row">
                <td className="admin-td font-medium text-ink">{c.nameFr}</td>
                <td className="admin-td" dir="rtl">{c.nameAr}</td>
                <td className="admin-td text-gray-400 font-mono text-xs">{c.slug}</td>
                <td className="admin-td text-gray-500">{c.parent ? localizedName(c.parent, lang) : t.none}</td>
                <td className="admin-td"><span className="pill bg-beige text-gold-dark">{c._count?.products ?? 0}</span></td>
                <td className="admin-td whitespace-nowrap">
                  <button onClick={() => openEdit(c)} className="text-gold hover:text-gold-dark font-medium me-3">{t.edit}</button>
                  <button onClick={() => remove(c.id)} className="text-red-500 hover:text-red-600 font-medium">{t.del}</button>
                </td>
              </tr>
            ))}
            {cats.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">{t.noCategories}</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{editing === "new" ? t.newCategory : t.editItem}</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-gray-400" aria-label="close">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </div>
            <div><label className="label">{t.nameFr}</label><input required className="input" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} /></div>
            <div><label className="label">{t.nameAr}</label><input dir="rtl" className="input" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
            <div><label className="label">{t.slug}</label><input className="input" placeholder="dresses" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div>
              <label className="label">{t.image}</label>
              <ImageUploader value={form.image ? [form.image] : []} onChange={(v) => setForm({ ...form, image: v[0] || "" })} t={t} />
            </div>
            <div>
              <label className="label">{t.parentCategory}</label>
              <select className="input" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                <option value="">{t.mainCategory}</option>
                {cats.filter((c) => c.id !== editing).map((c) => <option key={c.id} value={c.id}>{localizedName(c, lang)}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button disabled={saving} className="btn-gold disabled:opacity-50">{saving ? "..." : t.save}</button>
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">{t.cancel}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
