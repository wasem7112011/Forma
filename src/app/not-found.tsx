import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-32 text-center">
      <p className="font-display text-8xl font-bold tracking-tight text-pine">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">We could not find that page</h1>
      <p className="mt-3 text-muted">The link may be broken or the product may no longer be available.</p>
      <Link href="/shop" className="mt-8 rounded-full bg-pine px-8 py-4 font-semibold text-mist transition hover:bg-pine-soft">
        Back to the shop
      </Link>
    </div>
  );
}
