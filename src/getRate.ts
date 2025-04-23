import { getCurrencyRate } from "./currencies";
import { getCryptoCurrencyRate } from "./cryptocurrencies";
import { ExchangeRateResult } from "./types";

/**
 * Fetches the exchange rate between two currencies (fiat or crypto).
 */
export async function getRate(base: string, quote: string): Promise<ExchangeRateResult> {
  // Try to get a crypto exchange rate and fiat exchange rates at the same time.
  const [ fiatResult, cryptoResult ] = await Promise.all([ 
    getCurrencyRate(base, quote),
    getCryptoCurrencyRate(base, quote)
  ]);

  // If crypto exchange rate was sucessfully resolved, returns it.
  if (cryptoResult.success) return cryptoResult;

  // If no crypto rate is found, try fiat exchange rates
  if (fiatResult.success) return fiatResult;

  // If both fail, return a general error
  return { source: 'All fiats and cryptos', success: false, error: `Exchange rate for ${base}/${quote} not found.`, results: [ ...fiatResult.results, ...cryptoResult.results ] };
}