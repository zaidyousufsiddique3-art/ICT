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

    // Concatenate the most relevant text chunks
    return results.map(r => r.chunk).join('\n\n');
};

// Generates a grounded answer using RAG, then refines it with OpenAI
export const generateGroundedAnswer = async (question: string, level: string = 'AS Level') => {
    const context = await queryKnowledgeBase(question);

    const prompt = `
    You are an expert A-Level ICT tutor. Answer the following question based ONLY on the provided context.
    
    Context:
    ${context || "No relevant notes found."}
    
    Question: "${question}"
    Level: ${level}
    
    If the answer is not in the context, state "Not found in the provided notes" but try to be helpful if possible while clarifying the source.
  `;

    // Step 1: Get base answer from Gemini
    const baseAnswer = await generateContent(prompt);

    // Step 2: Refine with OpenAI (fallback to base answer if it fails)
    const refinedAnswer = await refineWithOpenAI(baseAnswer, context);

    return refinedAnswer;
};
