import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Copy, Check, Download, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface ResultDisplayProps {
  content: string;
  onBack: () => void;
  title: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onBack, title }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_StudyMaterial.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto pb-10"
    >
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sticky top-4 z-40 bg-brand-dark/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium self-start sm:self-auto"
        >
          <ChevronLeft size={16} />
          Back to Tools
        </button>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" onClick={handleCopy} className="flex-1 sm:flex-none !py-2 !px-4 text-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="secondary" onClick={handleDownload} className="flex-1 sm:flex-none !py-2 !px-4 text-sm">
            <Download size={16} />
            Export MD
          </Button>
        </div>
      </div>

      {/* Content Container */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 min-h-[60vh] border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
        <article className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-white prose-headings:to-slate-300
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-brand-cyan
          prose-ul:marker:text-brand-purple
          prose-li:text-slate-300
          prose-code:text-brand-cyan prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10
        ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </motion.div>
  );
};