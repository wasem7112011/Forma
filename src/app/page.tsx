import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, RotateCcw, ShieldCheck, Truck, Wrench, Headset, Star, TriangleAlert } from "lucide-react";
import Hero from "@/components/hero";
import ProductCard from "@/components/product-card";
import Newsletter from "@/components/newsletter";
import { getCategories, getProducts } from "@/lib/api-server";

const perks = [
  { icon: Truck, title: "Free delivery", text: "On orders over $150" },
  { icon: RotateCcw, title: "30-day returns", text: "Free, no questions asked" },
  { icon: ShieldCheck, title: "Two-year warranty", text: "On every product" },
  { icon: Headset, title: "Real support", text: "Replies within a few hours" },
];

const tileLayout: Record<string, string> = {
  Watches: "col-span-2 row-span-2",
  Audio: "",
  Bags: "row-span-2",
  Footwear: "",
  Eyewear: "col-span-2",
  Fragrance: "",
  Tech: "",
};

const commitments = [
  { icon: Wrench, title: "Repairable by design", text: "Straps, pads, soles and batteries can all be replaced. We sell every spare part." },
  { icon: Leaf, title: "Honest materials", text: "Full-grain leather, recycled knits and steel. Nothing that peels or cracks in a year." },
  { icon: ShieldCheck, title: "Backed for two years", text: "If something fails under normal use, we fix it or send a new one." },
];

const reviews = [
  {
    name: "Nadine A.",
    product: "Chrono Classic",
    text: "I get compliments on this watch every week. The strap was comfortable from the first day and it has not lost a second.",
  },
  {
    name: "Karim S.",
    product: "Voyager Tote",
    text: "The leather is already developing a lovely colour after three months of daily use.",
  },
  {
    name: "Laila M.",
    product: "Halo Wireless",
    text: "Best headphones I have owned. Battery lasts the whole week.",
  },
];

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let failed = false;

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch {
    failed = true;
  }

  if (failed || products.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-32 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-paper text-pine-soft">
          <TriangleAlert className="size-7" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">We could not load the store</h1>
        <p className="mt-3 text-muted">The catalogue API did not respond. Refresh the page to try again.</p>
      </div>
    );
  }

  const bestSellers = products.filter((p) => p.badge === "Best seller" || p.badge === "Save 20%").slice(0, 4);
  const more = products.filter((p) => !bestSellers.includes(p));
  const bag = products.find((p) => p.slug === "voyager-leather-tote") ?? products[0];
  const featured = products.find((p) => p.slug === "chrono-classic-watch") ?? products[0];

  return (
    <>
      <Hero product={featured} />

      <section className="mx-auto mt-10 max-w-7xl px-5 lg:px-8">
        <ul className="grid grid-cols-2 gap-6 border-y border-line py-8 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-pine text-sun">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold leading-tight">{title}</p>
                <p className="mt-0.5 text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-28 max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="max-w-lg font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-pine sm:text-5xl">
            Start with what you use every day
          </h2>
          <Link href="/shop" className="hidden items-center gap-1.5 font-semibold text-pine underline-offset-4 hover:underline sm:flex">
            All products <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid auto-rows-[190px] grid-flow-dense grid-cols-2 gap-4 lg:auto-rows-[230px] lg:grid-cols-4">
          {categories.map((c) => {
            const img = products.find((p) => p.category === c.name)?.image ?? products[0].image;
            const count = products.filter((p) => p.category === c.name).length;
            return (
              <Link
                key={c.name}
                href={`/shop?category=${c.name}`}
                className={`group relative overflow-hidden rounded-3xl bg-pine ${tileLayout[c.name]}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-pine/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-mist">
                  <div>
                    <p className="font-display text-xl font-semibold sm:text-2xl">{c.name}</p>
                    <p className="text-sm text-mist/70">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-sun text-pine transition group-hover:rotate-45">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-7xl px-5 lg:px-8">
        <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-pine sm:text-5xl">
          Most loved this month
        </h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-28 bg-pine text-mist">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Image src={bag.image} alt={bag.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Made to be repaired, not replaced
            </h2>
            <p className="mt-5 max-w-lg text-lg text-mist/70">
              A good object should get better with age. That is why we choose materials that wear in and design every product so it can be mended.
            </p>
            <ul className="mt-10 space-y-7">
              {commitments.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-pine-soft text-sun">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold">{title}</p>
                    <p className="mt-1 max-w-md text-mist/65">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-28">
        <div className="mx-auto flex max-w-7xl items-end justify-between px-5 lg:px-8">
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-pine sm:text-5xl">
            Just in
          </h2>
          <Link href="/shop" className="flex items-center gap-1.5 font-semibold text-pine underline-offset-4 hover:underline">
            View all <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x gap-6 overflow-x-auto px-5 pb-2 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {more.map((p) => (
            <div key={p.slug} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 grid max-w-7xl gap-5 px-5 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <figure className="flex flex-col justify-between rounded-[2rem] bg-paper p-8 sm:p-12">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-5 fill-sun text-sun" />
            ))}
          </div>
          <blockquote className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight text-pine sm:text-3xl">
            {reviews[0].text}
          </blockquote>
          <figcaption className="mt-10 text-sm text-muted">
            <span className="font-semibold text-ink">{reviews[0].name}</span> bought the {reviews[0].product}
          </figcaption>
        </figure>
        <div className="grid gap-5">
          {reviews.slice(1).map((r, i) => (
            <figure
              key={r.name}
              className={`rounded-[2rem] p-8 ${i === 0 ? "bg-pine text-mist" : "bg-mist ring-1 ring-line"}`}
            >
              <blockquote className="leading-relaxed">{r.text}</blockquote>
              <figcaption className={`mt-5 text-sm ${i === 0 ? "text-mist/60" : "text-muted"}`}>
                <span className={`font-semibold ${i === 0 ? "text-sun" : "text-ink"}`}>{r.name}</span> bought the {r.product}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
