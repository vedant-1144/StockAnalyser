import { NextRequest, NextResponse } from "next/server";
import { addWatchlistSymbol, listWatchlist, removeWatchlistSymbol } from "@/services/watchlist";

function errorResponse(error: unknown, fallback: string): NextResponse {
  const message = error instanceof Error ? error.message : fallback;
  console.error(fallback, error);

  return NextResponse.json({ error: fallback, message }, { status: 500 });
}

export async function GET(): Promise<NextResponse> {
  try {
    const items = await listWatchlist();
    return NextResponse.json({ items });
  } catch (error) {
    return errorResponse(error, "Failed to fetch watchlist");
  }
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
    return errorResponse(error, "Failed to add symbol");
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
    return errorResponse(error, "Failed to remove symbol");
  }
}
