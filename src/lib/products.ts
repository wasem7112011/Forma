export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  tagline: string;
  description: string;
  details: string[];
  colors: { name: string; hex: string }[];
};

export type Category = { name: string; slug: string; blurb: string };

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
