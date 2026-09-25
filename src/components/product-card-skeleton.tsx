export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-3xl bg-paper" />
      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="w-2/3 space-y-2">
          <div className="h-4 w-full rounded-full bg-paper" />
          <div className="h-3 w-1/2 rounded-full bg-paper" />
        </div>
        <div className="h-4 w-10 rounded-full bg-paper" />
      </div>
    </div>
  );
}
