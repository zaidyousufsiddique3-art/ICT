import React, { useState } from 'react';
import { Background } from './components/Layout/Background';
import { ModeCard } from './components/ModeCard';
import { ModeModal } from './components/ModeModal';
import { ResultBox } from './components/ResultBox';
import { TOOLS } from './constants';
import { ToolConfig } from './types';
import { generateContent } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { getTranslation } from './utils/translations';

export default function App() {
  const { language } = useLanguage();
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

  // Updated handleGenerate - removed level, added language, smart fallback
  const handleGenerate = async (topic: string, notes: string) => {
    if (!selectedTool || !language) return;

    setIsGenerating(true);
    try {
      // Query knowledge base for context
      const { queryKnowledgeBase } = await import('./services/ragService');
      const context = await queryKnowledgeBase(topic);

      // Build prompt with RAG context (no level parameter)
      const finalPrompt = `
        ${selectedTool.promptTemplate(topic, notes)}
        
        Use the following context from the knowledge base if relevant:
        ${context || "No relevant notes found."}
      `;

      let baseAnswer = '';

      // If we have context, use Gemini to generate the base answer
      if (context) {
        baseAnswer = await generateContent(finalPrompt);
      } else {
        // If no context, skip Gemini and let OpenAI handle the conversational fallback directly
        // We pass the user's topic/question as the "baseAnswer" for the fallback logic
        baseAnswer = topic;
      }

      // Step 2: Refine with OpenAI (with language translation and smart fallback)
      const { refineWithOpenAI } = await import('./services/openaiService');
      const refinedAnswer = await refineWithOpenAI(baseAnswer, context, language, !!context);

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

  // Get translated text
  const t = (key: any) => language ? getTranslation(language, key) : key;

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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2">
                <BrainCircuit className="w-4 h-4 text-brand-cyan" />
                <span className="text-xs font-semibold tracking-wide uppercase text-brand-cyan">
                  {t('aiPoweredLearning')}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                <span className="block text-white mb-2">{t('whatWouldYouLike')}</span>
                <span className="neon-text-gradient">{t('generateToday')}</span>
              </h1>

              <p className="text-base text-slate-400 max-w-2xl mx-auto font-light">
                {t('studyToolsSubtitle')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area - Now showing 5 cards with translations */}
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

      {/* Modal - No longer passes level */}
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