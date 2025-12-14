const ticker = getContext('ticker');
const apiKey = process.env.POLYGON_API_KEY;

if (!apiKey || apiKey.trim() === "") {
    console.error('POLYGON_API_KEY environment variable is not set or empty.');
    process.exit(1);
}

// Use the correct financials endpoint (v2)
const endpoint = `https://api.polygon.io/v2/reference/financials?ticker=${ticker}&limit=3&apikey=${apiKey}`;

console.log(`Fetching financial statements for ${ticker} using v2 endpoint`);

(async () => {
    try {
        const res = await fetch(endpoint);
        let errorBody = '';
        if (!res.ok) {
            try { errorBody = await res.text(); } catch {}
            console.error(`Polygon.io API error (Financials): ${res.status} ${res.statusText}. Response: ${errorBody}`);
            process.exit(1);
        }
        const data = await res.json();
        if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
            console.error('No financial statements found for this ticker.');
            process.exit(1);
        }
        // Aggregate the latest available statements
        const statements = {
            balanceSheet: null,
            incomeStatement: null,
            cashFlow: null
        };
        for (const filing of data.results) {
            if (filing.financials) {
                if (filing.financials.balance_sheet && !statements.balanceSheet) {
                    statements.balanceSheet = filing.financials.balance_sheet;
                }
                if (filing.financials.income_statement && !statements.incomeStatement) {
                    statements.incomeStatement = filing.financials.income_statement;
                }
                if (filing.financials.cash_flow_statement && !statements.cashFlow) {
                    statements.cashFlow = filing.financials.cash_flow_statement;
                }
            }
        }
        setContext('financialStatements', statements);
        console.log('Fetched and aggregated financial statements.');
    } catch (e) {
        console.error('Failed to fetch financial statements:', e);
        process.exit(1);
    }
})();