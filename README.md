# Currency Converter

A simple and flexible currency converter library that allows you to get the exchange rates between fiat and cryptocurrency from multiple sources. It provides a unified interface to get rates from different financial and cryptocurrency exchanges, with support for multiple data sources.

**Note:** This project (more precisely the `getCurrencyRate()` function) uses web scraping to fetch fiat exchange rates, so it may stop working unexpectedly if the structure of the target websites changes.

## Features

- **Get exchange rates for fiat currencies** using sources like:
  - Google Finance
  - Investing.com
  - Wise.com
- **Get exchange rates for cryptocurrencies** using sources like:
  - Binance
  - Bybit
  - Coinbase
  - Kraken
- Easy-to-use interface to get rates for both fiat and cryptocurrency using a single function.
- Easily extendable with additional sources.

## Installation

To install the package, run:

```bash
npm install currency-converter
```

Alternatively, you can clone this repository and install dependencies manually:

```bash
git clone https://github.com/your-username/currency-converter.git
cd currency-converter
npm install
```

## Usage

### 1. **Getting Fiat Currency Rates**

You can use the `getCurrencyRate` function to fetch the exchange rate between two fiat currencies.

Example:

```js
const { getCurrencyRate } = require("currency-converter");

async function main() {
  try {
    const result = await getCurrencyRate("USD", "BRL");
    if (result.success) {
      console.log(`Exchange rate (USD to BRL): ${result.rate}`);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

### 2. **Getting Cryptocurrency Rates**

You can use the `getCryptoCurrencyRate` function to fetch the exchange rate of cryptocurrencies.

Example:

```js
const { getCryptoCurrencyRate } = require("currency-converter");

async function main() {
  try {
    const result = await getCryptoCurrencyRate("BTC", "USDT");
    if (result.success) {
      console.log(`Exchange rate (BTC to USDT): ${result.rate} (Source: ${result.source})`);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

### 3. **Getting Both Fiat and Crypto Rates**

The `getRate` function will attempt to get the rate for cryptocurrencies first and then try fiat currency sources if no crypto rate is found.
(So the same function can return the exchange rate between two fiat currencies or the exchange rate of cryptocurrencies)

Example:

```js
const { getRate } = require("currency-converter");

async function main() {
  const result1 = await getRate("BTC", "USDT");
  if (result1.success) {
    console.log(`Exchange rate (BTC to USDT): ${result1.rate} (Source: ${result1.source})`);
  } else {
    console.error("Could not get the exchange rate:", result1.error);
  }
  
  const result2 = await getRate("EUR", "USD");
  if (result2.success) {
    console.log(`Exchange rate (EUR to USD): ${result2.rate} (Source: ${result2.source})`);
  } else {
    console.error("Could not get the exchange rate:", result2.error);
  }
}

main();
```

## Available Functions

- `getCurrencyRate(base, quote)`:
  - **base**: The base currency (e.g., "USD", "EUR").
  - **quote**: The quote currency (e.g., "BRL", "GBP").
  - **Returns**: A promise with an object containing the exchange rate or an error message.

- `getCryptoCurrencyRate(base, quote)`:
  - **base**: The base currency or cryptocurrency (e.g., "USD", "BTC").
  - **quote**: The quote currency or cryptocurrency (e.g., "BRL", "USDT").
  - **Returns**: A promise with an object containing the exchange rate or an error message.

- `getRate(base, quote)`:
  - **base**: The base currency or cryptocurrency (e.g., "USD", "BTC").
  - **quote**: The quote currency or cryptocurrency (e.g., "BRL", "USDT").
  - **Returns**: A promise with an object containing the exchange rate or an error message.

### Response format:
```js
{
  source: 'Google Finance'  // The source used to retrieve the exchange rate. (e.g., 'Google Finance', 'Binance', etc.)
  success: true,            // Whether the request was successful
  rate: 1.20,               // The exchange rate (if successful)
  error: undefined          // An error message (if unsuccessful)
}
```

## Extending the Project

You can easily extend the project to add new exchange sources for fiat or cryptocurrency rates. Simply:

1. Create a new function to fetch rates from the new source.
2. Add that function to the respective sources array in `src/cryptocurrencies.js` or `src/currencies.js`.
3. Optionally, create a provider for the new source in `src/providers/crypto/` or `src/providers/fiat/` to keep everything modular and organized.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any bug fixes or feature additions.

- Clone the repository:
  ```bash
  git clone https://github.com/GSKruschewsky/currency-converter.git
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Make your changes and commit them.
- Create a pull request with a description of your changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- This project leverages data from several financial and cryptocurrency APIs.
- Thanks to the open-source community for providing the foundational work for this project.
