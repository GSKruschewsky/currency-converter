import { ExchangeRateResult } from "../../types";
import fetch from "node-fetch";

/**
 * Fetches the exchange rate between base and quote from Binance's API.
 */
export async function getBinanceRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${base.toUpperCase()}${quote.toUpperCase()}`);
    const body = await http_r.text();

    let r: any = body;
    try {
      r = JSON.parse(body);
    } catch (error) {
      // Do nothing here.
    }

    if (http_r.status !== 200) {
      if (r.code) throw `API ERROR (${r.code}): ${r.msg}`
      throw `HTTP ERROR (${http_r.status}): ${body}`;
    }

    if (typeof r !== 'object')
      throw `API ERROR (NOT JSON RESPONSE): ${r}`;

    if (!r.lastPrice)
      throw `API ERROR (UNEXPECTED RESPONSE):\n${JSON.stringify(r)}`;

    const finalRate = parseFloat(r.lastPrice);
    if (isNaN(finalRate))
      throw `API ERROR ('lastPrice' is not a valid number):\n${JSON.stringify(r)}`;

    return { source: 'Binance', success: true, rate: finalRate };

  } catch (error: any) {
    return { source: 'Binance', success: false, error };
  }
}