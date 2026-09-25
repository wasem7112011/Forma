import type { Product } from "./products";

export type ProductQuery = {
  category?: string;
  q?: string;
  sort?: string;
  maxPrice?: number;
};

function toQueryString(params: ProductQuery) {
  const s = new URLSearchParams();
  if (params.category && params.category !== "All") s.set("category", params.category);
  if (params.q) s.set("q", params.q);
  if (params.sort) s.set("sort", params.sort);
  if (params.maxPrice) s.set("maxPrice", String(params.maxPrice));
  const str = s.toString();
  return str ? `?${str}` : "";
}

export async function fetchProducts(params: ProductQuery = {}, signal?: AbortSignal): Promise<Product[]> {
  const res = await fetch(`/api/products${toQueryString(params)}`, { signal });
  if (!res.ok) throw new Error("Could not load products");
  return res.json();
}
