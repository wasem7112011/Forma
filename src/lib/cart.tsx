"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { fetchProducts } from "./api-browser";
import type { Product } from "./products";

type Line = { id: string; qty: number };

export type CartItem = Product & { qty: number };

type CartValue = {
  items: CartItem[];
  count: number;
  linesCount: number;
  subtotal: number;
  open: boolean;
  loading: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "forma-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const items = lines
      .map((l) => {
        const p = catalog.find((x) => x.slug === l.id);
        return p ? { ...p, qty: l.qty } : null;
      })
      .filter((x): x is CartItem => x !== null);
    return {
      items,
      count: lines.reduce((n, l) => n + l.qty, 0),
      linesCount: lines.length,
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      open,
      loading,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, catalog, open, loading, add, setQty, remove, clear]);

  return (
    <MotionConfig reducedMotion="user">
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    </MotionConfig>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
