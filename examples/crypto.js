const { getCryptoCurrencyRate } = require("../src");

async function main() {
    const base = "BTC";
    const quote = "USDT";

    try {
        const result = await getCryptoCurrencyRate(base, quote);
        console.log(`1 ${base} = ${result.rate} ${quote}`);
    } catch (error) {
        console.error("Erro ao obter a taxa de câmbio:", error);
    }
}

main();