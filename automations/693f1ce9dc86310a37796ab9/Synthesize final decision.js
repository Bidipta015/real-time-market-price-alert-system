const committeeRecommendation = getContext('committeeRecommendation');

// For now, just pass through the committee recommendation as the final decision
const finalDecision = `FINAL DECISION:\n\n${committeeRecommendation}`;

setContext('finalDecision', finalDecision);
console.log('Synthesized final decision.');