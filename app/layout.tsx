import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, BookMarked, Home } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indian Stocks Swing Trade Analyzer",
  description: "Personal AI-assisted dashboard for Indian swing trade opportunities"
};

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/watchlist", label: "Watchlist", icon: BookMarked }
] as const;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/20 p-2 text-primary shadow-glow">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">NSE / BSE</p>
                <h1 className="text-lg font-semibold text-foreground">Swing Trade Analyzer</h1>
              </div>
            </Link>

            <nav className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
