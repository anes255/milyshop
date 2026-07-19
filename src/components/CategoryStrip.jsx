"use client";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { localizedName } from "@/lib/utils";

// Simple, modest line-icons per category (drawn as SVG paths, no photos).
const ICONS = {
  dresses: "M10 3.5c0 1 .7 1.7 2 1.7s2-.7 2-1.7M10 3.5 8.5 6l1.3 1L8 20h8l-1.8-13 1.3-1L14 3.5",
  tops: "M9 4 4.5 7 6.5 10 8.5 9v11h7V9l2 1 2-3L15 4l-3 2z",
  pants: "M8 3h8l-.6 8H15l-1 10h-3l-.7-8h-.6L9 21H6l.6-10H8z",
  skirts: "M8.5 4h7l.5 3 3 8-3 1-1 4H9l-1-4-3-1 3-8z",
  jackets: "M9 4 4.5 6.5 6 11l2.5-1.2V20h7V9.8L18 11l1.5-4.5L15 4l-3 2.5zM12 6.5V20",
  sets: "M12 3.6a1.7 1.7 0 0 0-1 3l1 1v1L4 13v3.5h16V13l-7-4.4V7.6",
  activewear: "M9 4c0 1.6 1.2 2.4 3 2.4S15 5.6 15 4M9 4 6.5 6.2V20h11V6.2L15 4",
  lingerie: "M9.5 4.5 12 6.2l2.5-1.7M8.5 6.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M8.5 6.5 7.5 15c0 2.4 2 4 4.5 4s4.5-1.6 4.5-4l-1-8.5",
  swimwear: "M9 4.5c0 1.6 1.2 2.4 3 2.4s3-.8 3-2.4M9.5 7.5 8.7 13c0 3 1.6 5.5 3.3 5.5s3.3-2.5 3.3-5.5l-.8-5.5",
  shoes: "M3.5 13h9.5c2.2 1.4 4.2 2.2 6.5 2.4.8.1 1.5.7 1.5 1.6v1.5H3.5zM3.5 13V9.5M9 13v-2",
  bags: "M6.5 8.5h11l1 11.5h-13zM9.5 8.5V6.4a2.5 2.5 0 0 1 5 0v2.1",
  accessories: "M12 8.5 9.5 12l2.5 6 2.5-6zM9.5 12h5M12 4.5l-2 4M12 4.5l2 4",
  modest: "M12 3.4a2.6 2.6 0 0 0-2.6 2.6c0 1.1-.2 2-1 2.9L6 21h12l-2.4-12.1c-.8-.9-1-1.8-1-2.9A2.6 2.6 0 0 0 12 3.4zM8.6 9.5h6.8",
  "plus-size": "M9.8 6l-1.5 3 1.3 1L8 20h6.5l-1.6-10 1.3-1L12.8 6M17 3.5v4M15 5.5h4",
  maternity: "M12 3.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4M11 8.4c-1.2.2-2 1.3-2 3.1 0 1.8-.9 2.8-.9 4.6 0 2.1 1.2 3.7 3 3.7M13 8.4c2 .3 3.4 1.6 3.4 3.9 0 2-1.3 3.2-3.2 3.4",
  default: "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
};

export default function CategoryStrip({ categories = [] }) {
  const { lang } = useLang();
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/shop?category=${c.slug}`}
          className="group shrink-0 snap-start w-28 sm:w-32 flex flex-col items-center gap-3 rounded-2xl border border-beige-dark bg-beige/40 p-5 transition hover:bg-rose-light hover:border-gold"
        >
          <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden text-gold transition group-hover:scale-110">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={localizedName(c, lang)} className="w-full h-full object-cover" />
            ) : (
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d={ICONS[c.slug] || ICONS.default} />
              </svg>
            )}
          </span>
          <span className="text-sm font-medium text-ink text-center leading-tight">
            {localizedName(c, lang)}
          </span>
        </Link>
      ))}
    </div>
  );
}
