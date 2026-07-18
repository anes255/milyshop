"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";

function Social({ href, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-white/30 rounded-full hover:bg-gold hover:border-gold transition">
      {children}
    </a>
  );
}

export default function Footer({ settings }) {
  const { t } = useLang();
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="bg-ink text-white/80 mt-20">
      <div className="container-mily py-14 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="serif text-2xl text-gold mb-3">{settings?.siteName || "Boutique MilyShop"}</h3>
          <p className="text-sm leading-relaxed">{settings?.footerText}</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">{t.shop}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-gold">{t.shop}</Link></li>
            <li><Link href="/shop?sort=newest" className="hover:text-gold">{t.newArrivals}</Link></li>
            <li><Link href="/shop?sort=popular" className="hover:text-gold">{t.bestSellers}</Link></li>
            <li><Link href="/cart" className="hover:text-gold">{t.cart}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">{t.contactUs}</h4>
          <ul className="space-y-2 text-sm">
            {settings?.phone && <li>{settings.phone}</li>}
            {settings?.email && <li>{settings.email}</li>}
            {settings?.address && <li>{settings.address}</li>}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">{t.followUs}</h4>
          <div className="flex gap-3">
            <Social href={settings?.facebook}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 22v-8h3l1-4h-4V8c0-1 .3-2 2-2h2V2.5C18.5 2.4 17 2 15.7 2 12.8 2 11 3.7 11 6.9V10H8v4h3v8z"/></svg>
            </Social>
            <Social href={settings?.instagram}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </Social>
            <Social href={settings?.tiktok}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 3v3.5a5.5 5.5 0 0 0 4 1.8v3a8.4 8.4 0 0 1-4-1v5.2A6.5 6.5 0 1 1 9.5 12v3.2A3.3 3.3 0 1 0 13 18.5V3z"/></svg>
            </Social>
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-white/30 rounded-full hover:bg-gold hover:border-gold transition">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.9 7L4 20l1-4A8 8 0 1 1 20 12z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} {settings?.siteName}. All rights reserved.</span>
        <Link href="/login" className="text-white/40 hover:text-gold transition">· {t.admin}</Link>
      </div>
    </footer>
  );
}
