import Link from "next/link";
import { CreditCard, Mail, MapPin, Phone } from "lucide-react";
import type { Category } from "@/lib/products";

export default function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-32 bg-pine text-mist">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-1.5 font-display text-3xl font-bold tracking-tight">
            forma
            <span className="mt-1.5 size-2 rounded-full bg-sun" />
          </div>
          <p className="mt-4 text-mist/70">
            Everyday objects made from honest materials. Fewer things, chosen well, kept for years.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-mist/70">
            <CreditCard className="size-4" />
            Visa, Mastercard, cash on delivery
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-mist/70">
            <li>
              <Link href="/shop" className="transition hover:text-sun">
                All products
              </Link>
            </li>
            {categories.slice(0, 5).map((c) => (
              <li key={c.name}>
                <Link href={`/shop?category=${c.name}`} className="transition hover:text-sun">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Help</h4>
          <ul className="mt-4 space-y-2.5 text-mist/70">
            <li>Delivery and returns</li>
            <li>Warranty</li>
            <li>Track an order</li>
            <li>Size and care guides</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Contact</h4>
          <ul className="mt-4 space-y-3 text-mist/70">
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-sun" /> hello@forma.store
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-sun" /> +20 100 000 0000
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-sun" /> Cairo, Egypt
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mist/10 px-5 py-6 text-center text-sm text-mist/50">
        © 2026 Forma. All rights reserved.
      </div>
    </footer>
  );
}
