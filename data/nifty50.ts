export interface Nifty50Stock {
  rank: number;
  symbol: string;
  company: string;
  weight: number;
}

// Source: Smart-Investing NIFTY 50 Index Components by Weightage, May 16, 2026.
// Refresh this list when NSE rebalances or when index weights materially change.
export const NIFTY50_STOCKS: Nifty50Stock[] = [
  { rank: 1, symbol: "RELIANCE", company: "Reliance Industries", weight: 9.39 },
  { rank: 2, symbol: "HDFCBANK", company: "HDFC Bank", weight: 6.14 },
  { rank: 3, symbol: "BHARTIARTL", company: "Bharti Airtel", weight: 6.03 },
  { rank: 4, symbol: "ICICIBANK", company: "ICICI Bank", weight: 4.63 },
  { rank: 5, symbol: "SBIN", company: "State Bank of India", weight: 4.62 },
  { rank: 6, symbol: "TCS", company: "Tata Consultancy Services", weight: 4.25 },
  { rank: 7, symbol: "BAJFINANCE", company: "Bajaj Finance", weight: 2.94 },
  { rank: 8, symbol: "LT", company: "Larsen & Toubro", weight: 2.79 },
  { rank: 9, symbol: "HINDUNILVR", company: "Hindustan Unilever", weight: 2.77 },
  { rank: 10, symbol: "INFY", company: "Infosys", weight: 2.36 },
  { rank: 11, symbol: "SUNPHARMA", company: "Sun Pharmaceutical Industries", weight: 2.34 },
  { rank: 12, symbol: "MARUTI", company: "Maruti Suzuki India", weight: 2.16 },
  { rank: 13, symbol: "ADANIPORTS", company: "Adani Ports and SEZ", weight: 2.15 },
  { rank: 14, symbol: "M&M", company: "Mahindra & Mahindra", weight: 2.02 },
  { rank: 15, symbol: "ITC", company: "ITC", weight: 2.01 },
  { rank: 16, symbol: "AXISBANK", company: "Axis Bank", weight: 2.01 },
  { rank: 17, symbol: "KOTAKBANK", company: "Kotak Mahindra Bank", weight: 2.0 },
  { rank: 18, symbol: "NTPC", company: "NTPC", weight: 1.99 },
  { rank: 19, symbol: "ONGC", company: "Oil & Natural Gas Corporation", weight: 1.96 },
  { rank: 20, symbol: "TITAN", company: "Titan Company", weight: 1.92 },
  { rank: 21, symbol: "ADANIENT", company: "Adani Enterprises", weight: 1.84 },
  { rank: 22, symbol: "ULTRACEMCO", company: "UltraTech Cement", weight: 1.76 },
  { rank: 23, symbol: "JSWSTEEL", company: "JSW Steel", weight: 1.62 },
  { rank: 24, symbol: "BEL", company: "Bharat Electronics", weight: 1.61 },
  { rank: 25, symbol: "HCLTECH", company: "HCL Technologies", weight: 1.6 },
  { rank: 26, symbol: "BAJAJ-AUTO", company: "Bajaj Auto", weight: 1.51 },
  { rank: 27, symbol: "COALINDIA", company: "Coal India", weight: 1.48 },
  { rank: 28, symbol: "POWERGRID", company: "Power Grid Corporation of India", weight: 1.48 },
  { rank: 29, symbol: "BAJAJFINSV", company: "Bajaj Finserv", weight: 1.44 },
  { rank: 30, symbol: "NESTLEIND", company: "Nestle India", weight: 1.43 },
  { rank: 31, symbol: "TATASTEEL", company: "Tata Steel", weight: 1.41 },
  { rank: 32, symbol: "ASIANPAINT", company: "Asian Paints", weight: 1.3 },
  { rank: 33, symbol: "HINDALCO", company: "Hindalco Industries", weight: 1.25 },
  { rank: 34, symbol: "ETERNAL", company: "Eternal / Zomato", weight: 1.21 },
  { rank: 35, symbol: "SHRIRAMFIN", company: "Shriram Finance", weight: 1.15 },
  { rank: 36, symbol: "GRASIM", company: "Grasim Industries", weight: 1.04 },
  { rank: 37, symbol: "WIPRO", company: "Wipro", weight: 1.04 },
  { rank: 38, symbol: "EICHERMOT", company: "Eicher Motors", weight: 1.0 },
  { rank: 39, symbol: "SBILIFE", company: "SBI Life Insurance", weight: 0.97 },
  { rank: 40, symbol: "INDIGO", company: "InterGlobe Aviation", weight: 0.87 },
  { rank: 41, symbol: "JIOFIN", company: "Jio Financial Services", weight: 0.8 },
  { rank: 42, symbol: "TRENT", company: "Trent", weight: 0.76 },
  { rank: 43, symbol: "TECHM", company: "Tech Mahindra", weight: 0.7 },
  { rank: 44, symbol: "HDFCLIFE", company: "HDFC Life Insurance", weight: 0.68 },
  { rank: 45, symbol: "TATAMOTORS", company: "Tata Motors", weight: 0.68 },
  { rank: 46, symbol: "TATACONSUM", company: "Tata Consumer Products", weight: 0.63 },
  { rank: 47, symbol: "APOLLOHOSP", company: "Apollo Hospitals Enterprise", weight: 0.6 },
  { rank: 48, symbol: "CIPLA", company: "Cipla", weight: 0.6 },
  { rank: 49, symbol: "DRREDDY", company: "Dr. Reddy's Laboratories", weight: 0.58 },
  { rank: 50, symbol: "MAXHEALTH", company: "Max Healthcare Institute", weight: 0.53 }
];
