import { extractTextFromPDF, chunkText } from './pdfService';
import { getEmbeddings, generateContent } from './geminiService';
import { storeDocument, searchSimilarVectors } from './vectorDbService';
import { refineWithOpenAI } from './openaiService';
import { v4 as uuidv4 } from 'uuid';

// Orchestrates the RAG process: extract, chunk, embed, and store PDF content
export const processAndStorePDF = async (file: File, onProgress: (status: string) => void) => {
    onProgress('Extracting text from PDF...');
    const text = await extractTextFromPDF(file);

    onProgress('Chunking text...');
    const chunks = chunkText(text);

    onProgress('Generating embeddings...');
    for (const chunk of chunks) {
        const embedding = await getEmbeddings(chunk);
        await storeDocument({
            id: uuidv4(),
            fileName: file.name,
            chunk,
            embedding
        });
    }

    onProgress('Done!');
};

// Queries the knowledge base and returns relevant text chunks
export const queryKnowledgeBase = async (question: string, topK: number = 6) => {
    const queryEmbedding = await getEmbeddings(question);
    const results = await searchSimilarVectors(queryEmbedding, topK);

    if (!results || results.length === 0) {
        return null;
    }

    // Concatenate the most relevant text chunks
    return results.map(r => r.chunk).join('\n\n');
};

// Generates a grounded answer using RAG, then refines it with OpenAI
// Now includes language parameter (english, tamil, or sinhala)
export const generateGroundedAnswer = async (
    question: string,
    language: string = 'english'
) => {
    const context = await queryKnowledgeBase(question);

    let baseAnswer = '';

    if (context) {
        const prompt = `
    You are an expert A-Level ICT tutor. Answer the following question based ONLY on the provided context.
    
    Context:
    ${context}
    
    Question: "${question}"
    
    If the answer is not in the context, state "Not found in the provided notes" but try to be helpful if possible while clarifying the source.
  `;
        // Step 1: Get base answer from Gemini
        baseAnswer = await generateContent(prompt);
    } else {
        // If no context, skip Gemini and let OpenAI handle the conversational fallback directly
        baseAnswer = question;
    }

    // Step 2: Refine with OpenAI (with language translation and smart fallback)
    const refinedAnswer = await refineWithOpenAI(baseAnswer, context || '', language, !!context);

    return refinedAnswer;
};
