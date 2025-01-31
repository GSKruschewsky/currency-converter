const { getCurrencyRate } = require("../src");

async function main() {
    const base = "USD";
    const quote = "BRL";

    try {
        const result = await getCurrencyRate(base, quote);
        console.log(`1 ${base} = ${result.rate} ${quote}`);
    } catch (error) {
        console.error("Erro ao obter a taxa de câmbio:", error);
    }
}

main();