import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'terms' | 'privacy';
  onBack: () => void;
}

export default function LegalPage({ type, onBack }: LegalPageProps) {
  const content = type === 'terms' ? {
    title: "Terms of Service – SoundWave Hub",
    date: "May 6, 2026",
    sections: [
      {
        h: "1. Website Usage",
        p: "Users may use this website for personal and lawful purposes only. Misuse of the website is prohibited."
      },
      {
        h: "2. Music Content",
        p: "SoundWave Hub does not host copyrighted music files directly. Music playback is provided using official embedded sources such as YouTube or Spotify."
      },
      {
        h: "3. Accuracy",
        p: "We do not guarantee the accuracy or availability of lyrics, playlists, or music content."
      },
      {
        h: "4. Third-Party Services",
        p: "This website may use third-party services including embedded media players and advertising services."
      },
      {
        h: "5. User Responsibility",
        p: "Users are responsible for how they use the website and its content."
      },
      {
        h: "6. Intellectual Property",
        p: "All website branding, design, and original content belong to SoundWave Hub unless otherwise stated."
      },
      {
        h: "7. Limitation of Liability",
        p: "We are not responsible for any damages or issues resulting from the use of this website."
      },
      {
        h: "8. Changes to Terms",
        p: "We may update these Terms at any time without notice."
      },
      {
        h: "9. Termination",
        p: "We reserve the right to restrict access for misuse of the platform."
      }
    ]
  } : {
    title: "Privacy Policy – SoundWave Hub",
    date: "May 6, 2026",
    sections: [
      {
        h: "1. Information Collection",
        p: "We do not directly collect personal information unless voluntarily provided."
      },
      {
        h: "2. Cookies",
        p: "This website may use cookies to improve user experience and website performance."
      },
      {
        h: "3. Embedded Content",
        p: "Embedded media players from services like YouTube or Spotify may collect data according to their own privacy policies."
      },
      {
        h: "4. Advertising",
        p: "We may use advertising services such as Google AdSense in the future. These services may use cookies to personalize ads."
      },
      {
        h: "5. Data Security",
        p: "We do not store sensitive personal information on our servers."
      },
      {
        h: "6. External Links",
        p: "We are not responsible for third-party websites linked from this platform."
      },
      {
        h: "7. Children's Privacy",
        p: "This website is not intended for children under 13."
      },
      {
        h: "8. Changes to Policy",
        p: "We may update this Privacy Policy at any time."
      },
      {
        h: "9. Contact",
        p: "Users may contact us through the Support page for privacy-related questions."
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors group px-4 py-2 bg-white/5 rounded-full border border-white/5"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Hub
      </button>

      <div className="glass-card p-8 md:p-16 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          {type === 'terms' ? <FileText size={200} /> : <Shield size={200} />}
        </div>

        <header className="mb-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">{content.title}</h1>
          <p className="text-brand-purple font-medium">Last updated: {content.date}</p>
        </header>

        <div className="space-y-10 relative z-10">
          {content.sections.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-mono text-brand-blue border border-white/10">
                  {idx + 1}
                </span>
                {section.h}
              </h2>
              <p className="text-white/60 leading-relaxed pl-11">
                {section.p}
              </p>
            </motion.section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-sm">Thank you for using SoundWave Hub.</p>
        </footer>
      </div>
    </motion.div>
  );
}
