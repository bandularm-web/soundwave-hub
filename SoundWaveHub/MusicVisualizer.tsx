import React from 'react';
import { motion } from 'motion/react';

export default function MusicVisualizer({ isPlaying, theme = 'dark' }: { isPlaying: boolean, theme?: 'light' | 'dark' }) {
  const bars = Array.from({ length: 20 });
  
  return (
    <div className="flex items-end justify-center gap-1 h-32 w-full px-4 overflow-hidden">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isPlaying ? [
              Math.random() * 60 + 20 + '%',
              Math.random() * 60 + 20 + '%',
              Math.random() * 60 + 20 + '%',
              Math.random() * 60 + 20 + '%',
            ] : '10%'
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
          className={`w-1.5 rounded-t-full shadow-[0_0_15px_-2px_rgba(139,92,246,0.5)] ${
            theme === 'dark' ? 'bg-gradient-to-t from-brand-purple to-brand-blue' : 'bg-gradient-to-t from-brand-purple/60 to-brand-blue/60'
          }`}
        />
      ))}
    </div>
  );
}
