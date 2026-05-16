import { NextRequest, NextResponse } from "next/server";
import { scanMarket } from "@/services/analysis";

export const revalidate = 300;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const symbolsParam = request.nextUrl.searchParams.get("symbols");
    const symbols = symbolsParam
      ? symbolsParam
          .split(",")
          .map((item) => item.trim().toUpperCase())
          .filter(Boolean)
      : undefined;

    const data = await scanMarket(symbols);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock scan", message: (error as Error).message },
      { status: 500 }
    );
  }
}
