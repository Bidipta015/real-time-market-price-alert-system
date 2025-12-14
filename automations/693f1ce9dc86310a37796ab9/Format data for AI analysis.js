const aggregatedData = getContext('aggregatedData');
const ticker = getContext('ticker');

let analysisText = `INVESTMENT ANALYSIS FOR ${ticker}\n\n`;
analysisText += `RAW API DATA:\n`;

Object.entries(aggregatedData).forEach(([key, value], idx) => {
    analysisText += `\nData Source ${idx + 1} (${key}):\n`;
    analysisText += JSON.stringify(value, null, 2);
    analysisText += `\n${'='.repeat(50)}\n`;
});

setContext('formattedAnalysis', analysisText);
console.log('Formatted data for AI analysis.');