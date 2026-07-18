import Link from "next/link";
import { apiGet } from "@/lib/api";
import { getServerDict } from "@/lib/lang-server";
import { getCategories } from "@/lib/data";
import { DEMO_PRODUCTS } from "@/lib/demo";
import ProductGrid from "@/components/ProductGrid";
import CategoryStrip from "@/components/CategoryStrip";
import Newsletter from "@/components/Newsletter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { t } = getServerDict();
  const [categories, featured, newArrivals, bestSellers, latestDb] = await Promise.all([
    getCategories(),
    apiGet("/api/products?featured=true&take=8", []),
    apiGet("/api/products?newArrival=true&take=8", []),
    apiGet("/api/products?bestSeller=true&take=8&sort=popular", []),
    apiGet("/api/products?take=8", []),
  ]);

  // Fallback: if nothing flagged (or no backend), show latest / demo products
  const latest = latestDb.length ? latestDb : DEMO_PRODUCTS;
  const feat = featured.length ? featured : latest;
  const news = newArrivals.length ? newArrivals : latest;
  const best = bestSellers.length ? bestSellers : latest;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-beige/90 via-beige/50 to-transparent" />
        <div className="container-mily relative">
          <div className="max-w-lg fade-up">
            <p className="text-gold tracking-[0.3em] text-xs sm:text-sm mb-3">MILY SHOP</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-ink leading-tight">{t.heroTitle}</h1>
            <p className="text-base sm:text-lg text-gray-600 mt-4">{t.heroSubtitle}</p>
            <Link href="/shop" className="btn-gold mt-8">{t.shopNow}</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-mily py-16">
        <h2 className="section-title mb-10">{t.categories}</h2>
        <CategoryStrip categories={categories} />
      </section>

      {/* Featured */}
      <section className="container-mily py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">{t.featured}</h2>
          <Link href="/shop" className="text-sm text-gold hover:underline">{t.viewAll} →</Link>
        </div>
        <ProductGrid products={feat} />
      </section>

      {/* New arrivals */}
      <section className="container-mily py-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">{t.newArrivals}</h2>
          <Link href="/shop?sort=newest" className="text-sm text-gold hover:underline">{t.viewAll} →</Link>
        </div>
        <ProductGrid products={news} />
      </section>

      {/* Best sellers */}
      <section className="container-mily py-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">{t.bestSellers}</h2>
          <Link href="/shop?sort=popular" className="text-sm text-gold hover:underline">{t.viewAll} →</Link>
        </div>
        <ProductGrid products={best} />
      </section>

      <Newsletter />
    </>
  );
}
