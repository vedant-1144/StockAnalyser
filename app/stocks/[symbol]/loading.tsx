export default function StockAnalysisLoading() {
  return (
    <div className="space-y-6">
      <section className="glass-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-card p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </section>

      <section className="glass-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Fetching live quote, fundamentals, history, and technical indicators...</p>
        </div>
        <div className="h-[360px] animate-pulse rounded-lg bg-muted/70" />
      </section>
    </div>
  );
}
