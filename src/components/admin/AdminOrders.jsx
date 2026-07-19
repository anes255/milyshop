"use client";
import { Fragment, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { apiFetch } from "@/lib/api";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const COLOR = {
  PENDING: "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-sky-50 text-sky-600",
  SHIPPED: "bg-violet-50 text-violet-600",
  DELIVERED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function AdminOrders({ initial }) {
  const { lang } = useLang();
  const t = getAdminDict(lang);
  const [orders, setOrders] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(null);

  const changeStatus = async (id, status) => {
    const res = await apiFetch(`/api/admin/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    if (res.ok) setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter((o) => {
    const matchQ = !q || o.fullName.toLowerCase().includes(q.toLowerCase()) || o.phone.includes(q) || o.id.includes(q);
    const matchF = !filter || o.status === filter;
    return matchQ && matchF;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="admin-title">{t.orders} <span className="text-gray-300 font-normal">({orders.length})</span></h1>
        <div className="flex gap-3 flex-wrap">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="input py-2 w-40 sm:w-56 rounded-full" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input py-2 w-auto bg-white rounded-full">
            <option value="">{t.allStatuses}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{t[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr>
              <th className="admin-th">#</th>
              <th className="admin-th">{t.client}</th>
              <th className="admin-th">{t.phone}</th>
              <th className="admin-th">{t.total}</th>
              <th className="admin-th">{t.status}</th>
              <th className="admin-th">{t.date}</th>
              <th className="admin-th"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <Fragment key={o.id}>
                <tr className="admin-row">
                  <td className="admin-td font-mono text-xs text-gray-400">{o.id.slice(-6).toUpperCase()}</td>
                  <td className="admin-td font-medium text-ink">{o.fullName}</td>
                  <td className="admin-td text-gray-500">{o.phone}</td>
                  <td className="admin-td font-semibold text-gold-dark">{formatPrice(o.total)}</td>
                  <td className="admin-td">
                    <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)} className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none ${COLOR[o.status]}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{t[s]}</option>)}
                    </select>
                  </td>
                  <td className="admin-td text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="admin-td"><button onClick={() => setOpen(open === o.id ? null : o.id)} className="text-gold hover:text-gold-dark font-medium">{t.details}</button></td>
                </tr>
                {open === o.id && (
                  <tr className="bg-beige/30"><td colSpan={7} className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t.delivery}</p>
                        <p>{o.address}</p>
                        {o.notes && <p className="text-gray-500 mt-1">{o.notes}</p>}
                        <p className="text-gray-500 mt-1">{t.payment}: {o.paymentMethod}</p>
                        {o.couponCode && <p className="text-gold">{t.coupon}: {o.couponCode} (-{formatPrice(o.discount)})</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t.items}</p>
                        {o.items.map((i) => (
                          <div key={i.id} className="flex justify-between">
                            <span>{i.name} {i.size ? `(${i.size})` : ""} ×{i.quantity}</span>
                            <span>{formatPrice(i.price * i.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-beige-dark">
                          <span>{t.total}</span><span>{formatPrice(o.total)}</span>
                        </div>
                      </div>
                    </div>
                  </td></tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">{t.noOrders}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
