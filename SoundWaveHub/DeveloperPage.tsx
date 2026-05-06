import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Mail, 
  Copy, 
  Check, 
  Heart, 
  Github, 
  Linkedin, 
  Globe,
  MessageCircle
} from 'lucide-react';

interface DeveloperPageProps {
  onBack: () => void;
}

export default function DeveloperPage({ onBack }: DeveloperPageProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('bandularm@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors group px-5 py-2 bg-white/5 rounded-full border border-white/5"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Hub
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Developer Info Section */}
        <div className="lg:col-span-12 mb-8">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Developer & Support</h1>
            <p className="text-white/40 text-lg">Connect with the creator and help fuel the future of SoundWave Hub.</p>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-2 pt-4">Mr. Savidya Deeman Ranasinghe</h2>
              <p className="text-brand-purple font-medium text-lg mb-6 tracking-wide">Lead Developer & Visionary</p>
              
              <p className="text-white/50 leading-relaxed mb-8">
                "SoundWave Hub started as a passion project to simplify music discovery. My mission is to build the most premium and accessible platform for lyrics and official music."
              </p>

              <div className="space-y-4">
                <div className="glass-card bg-black/40 p-4 flex items-center justify-between border-white/5 hover:border-brand-purple/30 transition-all">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-purple" />
                    <span className="text-sm font-medium">bandularm@gmail.com</span>
                  </div>
                  <button 
                    onClick={copyEmail}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-brand-purple transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="w-12 h-12 glass-card flex items-center justify-center hover:bg-white/10 border-white/10 transition-all">
                    <Github className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 glass-card flex items-center justify-center hover:bg-white/10 border-white/10 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 glass-card flex items-center justify-center hover:bg-white/10 border-white/10 transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border-brand-purple/20 bg-brand-purple/5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-purple" />
              Collaboration Requests
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Open for professional web development projects, music industry partnerships, and innovative technology collaborations. Feel free to reach out via email.
            </p>
          </div>
        </div>

        {/* Donation Section */}
        <div className="lg:col-span-12">
          <div className="glass-card p-12 md:p-20 rounded-[3rem] border-white/10 bg-neutral-900/40 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-brand-purple/10 text-brand-purple rounded-3xl flex items-center justify-center mb-10 border border-brand-purple/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
            >
              <Heart className="w-10 h-10 fill-brand-purple/20" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight">Support SoundWave Hub</h2>
            
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl leading-relaxed font-light">
              Donation support will be available soon. We appreciate your interest in supporting SoundWave Hub and helping the platform continue to grow.
            </p>

            <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-brand-purple">Premium Support Coming Soon</p>
          </div>
        </div>
      </div>
      
      <div className="mt-20 glass-card p-12 rounded-[3rem] border-white/5 bg-gradient-to-r from-brand-purple/10 via-transparent to-brand-blue/10 text-center">
        <h3 className="text-2xl font-display font-bold mb-4">Together, let's keep the Wave alive.</h3>
        <p className="text-white/40 max-w-2xl mx-auto italic">
          "Architecture without passion is just dead space. Code without heart is just syntax. Every donation or message is a reminder that this platform matters."
        </p>
      </div>
    </motion.div>
  );
}