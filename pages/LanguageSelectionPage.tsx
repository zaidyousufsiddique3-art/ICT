import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Upload, FileText, Trash2, Check, X } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useDropzone } from 'react-dropzone';
import { processAndStorePDF } from '../services/ragService';
import { getAllDocuments, deleteDocument } from '../services/vectorDbService';

interface Document {
    fileName: string;
}

export const LanguageSelectionPage: React.FC = () => {
    const { setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState<Language | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Load existing documents
    const loadDocuments = useCallback(async () => {
        const docs = await getAllDocuments();
        const uniqueFiles = Array.from(new Set(docs.map(d => d.fileName))).map(fileName => ({ fileName }));
        setDocuments(uniqueFiles);
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const handleLanguageSelect = (lang: Language) => {
        setSelectedLang(lang);
    };

    const handleContinue = () => {
        if (selectedLang) {
            setLanguage(selectedLang);
            navigate('/home');
        }
    };

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
        if (confirm(`Delete ${fileName}?`)) {
            await deleteDocument(fileName);
            loadDocuments();
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: true,
    });

    const languages = [
        { code: 'english' as Language, label: 'English', emoji: '🇬🇧' },
        { code: 'tamil' as Language, label: 'தமிழ்', emoji: '🇱🇰' },
        { code: 'sinhala' as Language, label: 'සිංහල', emoji: '🇱🇰' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#1a1f35] to-[#0a0f1c] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full space-y-6"
            >
                {/* Header */}
                <div className="text-center space-y-2 relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-purple"
                    >
                        <Globe className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white">Welcome to ICT Study Copilot</h1>
                    <p className="text-sm text-slate-400">Select language & upload your study materials</p>

                    {/* Upload Files Button - Top Right */}
                    <div className="absolute top-0 right-0">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7B4DFF] hover:bg-[#6B3DEF] text-white rounded-lg transition-all font-medium text-sm shadow-lg"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Files to Database
                        </button>
                    </div>
                </div>

                {/* Language Selection */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span>1.</span> Choose Language
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className={`p-3 rounded-lg border transition-all ${selectedLang === lang.code
                                    ? 'bg-brand-cyan/20 border-brand-cyan text-white'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{lang.emoji}</div>
                                <div className="text-xs font-medium">{lang.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!selectedLang}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold text-lg shadow-lg shadow-brand-cyan/20 hover:shadow-brand-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    {selectedLang ? 'Continue to Study Tools' : 'Select a Language to Continue'}
                </button>

                <p className="text-xs text-center text-slate-500">
                    Uploaded materials work across all languages • You can add more files later from the home page
                </p>
            </motion.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1f35] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-brand-cyan" />
                                    Upload Study Materials
                                </h3>
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Dropzone */}
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragActive
                                        ? 'border-brand-cyan bg-brand-cyan/10'
                                        : 'border-white/20 hover:border-brand-cyan/50 hover:bg-white/5'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="w-10 h-10 text-brand-cyan mx-auto mb-3" />
                                    <p className="text-white text-base mb-1">
                                        {isDragActive ? 'Drop PDFs here...' : 'Drag & drop PDF files here'}
                                    </p>
                                    <p className="text-slate-400 text-sm">or click to browse (max 100MB per file)</p>
                                </div>

                                {/* Progress */}
                                {isProcessing && (
                                    <div className="text-sm text-brand-cyan animate-pulse text-center font-medium">{progress}</div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                        {error}
                                    </div>
                                )}

                                {/* Documents List */}
                                {documents.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{documents.length} document(s) uploaded</p>
                                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                            {documents.map((doc, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 group hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <FileText className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                                                        <span className="text-sm text-white truncate">{doc.fileName}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(doc.fileName)}
                                                        className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        title="Delete file"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
