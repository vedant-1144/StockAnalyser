import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold">Stock not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Symbol data is unavailable right now. Try another NSE symbol.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-lg bg-primary/20 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/30"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
