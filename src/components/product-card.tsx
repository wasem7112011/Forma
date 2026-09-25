"use client";

import Link from "next/link";
import FadeImage from "./fade-image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Plus, Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money, type Product } from "@/lib/products";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const quickAdd = () => {
    add(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-3xl bg-paper">
        <Link href={`/product/${product.slug}`} className="block aspect-[4/5]">
          <FadeImage
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-sun px-3 py-1 text-xs font-semibold text-pine">
            {product.badge}
          </span>
        )}

        <button
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-paper/90 backdrop-blur transition hover:bg-paper"
        >
          <motion.span key={String(liked)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
            <Heart className={`size-[18px] ${liked ? "fill-pine text-pine" : "text-ink"}`} />
          </motion.span>
        </button>

        <button
          onClick={quickAdd}
          className={`absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-lg transition duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100 ${
            added ? "bg-sun text-pine" : "bg-pine text-mist hover:bg-pine-soft"
          }`}
        >
          {added ? <Check className="size-4" /> : <Plus className="size-4" />}
          {added ? "Added" : "Quick add"}
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div>
          <Link href={`/product/${product.slug}`} className="font-medium leading-snug hover:underline underline-offset-4">
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{money(product.price)}</p>
          {product.compareAt && (
            <p className="text-sm text-muted line-through">{money(product.compareAt)}</p>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 px-1 text-sm text-muted">
        <Star className="size-3.5 fill-sun text-sun" />
        <span className="font-medium text-ink">{product.rating}</span>
        <span>({product.reviews})</span>
      </div>
    </article>
  );
}
