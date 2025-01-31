import { ExchangeRateResult } from "../../types";

/**
 * Fetches the exchange rate between two currencies by web scraping "Wise.com".
 */
export async function getWiseRate(base: string, quote: string): Promise<ExchangeRateResult> {
  try {
    const http_r = await fetch(`https://wise.com/br/currency-converter/${base.toLowerCase()}-to-${quote.toLowerCase()}-rate`, {
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

    idx = r.indexOf('estiver maior que');
    if (idx !== -1) {
      r = r.substring(idx + 18);
      idx = r.indexOf('<');
      if (idx !== -1) {
        const value:string = r.substring(0, idx - 1);
        values.push(parseFloat(value));
      }
    }

    idx = r.indexOf('<script id="__NEXT_DATA__" type="application/json">');
    if (idx !== -1) {
      r = r.substring(idx + 51);
      idx = r.indexOf('</script>');
      if (idx !== -1) {
        let obj: any = r.substring(0, idx);
        try {
          obj = JSON.parse(obj);
  
          const value2 = (obj?.props.pageProps.model.comparisonTable.quotes || [])
            .find((x: { name: string; alias: string; }) => x.name == 'Wise' || x.alias == 'wise')?.rate;
          if (value2)
            values.push(value2);
  
          const value3 = obj?.props.pageProps.model.rate.value;
          if (value3)
            values.push(value3);
  
        } catch (error) {
          // Do nothing here.
        }
      }
    }

    if (values.length)
      return { source: 'Wise', success: true, rate: (values.length === 3 ? values[2] : values[0]) };

    throw "Could not scrape the rate.";

  } catch (error: any) {
    return { source: 'Wise', success: false, error };
  }
}