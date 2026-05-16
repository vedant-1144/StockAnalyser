import { NextResponse } from "next/server";
import { scanMarket } from "@/services/analysis";

export const revalidate = 300;

export async function GET(): Promise<NextResponse> {
  try {
    const data = await scanMarket();

    return NextResponse.json({
      timestamp: data.timestamp,
      marketOverview: data.marketOverview,
      swingCandidates: data.swingCandidates,
      volumeBreakouts: data.volumeBreakouts,
      momentumStocks: data.momentumStocks
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch swing trades", message: (error as Error).message },
      { status: 500 }
    );
  }
}
