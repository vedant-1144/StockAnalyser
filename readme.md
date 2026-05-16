# Indian Stocks Swing Trade Analyzer
## Simplified Personal Version (MVP)

Build a lightweight modern web application for personal use that analyzes Indian stocks for swing trading opportunities using:

- Fundamental analysis
- Quarterly results
- Technical indicators
- Trend analysis
- Volume analysis
- Swing trade setups

The application should focus on simplicity, fast performance, and free deployment.

---

# 1. Goal

Create a simple AI-assisted stock analysis dashboard for NSE/BSE stocks where:

- Stocks are scanned daily
- Good swing trade opportunities are detected
- Technical indicators are analyzed
- Fundamentals are checked
- TradingView charts are accessible instantly

This app is for personal usage only.

---

# 2. Tech Stack (IMPORTANT)

Use ONLY these technologies:

## Frontend + Backend

- Next.js 15+
- TypeScript
- Tailwind CSS
- App Router

## Database

- Supabase PostgreSQL

## Hosting

- Vercel Free Plan

## Stock Data

- Yahoo Finance API (`yahoo-finance2`)

## Charts

- TradingView Embeds
- Recharts / ApexCharts

---

# 3. Keep Architecture SIMPLE

IMPORTANT:

Do NOT create:

- Microservices
- Docker
- Kubernetes
- Redis
- Complex AI infrastructure
- Heavy ML pipelines
- Enterprise architecture

Everything should run inside ONE Next.js application.

---

# 4. Main Features

## Dashboard

Create a modern dashboard with:

- Nifty overview
- Top gainers
- Top losers
- Swing trade candidates
- Volume breakout stocks
- Momentum stocks
- Market trend overview

Use:

- Dark theme
- Responsive UI
- Card-based layout

---

# 5. Stock Analysis Features

For each stock analyze:

## Fundamental Metrics

- PE Ratio
- PB Ratio
- ROE
- ROCE
- EPS
- Debt to Equity
- Revenue Growth
- Profit Growth
- Market Cap

Generate:

- Fundamental Score (0–100)

---

## Quarterly Results

Analyze:

- QoQ revenue growth
- YoY revenue growth
- Profit growth
- EPS growth

Generate:

- Earnings Score

---

## Technical Analysis

Implement:

- RSI
- MACD
- EMA 20
- EMA 50
- SMA 200
- Volume breakout
- Support & resistance

Detect:

- Uptrend
- Breakouts
- Reversal setups
- Consolidation

Generate:

- Swing Trade Score
- Entry price
- Stop loss
- Target levels

---

# 6. AI Recommendation Logic

Do NOT use heavy ML initially.

Use rule-based scoring.

Example:

```ts
if (
  rsi < 65 &&
  ema20 > ema50 &&
  revenueGrowth > 15 &&
  volumeBreakout === true
) {
  score += 20;
}
```

Classify stocks into:

- Strong Swing Buy
- Watchlist
- Avoid

---

# 7. TradingView Integration

When user clicks stock symbol:

Open TradingView chart in new tab.

Example:

```ts
window.open(
  `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`
)
```

Also embed TradingView widgets inside stock details page.

---

# 8. Pages Required

Create these pages:

## Home Dashboard

Route:

```bash
/
```

Contains:

- Market overview
- Swing trade cards
- Trending stocks

---

## Stock Details Page

Route:

```bash
/stocks/[symbol]
```

Contains:

- Technical indicators
- Fundamentals
- Quarterly results
- AI summary
- TradingView chart

---

## Watchlist Page

Route:

```bash
/watchlist
```

Allows saving favorite stocks.

---

# 9. Suggested Folder Structure

```bash
app/
components/
lib/
services/
types/
hooks/
utils/
```

---

# 10. APIs

Create simple API routes inside Next.js.

## Example APIs

```bash
/api/stocks
/api/stocks/[symbol]
/api/swing-trades
/api/watchlist
```

---

# 11. Database

Use Supabase PostgreSQL.

Create tables:

## users

- id
- email

## watchlist

- id
- user_id
- symbol

## stock_scores

- symbol
- technical_score
- fundamental_score
- swing_score

---

# 12. Data Fetching

Use:

```bash
npm install yahoo-finance2
```

Example:

```ts
import yahooFinance from "yahoo-finance2";

const data = await yahooFinance.quote("RELIANCE.NS");
```

---

# 13. UI Design

Design inspired by:

- TradingView
- Zerodha
- Screener.in

Requirements:

- Dark mode
- Responsive
- Clean charts
- Smooth animations

Use:

- Tailwind CSS
- ShadCN UI

---

# 14. Deployment

Deploy on:

## Vercel

Use free plan.

Steps:

1. Push code to GitHub
2. Import project into Vercel
3. Add environment variables
4. Deploy

---

# 15. Environment Variables

Create:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

# 16. Packages to Install

Install:

```bash
npm install yahoo-finance2
npm install @supabase/supabase-js
npm install recharts
npm install react-icons
npm install framer-motion
npm install technicalindicators
```

---

# 17. Technical Indicator Logic

Use `technicalindicators` package.

Implement:

- RSI
- EMA
- MACD
- SMA

Generate swing scores using these indicators.

---

# 18. Simple Swing Trade Conditions

Example logic:

## Bullish Setup

Conditions:

- Price above EMA20
- EMA20 above EMA50
- RSI between 50–65
- Volume breakout
- Positive quarterly growth

Then:

- Mark as swing candidate

---

# 19. Performance Requirements

Optimize for:

- Fast loading
- Minimal API calls
- Cached stock scans
- Mobile responsiveness

---

# 20. Optional Future Features

Keep architecture ready for future additions:

- AI predictions
- Telegram alerts
- Backtesting
- Portfolio tracking
- News sentiment
- ML scoring

Do NOT implement these now.

---

# 21. Development Order

Generate code in this order:

1. Project initialization
2. Tailwind setup
3. Dashboard UI
4. Yahoo Finance integration
5. Technical indicators
6. Swing scoring logic
7. Stock details page
8. TradingView integration
9. Watchlist
10. Supabase integration
11. Deployment setup

---

# 22. Final Requirements

The application should be:

- Simple
- Fast
- Modern
- Mobile responsive
- Easy to deploy
- Easy to maintain

Code should be:

- Clean
- Modular
- Typed
- Production-quality

Start by generating:

1. Folder structure
2. Project initialization
3. Dashboard UI
4. Stock data services
5. Technical analysis utilities
6. Swing trade scoring engine
7. Stock details page
8. TradingView integration
9. Deployment setup