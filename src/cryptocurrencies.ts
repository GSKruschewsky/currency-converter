
import { FetchRateFunction, ExchangeRateResult } from "./types";

import { getBinanceRate } from "./providers/crypto/binance";
import { getBybitRate } from "./providers/crypto/bybit";
import { getCoinbaseRate } from "./providers/crypto/coinbase";
import { getKrakenRate } from "./providers/crypto/kraken";

/**
 * List of crypto exchange rate sources, prioritized.
 */
const cryptoSources: FetchRateFunction[] = [
  getBinanceRate,
  getBybitRate,
  getCoinbaseRate,
  getKrakenRate
];

/**
 * Attempts to fetch the exchange rate of a crypto-currency from multiple sources. (cryptoSources)
 */
export async function getCryptoCurrencyRate(base: string, quote: string): Promise<ExchangeRateResult> {
  // Fetch all sources rates in parallel
  const results = await Promise.all(cryptoSources.map(sourceFn => sourceFn(base, quote)));

  // Prioritize the first successful result in order
  for (const result of results) {

    // Return the first valid result
    if (result.success && result.rate)
      return result; 

    // console.warn(`Failed to get rate from ${result.source}:`, result.error);
  }

  // If all sources fail, return an error
  return {
    source: 'All cryptos',
    success: false,
    error: `Unable to retrieve exchange rate for ${base.toUpperCase()}/${quote.toUpperCase()} from any source.`
  };
}