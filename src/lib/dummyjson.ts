import type { Category, Product } from "./products";

const BASE = "https://dummyjson.com";

type RawProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  images: string[];
  thumbnail: string;
  reviews?: { rating: number }[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
};

type RawCategory = { slug: string; name: string; url: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleCase(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function slugFor(product: { id: number; title: string }) {
  return `${slugify(product.title)}-${product.id}`;
}

export function idFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);
  return match ? Number(match[1]) : NaN;
}

function mapProduct(p: RawProduct, categoryName: string): Product {
  const hasDiscount = p.discountPercentage > 1;
  const compareAt = hasDiscount ? Math.round(p.price / (1 - p.discountPercentage / 100)) : undefined;
  const badge =
    hasDiscount && p.discountPercentage >= 12
      ? `Save ${Math.round(p.discountPercentage)}%`
      : p.rating >= 4.6
        ? "Best seller"
        : p.tags?.includes("new")
          ? "New"
          : undefined;

  const firstSentence = p.description.split(". ")[0]?.trim() ?? p.description;

  return {
    slug: slugFor(p),
    name: p.title,
    category: categoryName,
    price: Math.round(p.price),
    compareAt,
    image: p.images?.[0] ?? p.thumbnail,
    rating: Math.round(p.rating * 10) / 10,
    reviews: p.reviews?.length ?? Math.max(12, Math.round(p.stock * 1.5)),
    badge,
    tagline: firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`,
    description: p.description,
    details: [
      p.brand ? `Brand: ${p.brand}` : null,
      p.warrantyInformation ?? null,
      p.shippingInformation ?? null,
      p.returnPolicy ?? null,
    ].filter((x): x is string => Boolean(x)),
    colors: [{ name: "Standard", hex: "#1c2b27" }],
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/products/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("DummyJSON categories request failed");
  const raw: RawCategory[] = await res.json();
  return raw.map((c) => ({
    name: c.name,
    slug: c.slug,
    blurb: `Browse our ${c.name.toLowerCase()} picks.`,
  }));
}

export async function fetchAllProducts(): Promise<Product[]> {
  const [categories, res] = await Promise.all([
    fetchCategories().catch(() => [] as Category[]),
    fetch(`${BASE}/products?limit=0`, { cache: "no-store" }),
  ]);
  if (!res.ok) throw new Error("DummyJSON products request failed");
  const data: { products: RawProduct[] } = await res.json();
  const nameFor = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? titleCase(slug);
  return data.products.map((p) => mapProduct(p, nameFor(p.category)));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const id = idFromSlug(slug);
  if (!Number.isFinite(id)) return null;

  const [categories, res] = await Promise.all([
    fetchCategories().catch(() => [] as Category[]),
    fetch(`${BASE}/products/${id}`, { cache: "no-store" }),
  ]);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("DummyJSON product request failed");
  const raw: RawProduct = await res.json();
  const name = categories.find((c) => c.slug === raw.category)?.name ?? titleCase(raw.category);
  return mapProduct(raw, name);
}
