const dailyMarketData = getContext('dailyMarketData');
const companyFundamentals = getContext('companyFundamentals');
const financialStatements = getContext('financialStatements');
const newsSentiment = getContext('newsSentiment');

const aggregatedData = {
    dailyMarketData,
    companyFundamentals,
    financialStatements,
    newsSentiment
};

setContext('aggregatedData', aggregatedData);
console.log('Aggregated all data for analysis.');