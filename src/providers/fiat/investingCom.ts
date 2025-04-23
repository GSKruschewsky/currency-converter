import { ExchangeRateResult } from "../../types";
import fetch from "node-fetch";

/**
 * Fetches the exchange rate between two currencies by web scraping "Investing.com".
 */
export async function getInvestingComRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://br.investing.com/currencies/${base.toLowerCase()}-${quote.toLowerCase()}`, {
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
  
    idx = r.indexOf('<script id="__NEXT_DATA__" type="application/json">');
    if (idx !== -1) {
      r = r.substring(idx + 51);
      idx = r.indexOf('</script>');
      if (idx !== -1) {
        r = r.substring(0, idx);
        try {
          const obj = JSON.parse(r);
          
          const value = obj?.props.pageProps.state.currencyStore.instrument.price.last;
          if (value) values.push(value);
  
          const value2Obj = obj?.props.pageProps.state.currencyStore.instrument.relatives.relatives[0];
          if (value2Obj?.symbol === `${base.toUpperCase()}/${quote.toUpperCase()}` || value2Obj?.link === `/currencies/${base.toLowerCase()}-${quote.toLowerCase()}`) {
            const value2 = value2Obj?.last;
            if (value2) values.push(value2);
          }
          
        } catch (error) {
          // Do nothing here.
        }
      }
    }
  
    if (values.length)
      return { source: 'Investing.com', success: true, rate: values[0] };
  
    throw "Could not scrape the rate.";

  } catch (error: any) {
    return { source: 'Investing.com', success: false, error };
  }

}