const ticker = getContext('ticker');
const apiKey = process.env.POLYGON_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('POLYGON_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

// Use the correct Polygon.io endpoint for financials with 'apiKey' parameter
const url = `https://api.polygon.io/v3/reference/financials?ticker=${ticker}&apiKey=${apiKey}`;

console.log(`Fetching financial statements for ${ticker}`);

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
        setContext('financialStatements', data);
        console.log('Fetched financial statements.');
    } catch (e) {
        console.error('Failed to fetch financial statements:', e);
        process.exit(1);
    }
})();