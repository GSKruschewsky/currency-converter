
/** Provider response to an exchnage rate request. */
export interface ExchangeRateResult {
  success: boolean;
  source: string;
  rate?: number;
  error?: any;
  results?: any;
}

/** Function that fetches the exchange rate from a provider. */
export type FetchRateFunction = (base: string, quote: string) => Promise<ExchangeRateResult>;