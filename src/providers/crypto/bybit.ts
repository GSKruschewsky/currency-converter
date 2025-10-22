import { ExchangeRateResult } from "../../types";
import fetch from "node-fetch";

/**
 * Fetches the exchange rate between base and quote from Bybit's API.
 */
export async function getBybitRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${base.toUpperCase()}${quote.toUpperCase()}`);
    const body = await http_r.text();
    if (http_r.status !== 200) throw `HTTP ERROR (${http_r.status}): ${body}`;

    let r: any = body;
    try {
      r = JSON.parse(body);
    } catch (error) {
      throw `API ERROR (NOT JSON RESPONSE): ${r}`;
    }
    
    if (r.retCode !== 0) throw `API ERROR (${r.retCode}): ${r.retMsg}`;

    const price = r?.result.list[0].lastPrice;
    if (!price) throw `API ERROR (UNEXPECTED RESPONSE):\n${JSON.stringify(r)}`;

    const finalRate = parseFloat(price);
    if (isNaN(finalRate))
      throw `API ERROR ('lastPrice' is not a valid number):\n${JSON.stringify(r)}`;

    return { source: 'Bybit', success: true, rate: finalRate };
    
  } catch (error: any) {
    return { source: 'Bybit', success: false, error };
  }
}