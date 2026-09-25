"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/products";

const FREE_SHIPPING = 150;

export default function CartDrawer() {
  const { open, setOpen, items, linesCount, subtotal, loading, setQty, remove } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  const resolving = loading && linesCount > 0;
  const empty = linesCount === 0 && !resolving;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-pine/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Your bag</h2>
              <button
                aria-label="Close bag"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full transition hover:bg-mist"
              >
                <X className="size-5" />
              </button>
            </div>

            {resolving ? (
              <ul className="flex-1 space-y-5 px-6 py-6">
                {Array.from({ length: linesCount }).map((_, i) => (
                  <li key={i} className="flex animate-pulse gap-4">
                    <div className="size-24 shrink-0 rounded-2xl bg-mist" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 w-2/3 rounded-full bg-mist" />
                      <div className="h-3 w-1/3 rounded-full bg-mist" />
                      <div className="h-8 w-24 rounded-full bg-mist" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : empty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid size-20 place-items-center rounded-full bg-mist">
                  <ShoppingBag className="size-8 text-pine-soft" />
                </div>
                <h3 className="font-display text-xl font-semibold">Your bag is empty</h3>
                <p className="text-muted">Add something you like and it will wait for you here.</p>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-pine px-7 py-3 text-sm font-semibold text-mist transition hover:bg-pine-soft"
                >
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-line px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="size-4 text-pine-soft" />
                    {remaining > 0 ? (
                      <span>
                        Add <b>{money(remaining)}</b> more for free delivery
                      </span>
                    ) : (
                      <span className="font-medium text-pine-soft">Your order ships free</span>
                    )}
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist">
                    <motion.div
                      className="h-full rounded-full bg-pine"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>

                <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 overflow-hidden"
                      >
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-mist"
                        >
                          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col justify-between py-0.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium leading-tight">{item.name}</p>
                              <p className="mt-1 text-sm text-muted">{item.category}</p>
                            </div>
                            <button
                              aria-label={`Remove ${item.name}`}
                              onClick={() => remove(item.slug)}
                              className="text-muted transition hover:text-ink"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQty(item.slug, item.qty - 1)}
                                className="grid size-8 place-items-center rounded-full transition hover:bg-mist"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => setQty(item.slug, item.qty + 1)}
                                className="grid size-8 place-items-center rounded-full transition hover:bg-mist"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="font-semibold">{money(item.price * item.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-4 border-t border-line px-6 py-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-display text-2xl font-semibold">{money(subtotal)}</span>
                  </div>
                  <p className="text-sm text-muted">Taxes and delivery are calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-pine py-4 text-center font-semibold text-mist transition hover:bg-pine-soft"
                  >
                    Go to checkout
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full text-center text-sm font-medium text-muted underline-offset-4 hover:underline"
                  >
                    Keep shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
