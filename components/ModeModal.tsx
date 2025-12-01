import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolConfig, Level, ToolId } from '../types';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { ChatBox } from './ChatBox';

interface ModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: ToolConfig | null;
    onGenerate: (topic: string, level: string, notes: string) => void;
    isGenerating: boolean;
}

export const ModeModal: React.FC<ModeModalProps> = ({
    isOpen,
    onClose,
    tool,
    onGenerate,
    isGenerating
}) => {
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState<Level>(Level.AS);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic, level, notes);
        }
    };

    if (!tool) return null;

    const isChatMode = tool.id === ToolId.TOPIC_SUMMARY;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className={`w-full ${isChatMode ? 'max-w-2xl h-[80vh]' : 'max-w-lg'} bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative flex flex-col`}>

                            {/* Glow Effect */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

                            {/* Header */}
                            <div className="relative p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-brand-cyan/10">
                                        <tool.icon className="w-5 h-5 text-brand-cyan" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{tool.title}</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto relative">
                                {isChatMode ? (
                                    <ChatBox toolId={tool.id} />
                                ) : (
                                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                        {/* Topic Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Topic / Subject</label>
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder="e.g. Input Devices, Network Topologies..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all"
                                                required
                                            />
                                        </div>

                                        {/* Level Selection */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Level</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.values(Level).map((l) => (
                                                    <button
                                                        key={l}
                                                        type="button"
                                                        onClick={() => setLevel(l)}
                                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${level === l
                                                            ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan'
                                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Extra Notes */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Additional Context (Optional)</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Any specific requirements or focus areas..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all min-h-[100px] resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isGenerating || !topic.trim()}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold text-lg shadow-lg shadow-brand-cyan/20 hover:shadow-brand-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5" />
                                                    Generate Content
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
