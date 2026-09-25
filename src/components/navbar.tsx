"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Category } from "@/lib/products";

export default function Navbar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearching(false);
    setQuery("");
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <>
      <div className="bg-pine px-4 py-2 text-center text-xs text-mist/90">
        Free delivery on orders over $150. Returns are free for 30 days.
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b border-line bg-mist/85 backdrop-blur-xl" : "border-b border-transparent bg-mist"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              aria-label="Open menu"
              onClick={() => setMenu(true)}
              className="grid size-10 place-items-center rounded-full transition hover:bg-pine/10"
            >
              <Menu className="size-5" />
            </button>
          </div>

          <Link href="/" className="flex items-center gap-1.5 font-display text-2xl font-bold tracking-tight">
            forma
            <span className="mt-1 size-2 rounded-full bg-sun ring-2 ring-pine" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <Link href="/shop" className="transition hover:text-pine-soft">
              Shop all
            </Link>
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.name}
                href={`/shop?category=${c.name}`}
                className="text-muted transition hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              aria-label="Search"
              onClick={() => setSearching(true)}
              className="grid size-10 place-items-center rounded-full transition hover:bg-pine/10"
            >
              <Search className="size-5" />
            </button>
            <button
              aria-label="Account"
              className="hidden size-10 place-items-center rounded-full transition hover:bg-pine/10 sm:grid"
            >
              <User className="size-5" />
            </button>
            <button
              aria-label="Open bag"
              onClick={() => setOpen(true)}
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-pine/10"
            >
              <ShoppingBag className="size-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-sun px-1 text-[11px] font-bold text-pine"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-pine/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenu(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-mist p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold">forma</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenu(false)}
                  className="grid size-10 place-items-center rounded-full hover:bg-pine/10"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                <Link
                  href="/shop"
                  onClick={() => setMenu(false)}
                  className="py-3 font-display text-3xl font-semibold tracking-tight"
                >
                  Shop all
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    href={`/shop?category=${c.name}`}
                    onClick={() => setMenu(false)}
                    className="py-2 text-lg text-muted transition hover:text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searching && (
          <motion.div
            className="fixed inset-0 z-50 bg-pine/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearching(false)}
          >
            <motion.form
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="mx-auto mt-24 flex w-[92%] max-w-2xl items-center gap-3 rounded-full bg-paper px-6 py-4 shadow-2xl"
            >
              <Search className="size-5 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search watches, headphones, bags"
                className="w-full bg-transparent text-lg outline-none placeholder:text-muted/70"
              />
              <button type="button" aria-label="Close search" onClick={() => setSearching(false)}>
                <X className="size-5 text-muted" />
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
