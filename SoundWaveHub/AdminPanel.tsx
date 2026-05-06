import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Zap, 
  Settings, 
  LogOut, 
  Lock,
  Layout,
  Music4,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  isMaintenance: boolean;
  onToggleMaintenance: () => void;
}

export default function AdminPanel({ onLogout, isMaintenance, onToggleMaintenance }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'songs' | 'config'>('overview');

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 text-brand-purple mb-2">
              <ShieldAlert className="w-6 h-6" />
              <span className="font-bold tracking-[0.3em] uppercase text-xs">Owner Console</span>
            </div>
            <h1 className="text-4xl font-display font-bold">SoundWave Admin</h1>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl hover:bg-red-500/20 transition-all active:scale-95 font-bold"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              <Zap className="w-5 h-5" />
              <span className="font-bold">Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('songs')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'songs' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              <Music4 className="w-5 h-5" />
              <span className="font-bold">Manage Music</span>
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'config' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-bold">Configuration</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-8 border-white/5 bg-neutral-900/40">
                      <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className={`w-6 h-6 ${isMaintenance ? 'text-yellow-500 animate-pulse' : 'text-white/20'}`} />
                        <h3 className="text-xl font-bold">Maintenance Mode</h3>
                      </div>
                      <p className="text-white/40 text-sm mb-6">
                        When enabled, all public pages will redirect to a temporary maintenance screen.
                      </p>
                      <button 
                        onClick={onToggleMaintenance}
                        className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                          isMaintenance 
                            ? 'bg-yellow-500 text-black' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {isMaintenance ? 'Disable Maintenance' : 'Enable Maintenance'}
                      </button>
                    </div>

                    <div className="glass-card p-8 border-white/5 bg-neutral-900/40">
                      <div className="flex items-center gap-3 mb-6">
                        <Layout className="text-brand-blue w-6 h-6" />
                        <h3 className="text-xl font-bold">Quick Stats</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Total Songs</p>
                          <p className="text-2xl font-display font-bold">156</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Hub Users</p>
                          <p className="text-2xl font-display font-bold">12.4K</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 border-white/5 bg-neutral-900/40">
                    <h3 className="text-xl font-bold mb-6">Homepage Hero Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Banner Title</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-purple transition-all" defaultValue="Rhythm & Soul" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Banner Subtitle</label>
                        <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-purple transition-all h-24" defaultValue="Discover the future of high-fidelity music streaming." />
                      </div>
                      <button className="bg-brand-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-purple/80 transition-all">Update Hero</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'songs' && (
                <motion.div 
                  key="songs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Music Inventory</h2>
                    <button className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-purple/80 transition-all active:scale-95">
                      <Plus className="w-5 h-5" /> Add Track
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 1, title: "Midnight City", artist: "M83", genre: "Synthwave" },
                      { id: 2, title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
                      { id: 3, title: "Nightcall", artist: "Kavinsky", genre: "Dreamwave" },
                    ].map(song => (
                      <div key={song.id} className="glass-card p-4 border-white/5 bg-neutral-900/40 flex items-center justify-between hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center text-brand-purple font-bold">
                            {song.title[0]}
                          </div>
                          <div>
                            <h4 className="font-bold">{song.title}</h4>
                            <p className="text-xs text-white/40">{song.artist} • {song.genre}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-3 text-white/20 hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-3 text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
 }