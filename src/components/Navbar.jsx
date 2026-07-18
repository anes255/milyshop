"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLang } from "./LangProvider";
import { useCart } from "@/lib/cart-store";
import { localizedName } from "@/lib/utils";

export default function Navbar({ settings, categories }) {
  const { lang, t, setLang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  // The admin area has its own layout/sidebar — no storefront chrome there.
  if (pathname?.startsWith("/admin")) return null;

  const submitSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const nav = [
    { href: "/", label: t.home },
    { href: "/shop", label: t.shop },
    { href: "/contact", label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-beige-dark">
      <div className="container-mily flex items-center justify-between h-20 gap-4">
        <button className="lg:hidden text-ink" onClick={() => setOpen(!open)} aria-label="menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          {settings?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo} alt={settings.siteName} className="h-14 w-auto object-contain" />
          ) : null}
          <span className="serif text-xl md:text-2xl font-semibold text-gold hidden sm:block leading-tight">
            {settings?.siteName || "Boutique MilyShop"}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-gold transition">
              {n.label}
            </Link>
          ))}
          <div className="relative group">
            <button className="hover:text-gold transition flex items-center gap-1">
              {t.categories}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full start-0 hidden group-hover:grid grid-cols-2 gap-1 bg-white border border-beige-dark shadow-xl p-3 w-[420px] max-h-[70vh] overflow-auto">
              {categories?.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className="px-3 py-2 text-sm hover:bg-beige rounded transition"
                >
                  {localizedName(c, lang)}
                </Link>
              ))}
              {(!categories || categories.length === 0) && (
                <span className="px-3 py-2 text-sm text-gray-400 col-span-2">—</span>
              )}
            </div>
          </div>
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xs">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full border border-beige-dark px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button className="bg-ink text-white px-3" aria-label="search">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </form>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="text-sm font-medium border border-beige-dark px-2.5 py-1.5 hover:border-gold transition"
          >
            {lang === "fr" ? "عربي" : "FR"}
          </button>

          <Link href="/cart" className="relative hover:text-gold transition" aria-label="cart">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {count > 0 && (
              <span className="absolute -top-2 -end-2 bg-gold text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-beige-dark bg-white">
          <div className="container-mily py-4 space-y-3">
            <form onSubmit={submitSearch} className="flex">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full border border-beige-dark px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <button className="bg-ink text-white px-4" aria-label="search">→</button>
            </form>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2 border-b border-beige">
                {n.label}
              </Link>
            ))}
            <div className="py-2">
              <p className="font-medium mb-2">{t.categories}</p>
              <div className="grid grid-cols-2 gap-1">
                {categories?.map((c) => (
                  <Link key={c.id} href={`/shop?category=${c.slug}`} onClick={() => setOpen(false)} className="py-1.5 text-sm text-gray-600">
                    {localizedName(c, lang)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
