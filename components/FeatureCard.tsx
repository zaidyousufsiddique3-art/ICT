import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ToolConfig } from '../types';

interface FeatureCardProps {
  tool: ToolConfig;
  onClick: (tool: ToolConfig) => void;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ tool, onClick, index }) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(tool)}
      className="group relative cursor-pointer"
    >
      {/* Glass Container */}
      <div className="h-full p-6 glass-panel rounded-2xl transition-all duration-300 group-hover:border-brand-cyan/40 group-hover:shadow-[0_0_30px_-5px_rgba(0,231,255,0.3)] flex flex-col items-start gap-4">
        
        {/* Icon Container */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/50 transition-colors duration-300">
          <Icon className="w-8 h-8 text-brand-cyan group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Text Content */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors duration-300">
            {tool.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            {tool.description}
          </p>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-purple/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};