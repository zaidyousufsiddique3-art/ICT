import OpenAI from 'openai';

const getOpenAIClient = () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        console.warn("OpenAI API key not found. Skipping refinement.");
        return null;
    }
    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
    });
};

export const refineWithOpenAI = async (baseAnswer: string, context: string): Promise<string> => {
    try {
        const openai = getOpenAIClient();
        if (!openai) return baseAnswer;

        const prompt = `
You are an expert A-Level ICT tutor.
Refine, clarify, and expand the AI-generated answer below.
You MUST stay accurate to the provided context from ICT notes.
If information is not in the context, avoid inventing facts.

Context:
${context}

Base Answer:
${baseAnswer}

Your task:
- improve structure
- make the explanation clearer
- add examples if appropriate
- improve formatting
- ensure it matches A-Level ICT exam style
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using gpt-4o-mini as the current standard mini model
            messages: [
                { role: "system", content: "You are a helpful expert tutor for A-Level ICT." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        return response.choices[0]?.message?.content || baseAnswer;
    } catch (error) {
        console.error("OpenAI Refinement Error:", error);
        return baseAnswer; // Fallback to original answer
    }
};
