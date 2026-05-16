import { NextResponse } from "next/server";
import { analyzeStock } from "@/services/analysis";

export const revalidate = 300;

export async function GET(
  _request: Request,
  context: { params: Promise<{ symbol: string }> }
): Promise<NextResponse> {
  try {
    const { symbol } = await context.params;
    const data = await analyzeStock(symbol);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock details", message: (error as Error).message },
      { status: 500 }
    );
  }
}
