import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/dummyjson";

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Upstream product API is unavailable" }, { status: 502 });
  }
}
