const ticker = process.env.TICKER_SYMBOL;

if (!ticker) {
    console.error('TICKER_SYMBOL environment variable is not set.');
    process.exit(1);
}

console.log(`Ticker symbol received: ${ticker}`);
setContext('ticker', ticker);