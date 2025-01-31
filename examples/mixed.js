const { getRate } = require("../dist");

async function main() {
  const base = "BTC";
  const quote = "EUR";

  try {
    const result = await getRate(base, quote);
    console.log(`1 ${base} = ${result.rate} ${quote}`);
  } catch (error) {
    console.error("Erro ao obter a taxa de câmbio de '" + base + "/" + quote + "':", error);
  }
  
  const base2 = "USD";
  const quote2 = "EUR";

  try {
    const result2 = await getRate(base2, quote2);
    console.log(`1 ${base2} = ${result2.rate} ${quote2}`);
  } catch (error) {
    console.error("Erro ao obter a taxa de câmbio de '" + base + "/" + quote + "':", error);
  }
}

main();