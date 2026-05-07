import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  HelpCircle, 
  Send, 
  Check, 
  Copy,
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface SupportPageProps {
  onBack: () => void;
}

export default function SupportPage({ onBack }: SupportPageProps) {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const copyEmail = () => {
    navigator.clipboard.writeText('bandularm@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Why is a song not playing?",
      a: "Some songs may be restricted or unavailable in certain regions due to licensing agreements from the official providers. Try searching for a different version or checking your connection."
    },
    {
      q: "Do I need an account to listen?",
      a: "No, SoundWave Hub is designed to be accessible to everyone. You can search, browse lyrics, and listen to official embeds without any registration."
    },
    {
      q: "Is the website free to use?",
      a: "Yes, all core features of SoundWave Hub are completely free. We focus on providing a premium discovery experience for all music lovers."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors group px-5 py-2 bg-white/5 rounded-full border border-white/5 hover:border-brand-purple/20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Hub
      </button>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-6 border border-brand-purple/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
        >
          <HelpCircle className="w-10 h-10" />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">Support Center</h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
          We’re here to help you with questions, feedback, or any technical issues you might encounter while using SoundWave Hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Contact info Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-[2rem] border-white/10 hover:neon-border transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-purple mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">Contact Support</h3>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              If you need assistance or experience any issues, our team is ready to help via email.
            </p>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
              <span className="text-sm font-medium truncate pr-2">bandularm@gmail.com</span>
              <button 
                onClick={copyEmail}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-brand-purple"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border-white/10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg mt-1">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Response Time</h4>
                <p className="text-xs text-white/40 leading-relaxed">Our support team aims to respond within 24–48 hours for most inquiries.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-pink/10 text-brand-pink rounded-lg mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Privacy & Safety</h4>
                <p className="text-xs text-white/40 leading-relaxed">We respect your privacy and never request sensitive personal information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Formulation Card */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 md:p-12 rounded-[2rem] border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <AlertCircle className="w-6 h-6 text-brand-purple" />
              <h3 className="text-3xl font-display font-bold">Report a Problem</h3>
            </div>
            <p className="text-white/60 mb-10">
              Found a bug, playback issue, or incorrect lyrics? Let us know so we can investigate and improve the platform experience for everyone.
            </p>

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-purple/10 border border-brand-purple/20 rounded-3xl p-12 text-center"
                >
                  <div className="w-16 h-16 bg-brand-purple text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-2">Message Sent!</h4>
                  <p className="text-white/50">Thank you for your report. We'll look into it immediately.</p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all text-white"
                      placeholder="Playback Issue / General Inquiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">How can we help?</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all text-white resize-none"
                      placeholder="Describe the issue or feedback in detail..."
                    ></textarea>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}

                  <div className="pt-4 flex flex-col md:flex-row items-center gap-6">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full md:w-auto bg-brand-purple hover:bg-brand-purple/80 px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-brand-purple/20 flex items-center justify-center gap-2 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                    <p className="text-xs text-white/20 italic text-center md:text-left">
                      By submitting, you agree to our privacy policy regarding support communications.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* FAQ Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-brand-blue" />
            <h3 className="text-3xl font-display font-bold">Frequently Asked</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="glass-card overflow-hidden border-white/5"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-brand-purple' : 'text-white/20'}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-white/[0.02]"
                    >
                      <div className="p-6 text-white/50 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="w-6 h-6 text-brand-pink" />
            <h3 className="text-3xl font-display font-bold">Suggestions</h3>
          </div>
          <div className="flex-1 glass-card p-12 flex flex-col items-center justify-center text-center gap-8 bg-gradient-to-br from-brand-purple/5 to-transparent border-brand-purple/10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-purple mb-2">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h4 className="text-2xl font-display font-bold mb-3">Feedback & Ideas</h4>
              <p className="text-white/50 leading-relaxed">
                We value your ideas above all. Help us shape the future of SoundWave Hub with your creative suggestions.
              </p>
            </div>
            <button className="bg-white text-black px-10 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all active:scale-95">Send Feedback</button>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 rounded-[2.5rem] border-white/5 bg-neutral-900/30 text-center mb-16">
        <p className="text-white/30 text-sm">
          SoundWave Hub is dedicated to excellence in music discovery. <br />
          For urgent business inquiries, please reach out directly through official developer channels.
        </p>
      </div>
    </motion.div>
  );
}
