import { ExchangeRateResult } from "../../types";

/**
 * Fetches the exchange rate between base and quote from Coinbase's API.
 */
export async function getCoinbaseRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://api.coinbase.com/api/v3/brokerage/market/products/${base.toUpperCase()}-${quote.toUpperCase()}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const body = await http_r.text();

    let r: any = body;
    try {
      r = JSON.parse(body);
    } catch (error) {
      // Do nothing here.
    }

    if (http_r.status !== 200) {
      if (r.error) throw `API ERROR (${r.error}): ${r.message} (${r.error_details})`
      throw `HTTP ERROR (${http_r.status}): ${body}`;
    }

    if (typeof r !== 'object')
      throw `API ERROR (NOT JSON RESPONSE): ${r}`;

    if (!r.price)
      throw `API ERROR (UNEXPECTED RESPONSE):\n${JSON.stringify(r)}`;

    return { source: 'Coinbase', success: true, rate: r.price * 1 }
    
  } catch (error: any) {
    return { source: 'Coinbase', success: false, error };
  }
}