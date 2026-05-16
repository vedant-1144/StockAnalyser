import { supabase } from "@/lib/supabase";

interface StockScoreInput {
  symbol: string;
  technicalScore: number;
  fundamentalScore: number;
  swingScore: number;
}

export async function upsertStockScore(input: StockScoreInput): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from("stock_scores").upsert(
      {
        symbol: input.symbol,
        technical_score: Number(input.technicalScore.toFixed(2)),
        fundamental_score: Number(input.fundamentalScore.toFixed(2)),
        swing_score: Number(input.swingScore.toFixed(2)),
        updated_at: new Date().toISOString()
      },
      { onConflict: "symbol" }
    );
  } catch {
    // Ignore persistence errors for MVP responsiveness.
  }
}
