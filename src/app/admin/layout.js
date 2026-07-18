"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { getAdminDict } from "@/lib/admin-i18n";
import { getToken } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { lang } = useLang();
  const dir = getAdminDict(lang).dir;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/login");
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div className="min-h-screen flex bg-beige/40" dir={dir}>
      <AdminSidebar user={{ email: "admin" }} lang={lang} />
      {/* pt-14 clears the fixed mobile top bar (h-14); none on desktop */}
      <div className="flex-1 lg:ms-64 min-w-0 pt-14 lg:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
