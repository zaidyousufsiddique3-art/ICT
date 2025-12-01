import React from 'react';
import { motion } from 'framer-motion';
import { ToolConfig } from '../types';
import { ArrowRight } from 'lucide-react';

interface ModeCardProps {
  tool: ToolConfig;
  onClick: (tool: ToolConfig) => void;
  index: number;
}

export const ModeCard: React.FC<ModeCardProps> = ({ tool, onClick, index }) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(tool)}
      className="group relative p-6 rounded-2xl cursor-pointer overflow-hidden
                 bg-white/5 border border-white/10 backdrop-blur-xl
                 hover:border-brand-cyan/50 hover:shadow-[0_0_30px_rgba(0,231,255,0.15)]
                 transition-all duration-300"
    >
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:bg-brand-cyan/10 transition-colors duration-300">
          <Icon className="w-8 h-8 text-brand-cyan group-hover:text-white transition-colors duration-300" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors duration-300">
          {tool.title}
        </h3>
        
        <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
          {tool.description}
        </p>

        <div className="flex items-center text-xs font-medium text-brand-cyan/70 group-hover:text-brand-cyan transition-colors">
          <span>START GENERATING</span>
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
