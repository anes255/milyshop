"use client";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { apiFetch } from "@/lib/api";

export default function AdminCustomersPage() {
  const { lang } = useLang();
  const t = getAdminDict(lang);
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    apiFetch("/api/admin/customers")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCustomers)
      .catch(() => setCustomers([]));
  }, []);

  const list = customers || [];

  return (
    <div>
      <h1 className="admin-title mb-6">{t.customers} <span className="text-gray-300 font-normal">({list.length})</span></h1>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr>
              <th className="admin-th">{t.name}</th>
              <th className="admin-th">{t.phone}</th>
              <th className="admin-th">{t.address}</th>
              <th className="admin-th">{t.orders}</th>
              <th className="admin-th">{t.totalSpent}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c, i) => (
              <tr key={i} className="admin-row">
                <td className="admin-td font-medium text-ink">{c.name}</td>
                <td className="admin-td text-gray-500">{c.phone || t.none}</td>
                <td className="admin-td text-gray-500 max-w-xs truncate">{c.address || t.none}</td>
                <td className="admin-td"><span className="pill bg-beige text-gold-dark">{c.count}</span></td>
                <td className="admin-td font-semibold text-gold-dark">{formatPrice(c.spent)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-400">{t.noCustomers}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
