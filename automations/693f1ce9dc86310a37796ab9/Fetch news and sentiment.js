const ticker = getContext('ticker');
const apiKey = process.env.NEWSAPI_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('NEWSAPI_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

const now = new Date();
const fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const url = `https://newsapi.org/v2/everything?q=${ticker}%20AND%20(earnings%20OR%20financial%20OR%20investment)&from=${fromDate}&apiKey=${apiKey}`;

console.log(`Fetching news and sentiment for ${ticker} from ${fromDate}`);

(async () => {
    try {
        const response = await fetch(url);
        let errorBody = '';
        if (!response.ok) {
            try { errorBody = await response.text(); } catch {}
            if (response.status === 403) {
                console.error(`NewsAPI error: 403 Forbidden. Check your API key permissions. Response: ${errorBody}`);
            } else {
                console.error(`NewsAPI error: ${response.status} ${response.statusText}. Response: ${errorBody}`);
            }
            process.exit(1);
        }
        const data = await response.json();
        setContext('newsSentiment', data);
        console.log('Fetched news and sentiment.');
    } catch (e) {
        console.error('Failed to fetch news and sentiment:', e);
        process.exit(1);
    }
})();