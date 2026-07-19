"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { apiFetch } from "@/lib/api";

const STATUS_COLOR = {
  PENDING: "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-sky-50 text-sky-600",
  SHIPPED: "bg-violet-50 text-violet-600",
  DELIVERED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-600",
};
const STATUS_DOT = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-sky-400",
  SHIPPED: "bg-violet-400",
  DELIVERED: "bg-emerald-400",
  CANCELLED: "bg-red-400",
};

const STATS = {
  sales: { icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", tint: "bg-gold/10 text-gold-dark", bar: "from-gold to-gold-light" },
  orders: { icon: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", tint: "bg-sky-100 text-sky-600", bar: "from-sky-400 to-sky-300" },
  customers: { icon: "M12 8a4 4 0 1 0 0-8M4 20c0-4 4-6 8-6s8 2 8 6", tint: "bg-violet-100 text-violet-600", bar: "from-violet-400 to-violet-300" },
  products: { icon: "M20 7 12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4", tint: "bg-emerald-100 text-emerald-600", bar: "from-emerald-400 to-emerald-300" },
};

function Stat({ label, value, icon }) {
  const s = STATS[icon];
  return (
    <div className="admin-card p-5 relative overflow-hidden transition-transform hover:-translate-y-0.5">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.bar}`} />
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
          <p className="text-2xl font-semibold mt-1.5 text-ink truncate">{value}</p>
        </div>
        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${s.tint}`}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d={s.icon} /></svg>
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { lang } = useLang();
  const t = getAdminDict(lang);
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/api/admin/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData({ totalSales: 0, ordersCount: 0, customers: 0, products: 0, recent: [] }));
  }, []);

  const d = data || { totalSales: 0, ordersCount: 0, customers: 0, products: 0, recent: [] };

  return (
    <div>
      <div className="mb-6">
        <h1 className="admin-title">{t.dashboard}</h1>
        <p className="text-sm text-gray-400 mt-0.5">Boutique MilyShop</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Stat label={t.totalSales} value={formatPrice(d.totalSales)} icon="sales" />
        <Stat label={t.orders} value={d.ordersCount} icon="orders" />
        <Stat label={t.customers} value={d.customers} icon="customers" />
        <Stat label={t.products} value={d.products} icon="products" />
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-beige">
          <h2 className="font-semibold text-ink">{t.recentOrders}</h2>
          <Link href="/admin/orders" className="text-sm text-gold hover:text-gold-dark font-medium">{t.viewAll} →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="admin-th">#</th>
                <th className="admin-th">{t.client}</th>
                <th className="admin-th">{t.total}</th>
                <th className="admin-th">{t.status}</th>
                <th className="admin-th">{t.date}</th>
              </tr>
            </thead>
            <tbody>
              {d.recent.map((o) => (
                <tr key={o.id} className="admin-row">
                  <td className="admin-td font-mono text-xs text-gray-400">{o.id.slice(-6).toUpperCase()}</td>
                  <td className="admin-td font-medium text-ink">{o.fullName}</td>
                  <td className="admin-td font-semibold text-gold-dark">{formatPrice(o.total)}</td>
                  <td className="admin-td"><span className={`pill ${STATUS_COLOR[o.status]}`}><span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status]}`} />{t[o.status]}</span></td>
                  <td className="admin-td text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {d.recent.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">{t.noOrders}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
