const aiAnalysis = getContext('aiAnalysis');

// For now, use the AI analysis as the committee recommendation
const committeeRecommendation = `INVESTMENT COMMITTEE RECOMMENDATION:\n\n${aiAnalysis}`;

setContext('committeeRecommendation', committeeRecommendation);
console.log('Aggregated committee recommendation.');