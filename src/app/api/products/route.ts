import { NextRequest, NextResponse } from "next/server";
import { fetchAllProducts } from "@/lib/dummyjson";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const sort = searchParams.get("sort");
  const maxPrice = searchParams.get("maxPrice");

  let list;
  try {
    list = await fetchAllProducts();
  } catch {
    return NextResponse.json({ error: "Upstream product API is unavailable" }, { status: 502 });
  }

  list = list.filter((p) => {
    const matchesCategory = !category || category === "All" || p.category === category;
    const matchesQuery = !q || `${p.name} ${p.category} ${p.tagline}`.toLowerCase().includes(q);
    const matchesPrice = !maxPrice || p.price <= Number(maxPrice);
    return matchesCategory && matchesQuery && matchesPrice;
  });

  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

  return NextResponse.json(list);
}
