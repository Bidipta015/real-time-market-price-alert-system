const ticker = getContext('ticker');
const apiKey = process.env.POLYGON_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('POLYGON_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

const endpoints = {
    balanceSheet: `https://api.polygon.io/v1/reference/financials/balance_sheets?ticker=${ticker}&limit=1&apikey=${apiKey}`,
    incomeStatement: `https://api.polygon.io/v1/reference/financials/income_statements?ticker=${ticker}&limit=1&apikey=${apiKey}`,
    cashFlow: `https://api.polygon.io/v1/reference/financials/cash_flow_statements?ticker=${ticker}&limit=1&apikey=${apiKey}`
};

console.log(`Fetching financial statements for ${ticker}`);

(async () => {
    try {
        const [bsRes, isRes, cfRes] = await Promise.all([
            fetch(endpoints.balanceSheet),
            fetch(endpoints.incomeStatement),
            fetch(endpoints.cashFlow)
        ]);
        let errorBody = '';
        if (!bsRes.ok) {
            try { errorBody = await bsRes.text(); } catch {}
            console.error(`Polygon.io API error (Balance Sheet): ${bsRes.status} ${bsRes.statusText}. Response: ${errorBody}`);
            process.exit(1);
        }
        if (!isRes.ok) {
            try { errorBody = await isRes.text(); } catch {}
            console.error(`Polygon.io API error (Income Statement): ${isRes.status} ${isRes.statusText}. Response: ${errorBody}`);
            process.exit(1);
        }
        if (!cfRes.ok) {
            try { errorBody = await cfRes.text(); } catch {}
            console.error(`Polygon.io API error (Cash Flow Statement): ${cfRes.status} ${cfRes.statusText}. Response: ${errorBody}`);
            process.exit(1);
        }
        const [bsData, isData, cfData] = await Promise.all([
            bsRes.json(),
            isRes.json(),
            cfRes.json()
        ]);
        const financialStatements = {
            balanceSheet: bsData,
            incomeStatement: isData,
            cashFlow: cfData
        };
        setContext('financialStatements', financialStatements);
        console.log('Fetched and aggregated financial statements.');
    } catch (e) {
        console.error('Failed to fetch financial statements:', e);
        process.exit(1);
    }
})();