"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAdminDict } from "@/lib/admin-i18n";
import { useLang } from "@/components/LangProvider";
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
  const { setLang } = useLang();
  const [open, setOpen] = useState(false);
  const t = getAdminDict(lang);
  const otherLang = lang === "fr" ? "عربي" : "FR";
  const toggleLang = () => setLang(lang === "fr" ? "ar" : "fr");

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-gradient-to-r from-ink to-[#43333b] text-white flex items-center justify-between px-4 h-14 shadow-md">
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-full bg-white object-cover" />
          <span className="serif text-base text-gold-light">{t.adminTitle}</span>
        </span>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="text-xs font-medium border border-white/25 px-2.5 py-1 rounded-full hover:border-gold hover:text-gold-light transition">
            {otherLang}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="menu" className="p-1.5 rounded-lg hover:bg-white/10">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <aside className={`fixed top-0 start-0 z-40 h-full w-64 bg-gradient-to-b from-ink to-[#3c2d34] text-white/75 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"}`}>
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-10 w-10 rounded-full bg-white object-cover shrink-0" />
          <span className="serif text-lg leading-tight text-gold-light">{t.adminTitle}</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {LINKS.map(([href, key, d]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gold text-white shadow-lg shadow-gold/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-white/20" : "bg-white/5"}`}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d={d} /></svg>
                </span>
                {t[key]}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <p className="text-xs text-white/40 mb-1 px-3">{user.email}</p>
          <button onClick={toggleLang} className="flex items-center gap-3 w-full text-start px-3 py-2 text-sm rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" /></svg>
            {otherLang === "FR" ? "Français" : "العربية"}
          </button>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10" /></svg>
            {t.backToShop}
          </Link>
          <button onClick={logout} className="flex items-center gap-3 w-full text-start px-3 py-2 text-sm rounded-xl text-red-300 hover:bg-red-500/10 transition">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 17l5-5-5-5M21 12H9M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /></svg>
            {t.logout}
          </button>
        </div>
      </aside>
      {open && <div className="lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-sm z-30" onClick={() => setOpen(false)} />}
    </>
  );
}
