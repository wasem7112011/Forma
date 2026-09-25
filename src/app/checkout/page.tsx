"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, CreditCard, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/products";

const inputClass =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3.5 outline-none transition placeholder:text-muted/60 focus:border-pine focus:ring-4 focus:ring-pine/10";

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"card" | "cod">("card");
  const [order, setOrder] = useState<string | null>(null);

  const shippingCost = subtotal >= 150 && shipping === "standard" ? 0 : shipping === "express" ? 12 : 8;
  const total = subtotal + shippingCost;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOrder(`FM-${Math.floor(100000 + Math.random() * 900000)}`);
    clear();
  };

  if (order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="grid size-24 place-items-center rounded-full bg-pine text-sun"
        >
          <Check className="size-10" strokeWidth={2.5} />
        </motion.div>
        <h1 className="mt-8 font-display text-5xl font-bold tracking-[-0.03em] text-pine">Thank you</h1>
        <p className="mt-4 text-lg text-muted">
          Your order <span className="font-semibold text-ink">{order}</span> is confirmed. We sent the details to your email and will let you know when it ships.
        </p>
        <Link href="/shop" className="mt-9 rounded-full bg-pine px-8 py-4 font-semibold text-mist transition hover:bg-pine-soft">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-28 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-paper">
          <ShoppingBag className="size-8 text-pine-soft" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-pine">Your bag is empty</h1>
        <p className="mt-3 text-muted">Add a few things to your bag and come back to check out.</p>
        <Link href="/shop" className="mt-8 rounded-full bg-pine px-8 py-4 font-semibold text-mist transition hover:bg-pine-soft">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-12 px-5 pb-10 pt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8 lg:pt-16">
      <div className="space-y-12">
        <h1 className="font-display text-5xl font-bold tracking-[-0.03em] text-pine">Checkout</h1>

        <section className="space-y-5">
          <h2 className="font-display text-2xl font-semibold">Contact</h2>
          <Field label="Email">
            <input required type="email" placeholder="you@example.com" className={inputClass} />
          </Field>
          <Field label="Phone">
            <input required type="tel" placeholder="+20 100 000 0000" className={inputClass} />
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-2xl font-semibold">Delivery address</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name">
              <input required className={inputClass} />
            </Field>
            <Field label="Last name">
              <input required className={inputClass} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input required placeholder="Street, building, apartment" className={inputClass} />
            </Field>
            <Field label="City">
              <input required className={inputClass} />
            </Field>
            <Field label="Postal code">
              <input className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Delivery method</h2>
          {[
            { id: "standard" as const, title: "Standard", note: "3 to 5 working days", price: subtotal >= 150 ? "Free" : "$8" },
            { id: "express" as const, title: "Express", note: "1 to 2 working days", price: "$12" },
          ].map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
                shipping === o.id ? "border-pine bg-paper ring-4 ring-pine/10" : "border-line hover:border-pine/40"
              }`}
            >
              <span className="flex items-center gap-4">
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping === o.id}
                  onChange={() => setShipping(o.id)}
                  className="size-4 accent-pine"
                />
                <span>
                  <span className="block font-semibold">{o.title}</span>
                  <span className="text-sm text-muted">{o.note}</span>
                </span>
              </span>
              <span className="font-semibold">{o.price}</span>
            </label>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Payment</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { id: "card" as const, title: "Credit or debit card", icon: CreditCard },
              { id: "cod" as const, title: "Cash on delivery", icon: Banknote },
            ].map(({ id, title, icon: Icon }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                  payment === id ? "border-pine bg-paper ring-4 ring-pine/10" : "border-line hover:border-pine/40"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === id}
                  onChange={() => setPayment(id)}
                  className="size-4 accent-pine"
                />
                <Icon className="size-5 text-pine-soft" />
                <span className="font-semibold">{title}</span>
              </label>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {payment === "card" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid gap-5 pt-2 sm:grid-cols-2">
                  <Field label="Card number" className="sm:col-span-2">
                    <input required inputMode="numeric" placeholder="1234 5678 9012 3456" className={inputClass} />
                  </Field>
                  <Field label="Expiry">
                    <input required placeholder="MM / YY" className={inputClass} />
                  </Field>
                  <Field label="Security code">
                    <input required inputMode="numeric" placeholder="123" className={inputClass} />
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] bg-paper p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold">Order summary</h2>
          <ul className="mt-6 space-y-5">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-mist">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-bl-xl bg-pine text-[11px] font-bold text-mist">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium leading-tight">{item.name}</p>
                  <p className="text-sm text-muted">{item.category}</p>
                </div>
                <span className="font-semibold">{money(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-2">
            <input placeholder="Discount code" className={`${inputClass} py-3`} />
            <button type="button" className="rounded-2xl border border-pine px-5 font-semibold text-pine transition hover:bg-pine hover:text-mist">
              Apply
            </button>
          </div>

          <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-medium">{shippingCost === 0 ? "Free" : money(shippingCost)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="text-base font-semibold">Total</dt>
              <dd className="font-display text-3xl font-semibold">{money(total)}</dd>
            </div>
          </dl>

          <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-pine py-4 font-semibold text-mist transition hover:bg-pine-soft">
            <Lock className="size-4" />
            Pay {money(total)}
          </button>
          <p className="mt-4 text-center text-xs text-muted">Your payment details are encrypted and never stored.</p>
        </div>
      </aside>
    </form>
  );
}
