"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

export default function CheckoutPage() {
  const { t } = useLang();
  const router = useRouter();
  const { items, coupon, clear } = useCart();
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const total = subtotal - discount;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          couponCode: coupon?.code || null,
          items: items.map((i) => ({
            productId: i.productId, name: i.name, image: i.image,
            price: i.price, size: i.size, color: i.color, quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "error");
      clear();
      setDone(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="container-mily py-24 text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-beige flex items-center justify-center">
          <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gold"><path d="m5 13 4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-semibold text-gold mb-3">{t.orderSuccess}</h1>
        <p className="text-gray-500 mb-8">{t.orderSuccessText}</p>
        <Link href="/shop" className="btn-gold">{t.continueShopping}</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-mily py-24 text-center">
        <p className="text-gray-400 mb-6">{t.emptyCart}</p>
        <Link href="/shop" className="btn-gold">{t.continueShopping}</Link>
      </div>
    );
  }

  return (
    <div className="container-mily py-10">
      <h1 className="text-3xl font-semibold mb-8">{t.checkout}</h1>
      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          <div>
            <label className="label">{t.fullName} *</label>
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">{t.phone} *</label>
            <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">{t.address} *</label>
            <textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">{t.deliveryNotes}</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">{t.paymentMethod}</label>
            <div className="border border-gold bg-beige p-4 flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-gold" />
              <span className="font-medium">{t.cashOnDelivery}</span>
            </div>
          </div>
        </div>

        <div className="bg-beige p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">{t.orderSummary}</h2>
          <div className="space-y-3 max-h-64 overflow-auto mb-4">
            {items.map((i) => (
              <div key={i.key} className="flex gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="w-12 h-14 object-cover bg-white" />
                <div className="flex-1">
                  <p className="line-clamp-1">{i.name}</p>
                  <p className="text-gray-400">×{i.quantity}</p>
                </div>
                <span>{formatPrice(i.price * i.quantity, t.currency)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-beige-dark pt-4">
            <div className="flex justify-between"><span>{t.subtotal}</span><span>{formatPrice(subtotal, t.currency)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>{t.discount}</span><span>-{formatPrice(discount, t.currency)}</span></div>}
            <div className="flex justify-between text-lg font-semibold border-t border-beige-dark pt-2"><span>{t.total}</span><span className="text-gold">{formatPrice(total, t.currency)}</span></div>
          </div>
          {err && <p className="text-red-500 text-sm mt-3">{err}</p>}
          <button disabled={loading} className="btn-gold w-full mt-6 disabled:opacity-50">
            {loading ? "..." : t.placeOrder}
          </button>
        </div>
      </form>
    </div>
  );
}
