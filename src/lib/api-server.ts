import { headers } from "next/headers";
import type { Product } from "./products";
import type { Category } from "./products";

async function origin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export type ProductQuery = {
  category?: string;
  q?: string;
  sort?: string;
  maxPrice?: number;
};

function query(params: ProductQuery) {
  const s = new URLSearchParams();
  if (params.category && params.category !== "All") s.set("category", params.category);
  if (params.q) s.set("q", params.q);
  if (params.sort) s.set("sort", params.sort);
  if (params.maxPrice) s.set("maxPrice", String(params.maxPrice));
  const str = s.toString();
  return str ? `?${str}` : "";
}

export async function getProducts(params: ProductQuery = {}): Promise<Product[]> {
  const res = await fetch(`${await origin()}/api/products${query(params)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load products");
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${await origin()}/api/products/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load product");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${await origin()}/api/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load categories");
  return res.json();
}
