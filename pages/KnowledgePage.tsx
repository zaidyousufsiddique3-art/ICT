import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, ArrowLeft, Database, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { processAndStorePDF } from '../services/ragService';
import { getAllDocuments, deleteDocument } from '../services/vectorDbService';
import clsx from 'clsx';

interface StoredDoc {
    fileName: string;
    chunkCount: number;
}

export const KnowledgePage: React.FC = () => {
    const [documents, setDocuments] = useState<StoredDoc[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const loadDocuments = useCallback(async () => {
        try {
            const docs = await getAllDocuments();
            // Group by fileName to count chunks
            const fileMap = new Map<string, number>();
            docs.forEach(d => {
                fileMap.set(d.fileName, (fileMap.get(d.fileName) || 0) + 1);
            });

            const docList = Array.from(fileMap.entries()).map(([fileName, chunkCount]) => ({
                fileName,
                chunkCount
            }));
            setDocuments(docList);
        } catch (err) {
            console.error("Failed to load documents:", err);
        }
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError(null);
        setIsProcessing(true);

        for (const file of acceptedFiles) {
            if (file.size > 100 * 1024 * 1024) {
                setError(`File ${file.name} is too large (max 100MB)`);
                continue;
            }

            try {
                await processAndStorePDF(file, (status) => setProgress(status));
            } catch (err: any) {
                console.error(err);
                setError(`Failed to process ${file.name}: ${err.message || err}`);
            }
        }

        setIsProcessing(false);
        setProgress('');
        loadDocuments();
    }, [loadDocuments]);

    const handleDelete = async (fileName: string) => {
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            await deleteDocument(fileName);
            loadDocuments();
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        disabled: isProcessing
    });

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-purple">
                                Knowledge Base
                            </h1>
                            <p className="text-slate-400">Upload PDF notes to ground the AI's answers.</p>
                        </div>
                    </div>
                </div>

                {/* Upload Zone */}
                <div
                    {...getRootProps()}
                    className={clsx(
                        "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                        isDragActive ? "border-brand-cyan bg-brand-cyan/5" : "border-white/10 hover:border-brand-cyan/50 hover:bg-white/5",
                        isProcessing && "opacity-50 pointer-events-none"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-4">
                        {isProcessing ? (
                            <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-brand-cyan" />
                        )}
                    </div>
                    {isProcessing ? (
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Processing...</h3>
                            <p className="text-brand-cyan">{progress}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Upload PDF Notes</h3>
                            <p className="text-slate-400">Drag & drop or click to browse (Max 100MB)</p>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Documents List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-brand-purple" />
                        Indexed Documents
                    </h2>

                    {documents.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-white/5 rounded-2xl border border-white/5">
                            No documents uploaded yet.
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {documents.map((doc) => (
                                <motion.div
                                    key={doc.fileName}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-cyan/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-brand-purple/10">
                                            <FileText className="w-6 h-6 text-brand-purple" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{doc.fileName}</h3>
                                            <p className="text-sm text-slate-400">{doc.chunkCount} chunks indexed</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(doc.fileName)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                        title="Delete document"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
