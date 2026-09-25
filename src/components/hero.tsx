"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Plus, Star } from "lucide-react";
import FadeImage from "./fade-image";
import { useCart } from "@/lib/cart";
import { money, type Product } from "@/lib/products";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ product: featured }: { product: Product }) {
  const { add, setOpen } = useCart();

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pt-16">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
        <motion.h1
          variants={rise}
          className="font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-pine"
        >
          Objects you
          <br />
          will still love
          <br />
          in ten years.
        </motion.h1>
        <motion.p variants={rise} className="mt-7 max-w-md text-lg leading-relaxed text-muted">
          Watches, headphones, bags and shoes made from materials that age well and built to be repaired, not replaced.
        </motion.p>
        <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-pine px-8 py-4 font-semibold text-mist transition hover:bg-pine-soft"
          >
            Shop the collection
            <ArrowUpRight className="size-[18px] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/shop?category=Watches"
            className="rounded-full border border-pine/25 px-8 py-4 font-semibold text-pine transition hover:border-pine hover:bg-pine/5"
          >
            See watches
          </Link>
        </motion.div>
        <motion.div variants={rise} className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-3">
            {["#12302a", "#7d9a84", "#ecc86a", "#d9dfd9"].map((c) => (
              <span key={c} className="size-9 rounded-full border-2 border-mist" style={{ background: c }} />
            ))}
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-sun text-sun" />
              ))}
              <span className="ml-1 font-semibold">4.8</span>
            </div>
            <p className="text-muted">From more than 12,000 verified reviews</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative mx-auto w-full max-w-xl lg:max-w-none"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-pine">
          <FadeImage
            src={featured.image}
            alt={featured.name}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine/50 via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 180, damping: 18 }}
          className="absolute -left-2 bottom-8 flex w-[19rem] items-center gap-4 rounded-2xl bg-paper p-3 pr-4 shadow-2xl shadow-pine/20 sm:-left-8"
        >
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
            <Image src={featured.image} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{featured.name}</p>
            <p className="text-sm text-muted">{money(featured.price)}</p>
          </div>
          <button
            aria-label={`Add ${featured.name} to bag`}
            onClick={() => {
              add(featured.slug);
              setOpen(true);
            }}
            className="grid size-11 place-items-center rounded-full bg-sun text-pine transition hover:brightness-95"
          >
            <Plus className="size-5" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
