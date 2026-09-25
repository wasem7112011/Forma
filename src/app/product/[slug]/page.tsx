import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ChevronRight, RotateCcw, ShieldCheck, Star, TriangleAlert, Truck } from "lucide-react";
import AddToCart from "@/components/add-to-cart";
import FadeImage from "@/components/fade-image";
import ProductCard from "@/components/product-card";
import { getProductBySlug, getProducts } from "@/lib/api-server";
import { money } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return { title: product ? `${product.name}. Forma` : "Forma" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product;
  let all;
  try {
    [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  } catch {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-32 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-paper text-pine-soft">
          <TriangleAlert className="size-7" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">We could not load this product</h1>
        <p className="mt-3 text-muted">The catalogue API did not respond. Refresh the page to try again.</p>
      </div>
    );
  }

  if (!product) notFound();

  const related = [
    ...all.filter((p) => p.category === product.category && p.slug !== product.slug),
    ...all.filter((p) => p.category !== product.category),
  ].slice(0, 4);

  const saving = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  const sections = [
    { title: "What is in the box", body: product.details },
    {
      title: "Delivery and returns",
      body: ["Free delivery on orders over $150", "Ships within 2 working days", "Free returns within 30 days"],
    },
    { title: "Care and warranty", body: ["Two-year warranty on every product", "Spare parts available on request"] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
          {product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper lg:sticky lg:top-28 lg:self-start">
          <FadeImage
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition duration-1000 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute left-5 top-5 rounded-full bg-sun px-4 py-1.5 text-sm font-semibold text-pine">
              {product.badge}
            </span>
          )}
        </div>

        <div className="lg:py-4">
          <p className="text-sm font-medium text-muted">{product.category}</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-[-0.03em] text-pine sm:text-6xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.round(product.rating) ? "fill-sun text-sun" : "text-line"}`}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted">{product.reviews} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">{money(product.price)}</span>
            {product.compareAt && (
              <>
                <span className="text-lg text-muted line-through">{money(product.compareAt)}</span>
                <span className="rounded-full bg-pine px-3 py-1 text-xs font-semibold text-sun">Save {saving}%</span>
              </>
            )}
          </div>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{product.description}</p>

          <div className="mt-9">
            <AddToCart product={product} />
          </div>

          <ul className="mt-9 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
            {[
              { icon: Truck, text: "Free delivery over $150" },
              { icon: RotateCcw, text: "30-day free returns" },
              { icon: ShieldCheck, text: "Two-year warranty" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium">
                <Icon className="size-5 text-pine-soft" />
                {text}
              </li>
            ))}
          </ul>

          <div className="divide-y divide-line">
            {sections.map((s, i) => (
              <details key={s.title} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {s.title}
                  <ChevronDown className="size-5 transition group-open:rotate-180" />
                </summary>
                <ul className="mt-4 space-y-2 text-muted">
                  {s.body.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sun ring-1 ring-pine" />
                      {line}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-28">
        <h2 className="font-display text-4xl font-bold tracking-[-0.03em] text-pine">You may also like</h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
