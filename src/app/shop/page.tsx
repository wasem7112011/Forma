import ShopClient from "@/components/shop-client";
import { getCategories } from "@/lib/api-server";

export const metadata = { title: "Shop. Forma" };

const SORTS = ["featured", "price-asc", "price-desc", "rating"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; maxPrice?: string }>;
}) {
  const [{ q, category, sort, maxPrice }, categories] = await Promise.all([searchParams, getCategories()]);
  const validCategory = categories.some((c) => c.name === category) ? (category as string) : "All";
  const validSort = SORTS.includes(sort ?? "") ? (sort as string) : "featured";
  const parsedLimit = Number(maxPrice);
  const validLimit = maxPrice && Number.isFinite(parsedLimit) ? parsedLimit : undefined;

  return (
    <ShopClient
      key={`${q ?? ""}-${validCategory}-${validSort}-${validLimit ?? ""}`}
      categories={categories}
      initialQuery={q ?? ""}
      initialCategory={validCategory}
      initialSort={validSort}
      initialLimit={validLimit}
    />
  );
}
