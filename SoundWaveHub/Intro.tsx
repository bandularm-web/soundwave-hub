import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000), // Screen 1 duration
      setTimeout(() => setStep(2), 6500), // Screen 2 duration
      setTimeout(() => setStep(3), 9500), // Screen 3 duration
      setTimeout(() => onComplete(), 13000), // Final transition
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const screens = [
    {
      id: 0,
      text: "SoundWave Hub",
      style: "text-6xl md:text-8xl font-display font-bold neon-glow tracking-tighter"
    },
    {
      id: 1,
      text: "Feel The Music",
      style: "text-4xl md:text-6xl font-sans font-light tracking-widest opacity-80"
    },
    {
      id: 2,
      text: "Owned and Developed by Mr. Savidya Deeman Ranasinghe",
      style: "text-xl md:text-2xl font-sans text-center px-6 opacity-90 italic"
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={onComplete}
    >
      <div className="absolute inset-0 bg-radial-gradient from-brand-purple/20 to-black pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className={`${screens[step].style} text-white`}>
              {screens[step].text}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 right-10 text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest"
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
      >
        Skip Intro
      </motion.button>
    </div>
  );
}
