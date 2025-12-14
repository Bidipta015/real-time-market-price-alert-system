const ticker = getContext('ticker');
const apiKey = process.env.POLYGON_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('POLYGON_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

const url = `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&apikey=${apiKey}`;

console.log(`Fetching company fundamentals for ${ticker}`);

(async () => {
    try {
        const response = await fetch(url);
        let errorBody = '';
        if (!response.ok) {
            try { errorBody = await response.text(); } catch {}
            if (response.status === 403) {
                console.error(`Polygon.io API error: 403 Forbidden. Check your API key permissions. Response: ${errorBody}`);
            } else {
                console.error(`Polygon.io API error: ${response.status} ${response.statusText}. Response: ${errorBody}`);
            }
            process.exit(1);
        }
        const data = await response.json();
        setContext('companyFundamentals', data);
        console.log('Fetched company fundamentals.');
    } catch (e) {
        console.error('Failed to fetch company fundamentals:', e);
        process.exit(1);
    }
})();