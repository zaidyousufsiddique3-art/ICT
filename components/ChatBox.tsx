import React, { useState } from 'react';
import { generateGroundedAnswer } from '../services/ragService';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBoxProps {
    /** The tool id for which this chat is used (Ask Question) */
    toolId: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ toolId }) => {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || !language) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsGenerating(true);
        try {
            // Use RAG service for grounded answers (with language)
            const answer = await generateGroundedAnswer(userMsg, language);
            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error generating response. Please check your API key.' }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} `}
                    >
                        <div
                            className={`rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-brand-cyan text-black'
                                : 'bg-white/10 text-white whitespace-pre-wrap'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mr-auto max-w-[80%]"
                    >
                        <div className="rounded-lg p-3 bg-white/10 text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce delay-200" />
                        </div>
                    </motion.div>
                )}
            </div>
            {/* Input */}
            <div className="flex items-center gap-2 p-2 border-t border-white/10">
                <input
                    type="text"
                    className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan/50"
                    placeholder="Ask a question…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={isGenerating}
                />
                <button
                    onClick={() => {
                        import('jspdf').then(({ jsPDF }) => {
                            const doc = new jsPDF();
                            doc.setFontSize(16);
                            doc.text("Chat History", 20, 20);
                            doc.setFontSize(12);
                            let y = 40;
                            messages.forEach(msg => {
                                const role = msg.role === 'user' ? 'You: ' : 'AI: ';
                                const text = role + msg.content;
                                const splitText = doc.splitTextToSize(text, 170);
                                doc.text(splitText, 20, y);
                                y += splitText.length * 7 + 5;
                                if (y > 280) {
                                    doc.addPage();
                                    y = 20;
                                }
                            });
                            doc.save('chat_history.pdf');
                        });
                    }}
                    className="px-4 py-2 bg-white/5 text-slate-300 rounded-md hover:bg-white/10 transition border border-white/10"
                    title="Download Chat"
                >
                    <Download className="w-5 h-5" />
                </button>
                <button
                    onClick={handleSend}
                    disabled={isGenerating || !input.trim()}
                    className="px-4 py-2 bg-brand-cyan text-black rounded-md hover:bg-brand-cyan/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
