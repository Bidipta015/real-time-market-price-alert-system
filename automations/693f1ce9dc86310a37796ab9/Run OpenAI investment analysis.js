const formattedAnalysis = getContext('formattedAnalysis');

const prompt = `You are an expert investment analyst. Analyze the following market, company, financial, and news data for the given ticker. Provide a summary including:
- Business quality
- Management effectiveness
- Intrinsic value vs current price
- Growth prospects
- Risks and opportunities

Data:\n${formattedAnalysis}`;

(async () => {
    try {
        const result = await TurboticOpenAI([
            { role: 'user', content: prompt }
        ], {
            model: 'gpt-4',
            temperature: 0.3,
            max_tokens: 800
        });
        setContext('aiAnalysis', result.content);
        console.log('AI investment analysis complete.');
    } catch (e) {
        console.error('Failed to run OpenAI investment analysis:', e);
        process.exit(1);
    }
})();