import { ExchangeRateResult } from "../../types";
import fetch from "node-fetch";

/**
 * Fetches the exchange rate between base and quote from Kraken's API.
 */
export async function getKrakenRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${base.toUpperCase()}${quote.toUpperCase()}`, {
      headers: { 'Accept': 'application/json' }
    });
    const body = await http_r.text();
    if (http_r.status !== 200) throw `HTTP ERROR (${http_r.status}): ${body}`;

    let r: any = body;
    try {
      r = JSON.parse(body);
    } catch (error) {
      throw `API ERROR (NOT JSON RESPONSE): ${r}`;
    }
    
    if (r.error && r.error.length > 0) 
      throw `API ERROR${r.error.length > 1 ? 'S' : ''}: ${r.error.join(', ')}`;

    try {
      const price = r.result[Object.keys(r.result)[0]].c[0];
      if (!price) throw 'not expected response format';

      return { source: 'Kraken', success: true, rate: price * 1 }

    } catch (error) {
      throw `API ERROR (UNEXPECTED RESPONSE):\n${JSON.stringify(r)}`;
    }

  } catch (error: any) {
    return { source: 'Kraken', success: false, error };
  }
}