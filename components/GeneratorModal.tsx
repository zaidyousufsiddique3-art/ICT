import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { ToolConfig, Level } from '../types';
import { Button } from './ui/Button';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolConfig | null;
  onGenerate: (topic: string, level: string, notes: string) => void;
  isGenerating: boolean;
}

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onClose,
  tool,
  onGenerate,
  isGenerating
}) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<Level>(Level.A2);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, level, notes);
    }
  };

  // Reset form when tool changes
  React.useEffect(() => {
    if (isOpen) {
      setTopic('');
      setNotes('');
      setLevel(Level.A2);
    }
  }, [isOpen, tool]);

  if (!isOpen || !tool) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-panel rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30">
                <tool.icon className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{tool.title}</h2>
                <p className="text-brand-cyan/80 text-sm">AI Generator Config</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Topic Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Topic / Subject</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Relational Databases, Network Topologies..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all"
                  required
                />
              </div>

              {/* Level Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Academic Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(Level).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${
                        level === lvl 
                          ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,231,255,0.2)]' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Additional Context (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on definitions, include a diagram description, make it hard..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all h-24 resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                  isLoading={isGenerating}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Material
                </Button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};