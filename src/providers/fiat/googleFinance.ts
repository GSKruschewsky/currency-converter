import { ExchangeRateResult } from "../../types";
import fetch from "node-fetch";

/**
 * Fetches the exchange rate between two currencies by web scraping "Google Finance".
 */
export async function getGoogleFinanceRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://www.google.com/finance/quote/${base.toUpperCase()}-${quote.toUpperCase()}`, {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "pt-BR,pt;q=0.9,de-DE;q=0.8,de;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "max-age=0",
        "priority": "u=0, i"
      }
    });
    const body = await http_r.text();
    if (http_r.status !== 200) throw `HTTP ERROR (${http_r.status}): ${body}`;
    
    let r = body;
    let values = [];
    let idx = undefined;
  
    idx = r.indexOf('data-last-price="');
    if (idx !== -1) {
      r = r.substring(idx + 17);
      idx = r.indexOf('"');
      if (idx !== -1) {
        const value: string = r.substring(0, idx);
        if (value) values.push(Math.round(parseFloat(value) * 1e8) / 1e8); // Round to the 8th decimal
      }
    }
    
    if (values.length)
      return { source: 'Google Finance', success: true, rate: values[0] };
  
    throw "Failed to fetch rate from Google Finance.";
  
  } catch (error: any) {
    return { source: 'Google Finance', success: false, error };
  }
}