"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX, TriangleAlert, X } from "lucide-react";
import ProductCard from "./product-card";
import ProductCardSkeleton from "./product-card-skeleton";
import { fetchProducts } from "@/lib/api-browser";
import { money, type Category, type Product } from "@/lib/products";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const MAX_PRICE = 460;
const DEBOUNCE = 350;

export default function ShopClient({
  categories,
  initialQuery,
  initialCategory,
  initialSort,
  initialLimit,
}: {
  categories: Category[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
  initialLimit?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [limit, setLimit] = useState(initialLimit ?? MAX_PRICE);

  const [list, setList] = useState<Product[] | null>(null);
  const [errored, setErrored] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const firstLoad = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    const isFirst = firstLoad.current;
    const timer = setTimeout(
      () => {
        setErrored(false);
        fetchProducts({ category, q: query, sort, maxPrice: limit }, controller.signal)
          .then((data) => {
            setList(data);
            firstLoad.current = false;
          })
          .catch((err) => {
            if (err.name !== "AbortError") setErrored(true);
          });
      },
      isFirst ? 0 : DEBOUNCE,
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [category, query, sort, limit, retryToken]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "All") params.set("category", category);
    if (sort !== "featured") params.set("sort", sort);
    if (limit !== MAX_PRICE) params.set("maxPrice", String(limit));
    const next = params.toString();
    if (next === searchParams.toString()) return;
    router.replace(next ? `/shop?${next}` : "/shop", { scroll: false });
  }, [query, category, sort, limit, router, searchParams]);

  const reset = useCallback(() => {
    setQuery("");
    setCategory("All");
    setLimit(MAX_PRICE);
    setSort("featured");
  }, []);

  const loading = list === null && !errored;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 lg:px-8 lg:pt-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl font-bold tracking-[-0.03em] text-pine sm:text-6xl">
          {category === "All" ? "The full collection" : category}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {category === "All"
            ? "Everything we make and everything we carry, in one place."
            : categories.find((c) => c.name === category)?.blurb}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
          {["All", ...categories.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                category === c ? "bg-pine text-mist" : "bg-paper text-ink hover:bg-pine/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-paper px-4 py-2.5">
            <Search className="size-4 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-32 bg-transparent text-sm outline-none placeholder:text-muted"
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                <X className="size-4 text-muted" />
              </button>
            )}
          </div>
          <label className="flex items-center gap-3 rounded-full bg-paper px-4 py-2.5 text-sm">
            <span className="text-muted">Up to</span>
            <input
              type="range"
              min={80}
              max={MAX_PRICE}
              step={10}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-24 accent-pine"
            />
            <span className="w-12 font-semibold">{money(limit)}</span>
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full bg-paper px-4 py-2.5 text-sm font-medium outline-none"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-muted">
        {loading ? "Loading products" : `${list?.length ?? 0} ${list?.length === 1 ? "product" : "products"}`}
      </p>

      {errored ? (
        <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-paper text-pine-soft">
            <TriangleAlert className="size-8" />
          </div>
          <h2 className="font-display text-2xl font-semibold">Could not reach the store</h2>
          <p className="text-muted">The product API did not respond. Check your connection and try again.</p>
          <button
            onClick={() => setRetryToken((t) => t + 1)}
            className="rounded-full bg-pine px-7 py-3 text-sm font-semibold text-mist hover:bg-pine-soft"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : list && list.length === 0 ? (
        <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-paper">
            <SearchX className="size-8 text-pine-soft" />
          </div>
          <h2 className="font-display text-2xl font-semibold">Nothing matches those filters</h2>
          <p className="text-muted">Try a different search or raise the price limit.</p>
          <button onClick={reset} className="rounded-full bg-pine px-7 py-3 text-sm font-semibold text-mist hover:bg-pine-soft">
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div layout className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list?.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <ProductCard product={p} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
