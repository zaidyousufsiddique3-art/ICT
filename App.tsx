import React, { useState } from 'react';
import { Background } from './components/Layout/Background';
import { ModeCard } from './components/ModeCard';
import { ModeModal } from './components/ModeModal';
import { ResultBox } from './components/ResultBox';
import { TOOLS } from './constants';
import { ToolConfig } from './types';
import { generateContent } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function App() {
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToolSelect = (tool: ToolConfig) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      if (!isGenerating) setSelectedTool(null);
    }, 300);
  };

  const handleGenerate = async (topic: string, level: string, notes: string) => {
    if (!selectedTool) return;

    setIsGenerating(true);
    try {
      // Use RAG service for grounded answers
      const prompt = selectedTool.promptTemplate(topic, level, notes);
      // We pass the constructed prompt as the "question" to the RAG service
      // The RAG service will find context relevant to this prompt/topic and append it.
      // However, the promptTemplate already constructs a full prompt.
      // We might want to just pass the topic to find context, then inject it.
      // But generateGroundedAnswer takes (question, level).

      // Let's modify generateGroundedAnswer to accept a full prompt or handle this better.
      // For now, we'll use the topic to find context, and then let the RAG service construct the final prompt?
      // No, the RAG service constructs its own prompt.
      // Query knowledge base for context
      const { queryKnowledgeBase } = await import('./services/ragService');
      const context = await queryKnowledgeBase(topic);

      // Build prompt with RAG context
      const finalPrompt = `
        ${selectedTool.promptTemplate(topic, level, notes)}
        
        Use the following context from the knowledge base if relevant:
        ${context || "No relevant notes found."}
      `;

      // Step 1: Generate base answer with Gemini
      const baseAnswer = await generateContent(finalPrompt);

      // Step 2: Refine with OpenAI
      const { refineWithOpenAI } = await import('./services/openaiService');
      const refinedAnswer = await refineWithOpenAI(baseAnswer, context);

      setResult(refinedAnswer);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setSelectedTool(null);
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-brand-cyan/30 selection:text-white">
      <Background />

      <main className="container mx-auto px-4 py-6 md:py-8 relative z-10 flex flex-col min-h-screen">

        {/* Header */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8 space-y-3 relative"
            >
              <Link to="/knowledge" className="absolute top-0 right-0 p-2 text-slate-400 hover:text-brand-cyan transition-colors" title="Manage Knowledge Base">
                <Database className="w-6 h-6" />
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2">
                <BrainCircuit className="w-4 h-4 text-brand-cyan" />
                <span className="text-xs font-semibold tracking-wide uppercase text-brand-cyan">AI-Powered Learning</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                <span className="block text-white mb-2">What would you like to</span>
                <span className="neon-text-gradient">generate today?</span>
              </h1>

              <p className="text-base text-slate-400 max-w-2xl mx-auto font-light">
                AI-powered A-Level ICT study tools.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {result ? (
            <ResultBox
              key="result"
              content={result}
              onBack={resetApp}
              title={selectedTool?.title || "Generated Content"}
            />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto flex-1"
            >
              {TOOLS.map((tool, idx) => (
                <ModeCard
                  key={tool.id}
                  tool={tool}
                  index={idx}
                  onClick={handleToolSelect}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Modal */}
      <ModeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tool={selectedTool}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}