
import { FetchRateFunction, ExchangeRateResult } from "./types";

import { getGoogleFinanceRate } from "./providers/fiat/googleFinance";
import { getInvestingComRate } from "./providers/fiat/investingCom";
import { getWiseRate } from "./providers/fiat/wise";

/**
 * List of fiat exchange rate sources, prioritized.
 */
const fiatSources: FetchRateFunction[] = [
  getGoogleFinanceRate,
  getInvestingComRate,
  getWiseRate
];

/**
 * Attempts to fetch the exchange rate between two currencies from multiple sources. (fiatSources)
 */
export async function getCurrencyRate(base: string, quote: string): Promise<ExchangeRateResult> {
  // Fetch all sources rates in parallel
  const results = await Promise.all(fiatSources.map((sourceFn) => sourceFn(base, quote)));

  // Prioritize the first successful result in order
  for (const result of results) {
    
    // Return the first valid result
    if (result.success && result.rate !== undefined) {
      return result;

      // console.warn(`Failed to get rate from ${result.source}:`, result.error);
    }
  }

  return { source: 'All fiats', success: false, error: `Exchange rate for ${base}/${quote} not found.` };
}