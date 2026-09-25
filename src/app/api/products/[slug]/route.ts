import { NextResponse } from "next/server";
import { fetchProductBySlug } from "@/lib/dummyjson";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    return NextResponse.json({ error: "Upstream product API is unavailable" }, { status: 502 });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
