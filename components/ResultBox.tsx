import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, RefreshCw, ArrowLeft, Download } from 'lucide-react';

interface ResultBoxProps {
    content: string;
    title: string;
    onBack: () => void;
}

export const ResultBox: React.FC<ResultBoxProps> = ({ content, title, onBack }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Tools</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            import('jspdf').then(({ jsPDF }) => {
                                const doc = new jsPDF();
                                doc.setFontSize(16);
                                doc.text(title, 20, 20);
                                doc.setFontSize(12);
                                const splitText = doc.splitTextToSize(content, 170);
                                doc.text(splitText, 20, 40);
                                doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${copied
                            ? 'bg-green-500/10 border-green-500/50 text-green-400'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                            }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            {/* Content Box */}
            <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
                        {title}
                    </h2>
                </div>

                {/* Markdown Content */}
                <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-brand-cyan prose-li:text-slate-300 prose-code:text-brand-purple">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
