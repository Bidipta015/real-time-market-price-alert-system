const ticker = getContext('ticker');
const apiKey = process.env.POLYGON_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('POLYGON_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

const now = new Date();
const endDate = now.toISOString().slice(0, 10);
const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apikey=${apiKey}`;

console.log(`Fetching daily market data for ${ticker} from ${startDate} to ${endDate}`);

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
        setContext('dailyMarketData', data);
        console.log('Fetched daily market data.');
    } catch (e) {
        console.error('Failed to fetch daily market data:', e);
        process.exit(1);
    }
})();