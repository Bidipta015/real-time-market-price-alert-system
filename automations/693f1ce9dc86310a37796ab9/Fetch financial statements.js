const ticker = getContext('ticker');
const apiKey = process.env.POLYGON_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('POLYGON_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

const endpoints = [
    {
        name: 'balanceSheets',
        url: `https://api.polygon.io/v3/reference/balance_sheets?ticker=${ticker}&apiKey=${apiKey}`
    },
    {
        name: 'incomeStatements',
        url: `https://api.polygon.io/v3/reference/income_statements?ticker=${ticker}&apiKey=${apiKey}`
    },
    {
        name: 'cashFlowStatements',
        url: `https://api.polygon.io/v3/reference/cash_flow_statements?ticker=${ticker}&apiKey=${apiKey}`
    }
];

console.log(`Fetching financial statements for ${ticker} from Polygon.io v3 endpoints...`);

(async () => {
    try {
        const results = {};
        for (const endpoint of endpoints) {
            console.log(`Fetching ${endpoint.name}...`);
            const response = await fetch(endpoint.url);
            let errorBody = '';
            if (!response.ok) {
                try { errorBody = await response.text(); } catch {}
                if (response.status === 403) {
                    console.error(`Polygon.io API error: 403 Forbidden on ${endpoint.name}. Check your API key permissions. Response: ${errorBody}`);
                } else {
                    console.error(`Polygon.io API error: ${response.status} ${response.statusText} on ${endpoint.name}. Response: ${errorBody}`);
                }
                process.exit(1);
            }
            results[endpoint.name] = await response.json();
            console.log(`Fetched ${endpoint.name}.`);
        }
        setContext('financialStatements', results);
        console.log('Fetched and aggregated all financial statements.');
    } catch (e) {
        console.error('Failed to fetch financial statements:', e);
        process.exit(1);
    }
})();