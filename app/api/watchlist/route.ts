import { NextRequest, NextResponse } from "next/server";
import { addWatchlistSymbol, listWatchlist, removeWatchlistSymbol } from "@/services/watchlist";

export async function GET(): Promise<NextResponse> {
  const items = await listWatchlist();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { symbol?: string };
    if (!body.symbol) {
      return NextResponse.json({ error: "symbol is required" }, { status: 400 });
    }

    const item = await addWatchlistSymbol(body.symbol);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add symbol", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const symbol = request.nextUrl.searchParams.get("symbol");
    if (!symbol) {
      return NextResponse.json({ error: "symbol query param is required" }, { status: 400 });
    }

    await removeWatchlistSymbol(symbol);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove symbol", message: (error as Error).message },
      { status: 500 }
    );
  }
}
