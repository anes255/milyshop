"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, localizedName } from "@/lib/utils";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { apiFetch } from "@/lib/api";
import ImageUploader from "./ImageUploader";

const EMPTY = {
  nameFr: "", nameAr: "", descriptionFr: "", descriptionAr: "",
  price: "", discountPrice: "", stock: "", brand: "",
  images: [], sizes: [], colors: [], categoryId: "",
  featured: false, newArrival: false, bestSeller: false,
};

function CSVField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        placeholder={placeholder}
        value={Array.isArray(value) ? value.join(", ") : value}
        onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
      />
    </div>
  );
}

export default function AdminProducts({ initialProducts, categories }) {
  const router = useRouter();
  const { lang } = useLang();
  const t = getAdminDict(lang);
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const openNew = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit = (p) => {
    setForm({
      ...p,
      price: String(p.price), discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      stock: String(p.stock), brand: p.brand || "", categoryId: p.categoryId || "",
      images: p.images || [], sizes: p.sizes || [], colors: p.colors || [],
    });
    setEditing(p.id);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editing === "new" ? "/api/admin/products" : `/api/admin/products/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await apiFetch(url, { method, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setEditing(null); const p = await res.json();
      setProducts((prev) => editing === "new" ? [p, ...prev] : prev.map((x) => x.id === p.id ? { ...x, ...p } : x));
    }
  };

  const remove = async (id) => {
    if (!confirm(t.confirmDeleteProduct)) return;
    const res = await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { setProducts((prev) => prev.filter((p) => p.id !== id)); router.refresh(); }
  };

  const filtered = products.filter((p) => p.nameFr?.toLowerCase().includes(q.toLowerCase()) || p.nameAr?.includes(q));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="admin-title">{t.products} <span className="text-gray-300 font-normal">({products.length})</span></h1>
        <div className="flex gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="input py-2 w-40 sm:w-56 rounded-full" />
          <button onClick={openNew} className="btn-gold py-2.5 shrink-0">+ {t.add}</button>
        </div>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr>
              <th className="admin-th">{t.product}</th>
              <th className="admin-th">{t.category}</th>
              <th className="admin-th">{t.price}</th>
              <th className="admin-th">{t.stock}</th>
              <th className="admin-th">{t.tags}</th>
              <th className="admin-th"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="admin-row">
                <td className="admin-td">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0] || "https://via.placeholder.com/60"} alt="" className="w-11 h-14 object-cover bg-beige rounded-lg shrink-0" />
                    <span className="font-medium text-ink">{localizedName(p, lang)}</span>
                  </div>
                </td>
                <td className="admin-td text-gray-500">{p.category ? localizedName(p.category, lang) : t.none}</td>
                <td className="admin-td font-semibold text-gold-dark">{formatPrice(p.discountPrice || p.price)}</td>
                <td className="admin-td"><span className={`pill ${p.stock <= 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>{p.stock}</span></td>
                <td className="admin-td text-xs whitespace-nowrap">
                  {p.featured && <span className="pill bg-gold/15 text-gold-dark me-1">{t.vedetteTag}</span>}
                  {p.newArrival && <span className="pill bg-sky-50 text-sky-600 me-1">{t.newTag}</span>}
                  {p.bestSeller && <span className="pill bg-emerald-50 text-emerald-600">{t.bestTag}</span>}
                </td>
                <td className="admin-td whitespace-nowrap">
                  <button onClick={() => openEdit(p)} className="text-gold hover:text-gold-dark font-medium me-3">{t.edit}</button>
                  <button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-600 font-medium">{t.del}</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-gray-400">{t.noProducts}</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto p-4">
          <form onSubmit={save} className="bg-white w-full max-w-2xl rounded-2xl my-8 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{editing === "new" ? t.newProduct : t.editItem}</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-gray-400" aria-label="close">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">{t.nameFr}</label><input required className="input" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} /></div>
              <div><label className="label">{t.nameAr}</label><input dir="rtl" className="input" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">{t.descFr}</label><textarea rows={2} className="input" value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} /></div>
              <div><label className="label">{t.descAr}</label><textarea dir="rtl" rows={2} className="input" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="label">{t.price}</label><input required type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div><label className="label">{t.discountPrice}</label><input type="number" className="input" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} /></div>
              <div><label className="label">{t.stock}</label><input required type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">{t.brand}</label><input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div>
                <label className="label">{t.category}</label>
                <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">{t.none}</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{localizedName(c, lang)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">{t.images}</label>
              <ImageUploader value={form.images} onChange={(v) => setForm({ ...form, images: v })} multiple t={t} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <CSVField label={t.sizes} value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} placeholder="S, M, L" />
              <CSVField label={t.colors} value={form.colors} onChange={(v) => setForm({ ...form, colors: v })} placeholder="Noir, Beige" />
            </div>
            <div className="flex gap-6 text-sm flex-wrap">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> {t.featured}</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} /> {t.newArrival}</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} /> {t.bestSeller}</label>
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
