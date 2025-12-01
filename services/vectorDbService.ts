import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface VectorDB extends DBSchema {
    vectors: {
        key: string;
        value: {
            id: string;
            fileName: string;
            chunk: string;
            embedding: number[];
        };
        indexes: { 'by-file': string };
    };
}

const DB_NAME = 'ict-study-copilot-db';
const STORE_NAME = 'vectors';

let dbPromise: Promise<IDBPDatabase<VectorDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<VectorDB>(DB_NAME, 1, {
            upgrade(db) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('by-file', 'fileName');
            },
        });
    }
    return dbPromise;
};

export const storeDocument = async (doc: { id: string; fileName: string; chunk: string; embedding: number[] }) => {
    const db = await initDB();
    await db.put(STORE_NAME, doc);
};

export const deleteDocument = async (fileName: string) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const index = tx.store.index('by-file');
    let cursor = await index.openCursor(IDBKeyRange.only(fileName));

    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    await tx.done;
};

export const getAllDocuments = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
};

// Cosine similarity function
const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magA * magB);
};

export const searchSimilarVectors = async (queryEmbedding: number[], topK: number = 6) => {
    const db = await initDB();
    const allDocs = await db.getAll(STORE_NAME);

    const scoredDocs = allDocs.map(doc => ({
        ...doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // Sort by score descending and take topK
    return scoredDocs.sort((a, b) => b.score - a.score).slice(0, topK);
};
