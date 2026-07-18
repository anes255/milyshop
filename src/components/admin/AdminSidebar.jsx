"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAdminDict } from "@/lib/admin-i18n";
import { clearToken } from "@/lib/api";

const LINKS = [
  ["/admin", "dashboard", "M3 12l2-2 7-7 7 7 2 2M5 10v10h14V10"],
  ["/admin/products", "products", "M20 7 12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4"],
  ["/admin/categories", "categories", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
  ["/admin/orders", "orders", "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"],
  ["/admin/customers", "customers", "M12 8a4 4 0 1 0 0-8M4 20c0-4 4-6 8-6s8 2 8 6"],
  ["/admin/settings", "settings", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2 1-2 4-2-1"],
];

export default function AdminSidebar({ user, lang = "fr" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const t = getAdminDict(lang);

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-ink text-white flex items-center justify-between px-4 h-14">
        <span className="serif text-lg text-gold">{t.adminTitle}</span>
        <button onClick={() => setOpen(!open)} aria-label="menu">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      <aside className={`fixed top-0 start-0 z-40 h-full w-64 bg-ink text-white/80 flex flex-col transition-transform lg:translate-x-0 ${open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"}`}>
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <span className="serif text-xl text-gold">{t.adminTitle}</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {LINKS.map(([href, key, d]) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition ${active ? "bg-gold text-white" : "hover:bg-white/10"}`}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d={d} /></svg>
                {t[key]}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-2 px-2">{user.email}</p>
          <Link href="/" className="block px-4 py-2 text-sm hover:bg-white/10 rounded">{t.backToShop}</Link>
          <button onClick={logout} className="block w-full text-start px-4 py-2 text-sm text-red-300 hover:bg-white/10 rounded">{t.logout}</button>
        </div>
      </aside>
      {open && <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setOpen(false)} />}
    </>
  );
}
