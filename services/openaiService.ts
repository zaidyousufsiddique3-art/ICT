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

export const refineWithOpenAI = async (
    baseAnswer: string,
    context: string,
    language: string = 'english',
    hasContext: boolean = true
): Promise<string> => {
    try {
        const openai = getOpenAIClient();
        if (!openai) return baseAnswer;

        // Language-specific instructions
        const languageInstructions: Record<string, string> = {
            english: 'Respond in English.',
            tamil: 'Respond in Tamil language (தமிழ்). Translate everything to Tamil.',
            sinhala: 'Respond in Sinhala language (සිංහල). Translate everything to Sinhala.'
        };

        // Smart fallback: if no context, treat as conversational question
        let prompt = '';
        let systemPrompt = '';

        if (hasContext && context && context.trim()) {
            // Normal RAG-based refinement
            systemPrompt = `You are a helpful expert tutor for A-Level ICT who provides beautifully formatted, clear responses in ${language}.`;
            prompt = `
You are an expert A-Level ICT tutor.
Refine, clarify, and expand the AI-generated answer below.
You MUST stay accurate to the provided context from ICT notes.
If information is not in the context, avoid inventing facts.

CRITICAL INSTRUCTION:
${languageInstructions[language] || languageInstructions.english}
You MUST output the final response in ${language} ONLY.

IMPORTANT FORMATTING REQUIREMENTS:
- Use clear section headings with proper spacing
- Use bullet points for lists
- Add line breaks between sections
- Use proper paragraph spacing
- Make the output visually clean and easy to read
- For flashcards: format as numbered cards with clear Q&A structure
- For exam questions: number questions clearly with mark allocations
- For case studies: use clear subheadings for each part

Context:
${context}

Base Answer:
${baseAnswer}

Your task:
- Improve structure and add clear headings
- Make the explanation clearer
- Add examples if appropriate
- Improve formatting with spacing and bullets
- Ensure it matches A-Level ICT exam style
- ${languageInstructions[language] || languageInstructions.english}
`;
        } else {
            // Fallback: conversational, helpful response
            systemPrompt = `You are a friendly, helpful AI study assistant. You MUST respond ONLY in ${language}. Never respond in English unless the selected language is English.`;
            prompt = `
The user sent you this message: "${baseAnswer}"

This is a casual conversation or greeting, not related to the study materials database.

CRITICAL INSTRUCTIONS:
1. ${languageInstructions[language] || languageInstructions.english}
2. You MUST respond ONLY in ${language}. This is MANDATORY.
3. Respond naturally and conversationally as a friendly AI assistant.
4. Be warm, helpful, and encouraging.
5. DO NOT mention "database", "context", "notes", or "study materials".
6. Just have a natural conversation.

Examples:
- If user says "hi" or "hello" → Respond with a friendly greeting in ${language}
- If user says "how are you?" → Respond naturally in ${language}
- If user asks a general question → Answer helpfully in ${language}

Now respond to the user's message in ${language}:
`;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        return response.choices[0]?.message?.content || baseAnswer;
    } catch (error) {
        console.error("OpenAI Refinement Error:", error);
        // Better fallback: return a generic message instead of echoing input
        const fallbackMessages: Record<string, string> = {
            english: "I'm here to help! Please ask me about A-Level ICT topics.",
            tamil: "நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன்! A-Level ICT தலைப்புகளைப் பற்றி என்னிடம் கேளுங்கள்.",
            sinhala: "මම ඔබට උදව් කිරීමට මෙහි සිටිමි! A-Level ICT මාතෘකා ගැන මගෙන් විමසන්න."
        };
        return fallbackMessages[language] || fallbackMessages.english;
    }
};
