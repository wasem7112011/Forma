"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const { add, setOpen } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const addToBag = () => {
    add(product.slug, qty);
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    add(product.slug, qty);
    router.push("/checkout");
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium">
          Colour: <span className="text-muted">{color.name}</span>
        </p>
        <div className="mt-3 flex gap-3">
          {product.colors.map((c) => (
            <button
              key={c.name}
              aria-label={c.name}
              aria-pressed={color.name === c.name}
              onClick={() => setColor(c)}
              className={`size-10 rounded-full border border-black/10 ring-offset-2 ring-offset-mist transition ${
                color.name === c.name ? "ring-2 ring-pine" : "hover:ring-2 hover:ring-pine/30"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-line bg-paper">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-12 place-items-center rounded-full transition hover:bg-mist"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="grid size-12 place-items-center rounded-full transition hover:bg-mist"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <button
          onClick={addToBag}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold transition ${
            added ? "bg-sun text-pine" : "bg-pine text-mist hover:bg-pine-soft"
          }`}
        >
          {added && <Check className="size-4" />}
          {added ? "Added to bag" : "Add to bag"}
        </button>
        <button
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="grid size-12 place-items-center rounded-full border border-line bg-paper transition hover:border-pine"
        >
          <Heart className={`size-5 ${liked ? "fill-pine text-pine" : ""}`} />
        </button>
      </div>

      <button
        onClick={buyNow}
        className="h-12 w-full rounded-full border border-pine font-semibold text-pine transition hover:bg-pine hover:text-mist"
      >
        Buy it now
      </button>
    </div>
  );
}
