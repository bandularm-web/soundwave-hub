import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Music, 
  Flame, 
  Coffee, 
  Gamepad2, 
  Dumbbell, 
  CloudRain, 
  Moon, 
  Play, 
  Share2, 
  ArrowLeft,
  X,
  ExternalLink,
  ChevronRight,
  Disc,
  Clock,
  Star,
  TrendingUp,
  History,
  HelpCircle,
  Shield,
  FileText,
  Heart,
  User,
  Sun,
  Zap,
  Lock
} from 'lucide-react';
import Intro from './components/Intro';
import LegalPage from './components/LegalPage';
import SupportPage from './components/SupportPage';
import DeveloperPage from './components/DeveloperPage';
import MusicVisualizer from './components/MusicVisualizer';
import AdminPanel from './components/AdminPanel';
import { TRENDING_SONGS, CATEGORIES, POPULAR_ARTISTS, type Song } from './types';
import { fetchSongDetails } from './services/musicService';

type ViewState = 'home' | 'song' | 'terms' | 'privacy' | 'support' | 'developer';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentPlayingSong, setCurrentPlayingSong] = useState<Song | null>(null);
  const [activeCategory, setActiveCategory] = useState('trending');
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('soundwave_admin_active') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(() => {
    return localStorage.getItem('soundwave_maintenance') === 'true';
  });
  const [footerClicks, setFooterClicks] = useState(0);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('soundwave_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    const saved = localStorage.getItem('soundwave_recent');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('soundwave_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('soundwave_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('soundwave_recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('soundwave_theme', theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('soundwave_maintenance', String(isMaintenance));
  }, [isMaintenance]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'savidya123') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError(false);
      localStorage.setItem('soundwave_admin_active', 'true');
      setView('admin');
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('soundwave_admin_active');
    setView('home');
  };

  const handleFooterClick = () => {
    setFooterClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowAdminLogin(true);
        return 0;
      }
      return next;
    });
    // Reset clicks after 2 seconds of inactivity
    const timer = setTimeout(() => setFooterClicks(0), 2000);
    return () => clearTimeout(timer);
  };

  const toggleFavorite = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const addToRecent = (song: Song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 10);
    });
  };

  const favoriteSongs = useMemo(() => {
    return TRENDING_SONGS.filter(s => favorites.includes(s.id));
  }, [favorites]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSongs = useMemo(() => {
    if (activeCategory === 'trending') return TRENDING_SONGS.filter(s => s.trending);
    return TRENDING_SONGS.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const recentSongs = useMemo(() => TRENDING_SONGS.filter(s => s.isRecent), []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    const details = await fetchSongDetails(searchQuery);
    if (details && !details.error) {
      const newSong: Song = {
        id: Math.random().toString(36).substr(2, 9),
        title: details.title,
        artist: details.artist,
        lyrics: details.lyrics,
        coverUrl: `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80`,
        youtubeId: details.youtubeId
      };
      setSelectedSong(newSong);
      setCurrentPlayingSong(newSong);
      addToRecent(newSong);
    }
    setLoading(false);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-black' : 'bg-slate-50'}`}>
      {/* Maintenance Mode Overlay */}
      {isMaintenance && !isAdminLoggedIn && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center p-6 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl space-y-8"
          >
            <div className="w-24 h-24 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center mx-auto border border-brand-purple/20 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
              <Zap className="w-12 h-12 animate-pulse" />
            </div>
            <h1 className="text-5xl font-display font-bold tracking-tight">System Maintenance</h1>
            <p className="text-xl text-white/40 leading-relaxed">
              SoundWave Hub is currently receiving a premium architectural upgrade. We'll be back online shortly with new high-fidelity features.
            </p>
            <div className="pt-8 flex justify-center gap-4">
              <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLogin(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-card p-8 bg-neutral-900 border-white/10 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6 text-brand-purple">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-bold uppercase tracking-widest text-sm">Secure Access</h2>
              </div>
              <p className="text-white/40 mb-8 text-sm">Please provide the administrative authorization key to access the hub controls.</p>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input 
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Authorization Key"
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all focus:ring-2 focus:ring-brand-purple/50 ${
                      adminError ? 'border-red-500 ring-4 ring-red-500/20' : 'border-white/10 focus:border-brand-purple'
                    }`}
                    autoFocus
                  />
                  {adminError && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-widest">Access Denied: Invalid Key</p>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-brand-purple text-white py-4 rounded-2xl font-bold hover:bg-brand-purple/80 transition-all active:scale-95 shadow-xl shadow-brand-purple/20"
                >
                  Confirm Identity
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full animate-pulse transition-opacity duration-1000 ${theme === 'dark' ? 'bg-brand-purple/20' : 'bg-brand-purple/10 opacity-30'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-opacity duration-1000 ${theme === 'dark' ? 'bg-brand-blue/20' : 'bg-brand-blue/10 opacity-30'}`} />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? (theme === 'dark' ? 'bg-black/80' : 'bg-white/80') + ' backdrop-blur-xl border-b border-white/5 py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setSelectedSong(null); setSearchQuery(''); setActiveCategory('trending'); setView('home'); }}
            onDoubleClick={() => setShowAdminLogin(true)}
          >
            <Music className="w-8 h-8 text-brand-purple" />
            <span className={`text-2xl font-display font-bold ${theme === 'dark' ? 'neon-glow' : 'text-slate-900'}`}>SoundWave</span>
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-12 relative group">
            <form onSubmit={handleSearch} className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${theme === 'dark' ? 'text-white/40 group-focus-within:text-brand-purple' : 'text-slate-400 group-focus-within:text-brand-purple'}`} />
              <input 
                type="text" 
                placeholder="Search songs or artists..." 
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-full py-3 px-12 outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' 
                    : 'bg-slate-200/50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 border-2 border-brand-purple border-t-transparent w-4 h-4 rounded-full animate-spin" />}
            </form>

            <AnimatePresence>
              {showSuggestions && searchQuery.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-2 w-full border rounded-2xl overflow-hidden shadow-2xl z-50 ${
                    theme === 'dark' ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="p-2">
                    <button 
                      onClick={() => handleSearch()}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                        theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Search className="w-4 h-4 text-brand-purple" />
                      <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Search for "{searchQuery}"</span>
                    </button>
                    <div className={`h-px my-2 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`} />
                    <p className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Suggestions</p>
                    {TRENDING_SONGS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(song => (
                      <button 
                        key={song.id}
                        onClick={() => { setSelectedSong(song); setView('song'); setShowSuggestions(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                          theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={song.coverUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{song.title}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>{song.artist}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all active:scale-95 ${
                theme === 'dark' ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => { setView('support'); window.scrollTo(0, 0); }}
              className={`hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-full border active:scale-95 ${
                theme === 'dark' 
                  ? 'text-white/60 hover:text-brand-purple bg-white/5 border-white/5' 
                  : 'text-slate-500 hover:text-brand-purple bg-slate-200/50 border-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Support
            </button>
            <button className="bg-brand-purple hover:bg-brand-purple/80 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg active:scale-95">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Backdrop for suggestions */}
      {showSuggestions && <div className="fixed inset-0 z-30" onClick={() => setShowSuggestions(false)} />}

      {/* Global Player Bar */}
      <AnimatePresence>
        {currentPlayingSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
          >
            <div className="glass-card bg-neutral-900/90 backdrop-blur-2xl border-white/10 p-3 flex items-center justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 opacity-50" />
              
              <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0 cursor-pointer" onClick={() => { setSelectedSong(currentPlayingSong); setView('song'); }}>
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                  <img src={currentPlayingSong.coverUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{currentPlayingSong.title}</h4>
                  <p className="text-white/40 text-xs truncate">{currentPlayingSong.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-6 relative z-10">
                <div className="hidden md:flex gap-4">
                  <button className="text-white/40 hover:text-white transition-colors"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                  <button className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center hover:scale-105 transition-transform"><Play className="w-5 h-5 fill-white" /></button>
                  <button className="text-white/40 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <button 
                  onClick={() => setIsPlayerOpen(!isPlayerOpen)}
                  className="bg-brand-purple/20 text-brand-purple p-2 md:px-4 md:py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-purple/30 transition-colors"
                >
                  {isPlayerOpen ? 'Collapse' : 'Now Playing'}
                </button>
                <button 
                  onClick={() => setCurrentPlayingSong(null)}
                  className="text-white/40 hover:text-white p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar Mockup */}
              <div className="absolute bottom-0 left-0 h-1 bg-brand-purple/20 w-full">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                  className="h-full bg-brand-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                />
              </div>
            </div>

            {/* Expanded Player Portal */}
            <AnimatePresence>
              {isPlayerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="absolute bottom-full mb-4 w-full glass-card rounded-3xl overflow-hidden shadow-2xl border-white/10"
                >
                  <div className="aspect-video w-full bg-black relative">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${currentPlayingSong.youtubeId}?autoplay=1&rel=0&modestbranding=1`} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {view === 'admin' && isAdminLoggedIn ? (
            <AdminPanel 
              isMaintenance={isMaintenance} 
              onToggleMaintenance={() => setIsMaintenance(!isMaintenance)}
              onLogout={handleAdminLogout} 
            />
          ) : view === 'song' && selectedSong ? (
            <SongDetailPage 
              song={selectedSong} 
              theme={theme}
              onBack={() => setView('home')} 
              isFavorite={favorites.includes(selectedSong.id)}
              onFavoriteToggle={(e) => toggleFavorite(e, selectedSong.id)}
            />
          ) : view === 'terms' ? (
            <LegalPage type="terms" onBack={() => setView('home')} />
          ) : view === 'privacy' ? (
            <LegalPage type="privacy" onBack={() => setView('home')} />
          ) : view === 'support' ? (
            <SupportPage onBack={() => setView('home')} />
          ) : view === 'developer' ? (
            <DeveloperPage onBack={() => setView('home')} />
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <div className="relative glass-card h-[300px] md:h-[450px] mb-12 flex items-center px-12 group rounded-3xl">
                <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-[1.5s] ease-out">
                  <img 
                    src="https://images.unsplash.com/photo-1514525253361-bee8a81690db?w=1600&q=80" 
                    className="w-full h-full object-cover opacity-30 shadow-2xl"
                    alt="Hero"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                </div>
                
                <div className="relative max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="inline-block bg-brand-purple/20 text-brand-purple px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Premium Experience</span>
                    <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 leading-tight">
                      Feel the <span className="text-brand-purple">Pulse</span> <br />
                      of the <span className="text-brand-blue">World</span>
                    </h1>
                    <p className="text-lg text-white/60 mb-8 max-w-md hidden md:block">
                      SoundWave Hub delivers premium lyrics and official music embeds in a cinematic dark environment.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => { setSelectedSong(TRENDING_SONGS[0]); setView('song'); setCurrentPlayingSong(TRENDING_SONGS[0]); addToRecent(TRENDING_SONGS[0]); }}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-black" /> Explore Now
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Recently Played */}
              {recentlyPlayed.length > 0 && (
                <section className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <History className="w-6 h-6 text-brand-blue" />
                    <h2 className={`text-3xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recently Played</h2>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {recentlyPlayed.map((song, idx) => (
                      <div key={`recent-${song.id}-${idx}`} className="w-48 flex-shrink-0">
                        <SongCard 
                          song={song} 
                          index={idx} 
                          isFavorite={favorites.includes(song.id)}
                          onFavoriteToggle={(e) => toggleFavorite(e, song.id)}
                          onClick={() => {
                            setSelectedSong(song);
                            setView('song');
                            setCurrentPlayingSong(song);
                            addToRecent(song);
                          }}
                          compact
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Your Favorites */}
              {favoriteSongs.length > 0 && (
                <section className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-6 h-6 text-brand-pink fill-brand-pink/20" />
                    <h2 className={`text-3xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Your Favorites</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {favoriteSongs.map((song, idx) => (
                      <SongCard 
                        key={`fav-${song.id}`} 
                        song={song} 
                        index={idx} 
                        isFavorite={favorites.includes(song.id)}
                        onFavoriteToggle={(e) => toggleFavorite(e, song.id)}
                        onClick={() => {
                          setSelectedSong(song);
                          setView('song');
                          setCurrentPlayingSong(song);
                          addToRecent(song);
                        }}
                        compact
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Category Filter */}
              <div className="flex items-center gap-3 overflow-x-auto pb-8 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all border ${
                      activeCategory === cat.id 
                      ? 'bg-brand-purple border-brand-purple shadow-lg shadow-brand-purple/20 text-white' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    <span className="font-medium text-sm">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Song Grid */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {activeCategory === 'trending' ? <Flame className="w-6 h-6 text-brand-pink" /> : <Music className="w-6 h-6 text-brand-purple" />}
                    <h2 className="text-3xl font-display font-bold capitalize">{activeCategory} Hits</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredSongs.map((song, idx) => (
                      <SongCard 
                        key={song.id} 
                        song={song} 
                        index={idx} 
                        isFavorite={favorites.includes(song.id)}
                        onFavoriteToggle={(e) => toggleFavorite(e, song.id)}
                        onClick={() => {
                          setSelectedSong(song);
                          setView('song');
                          setCurrentPlayingSong(song);
                          addToRecent(song);
                        }} 
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* Recently Added */}
              <section className={`mb-16 p-8 md:p-12 rounded-[2rem] border transition-colors ${
                theme === 'dark' ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-brand-blue" />
                    <h2 className={`text-3xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recently Added</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {recentSongs.map((song, idx) => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      index={idx} 
                      isFavorite={favorites.includes(song.id)}
                      onFavoriteToggle={(e) => toggleFavorite(e, song.id)}
                      onClick={() => {
                        setSelectedSong(song);
                        setView('song');
                        setCurrentPlayingSong(song);
                        addToRecent(song);
                      }} 
                      compact 
                    />
                  ))}
                </div>
              </section>

              {/* Popular Artists */}
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Star className="w-6 h-6 text-yellow-400 font-bold" />
                  <h2 className="text-3xl font-display font-bold">Popular Artists</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {POPULAR_ARTISTS.map((artist, idx) => (
                    <motion.div
                      key={artist.id}
                      whileHover={{ y: -5 }}
                      className="glass-card p-6 flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 ring-4 ring-white/5 group-hover:ring-brand-purple/50 transition-all duration-500">
                        <img src={artist.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" alt={artist.name} />
                      </div>
                      <h3 className="font-bold text-xl group-hover:text-brand-purple transition-colors">{artist.name}</h3>
                      <p className="text-white/40 text-sm mt-1">{artist.genre}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 pt-20 pb-10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Music className="w-8 h-8 text-brand-purple" />
                <span className="text-2xl font-display font-bold neon-glow">SoundWave</span>
              </div>
              <p className="text-white/50 max-w-sm mb-8">
                SoundWave Hub is a world-class music discovery platform. Owned and developed by Mr. Savidya Deeman Ranasinghe.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 glass-card flex items-center justify-center hover:bg-brand-purple/20 cursor-pointer transition-colors"><Share2 className="w-4 h-4" /></div>
                <div className="w-10 h-10 glass-card flex items-center justify-center hover:bg-brand-blue/20 cursor-pointer transition-colors"><ExternalLink className="w-4 h-4" /></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Categories</h4>
              <ul className="space-y-4 text-white/50">
                {CATEGORIES.slice(0, 5).map(c => (
                  <li key={c.id} onClick={() => { setActiveCategory(c.id); setView('home'); window.scrollTo(0, 0); }} className="hover:text-white cursor-pointer transition-colors">{c.name}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 md:col-span-4">
              <h4 className="font-bold mb-8 text-white/80 uppercase tracking-[0.2em] text-xs">Legal & Community Support</h4>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => { setView('terms'); window.scrollTo(0, 0); }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-brand-purple/40 px-6 py-3 rounded-2xl transition-all group"
                >
                  <FileText className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Terms of Service</span>
                </button>
                <button 
                  onClick={() => { setView('privacy'); window.scrollTo(0, 0); }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-brand-blue/40 px-6 py-3 rounded-2xl transition-all group"
                >
                  <Shield className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Privacy Policy</span>
                </button>
                <button 
                  onClick={() => { setView('support'); window.scrollTo(0, 0); }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-brand-purple/40 px-6 py-3 rounded-2xl transition-all group"
                >
                  <HelpCircle className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Support Center</span>
                </button>
                <button 
                  onClick={() => { setView('developer'); window.scrollTo(0, 0); }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-brand-blue/40 px-6 py-3 rounded-2xl transition-all group"
                >
                  <User className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Contact Developer</span>
                </button>
                <button 
                  onClick={() => { setView('developer'); window.scrollTo(0, 0); }}
                  className="flex items-center gap-3 bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 px-6 py-3 rounded-2xl transition-all group shadow-xl shadow-brand-purple/5"
                >
                  <Heart className="w-5 h-5 text-brand-purple fill-brand-purple/20 group-hover:scale-125 transition-transform" />
                  <span className="font-bold text-sm text-brand-purple">Donate</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-4 text-white/40 text-sm">
            <p className={theme === 'dark' ? 'text-white/40' : 'text-slate-400'} onClick={handleFooterClick}>© 2026 SoundWave Hub. Developed and Maintained with Excellence.</p>
            <div className="flex items-center gap-6">
              <span className={theme === 'dark' ? 'text-white/40' : 'text-slate-600'}>Savidya Deeman Ranasinghe</span>
              <div className="h-4 w-px bg-white/10" />
              <span className={theme === 'dark' ? 'text-white/40' : 'text-slate-600'}>Sri Lanka</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface SongCardProps {
  key?: string | number;
  song: Song;
  index: number;
  onClick: () => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  isFavorite: boolean;
  compact?: boolean;
}

function SongCard({ song, index, onClick, onFavoriteToggle, isFavorite, compact = false }: SongCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className={`glass-card group cursor-pointer border-white/5 hover:border-brand-purple/40 relative ${compact ? 'p-3' : ''}`}
      onClick={onClick}
    >
      {/* Heart Icon Toggle */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onFavoriteToggle}
        className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${
          isFavorite ? 'bg-brand-pink/20 text-brand-pink border-brand-pink/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-black/20 text-white/40 hover:text-white'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFavorite ? 'filled' : 'outline'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-brand-pink' : ''}`} />
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <div className={`relative overflow-hidden ${compact ? 'rounded-xl aspect-square' : 'aspect-square'}`}>
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-brand-purple rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(); 
            }}
          >
            <Play className={`fill-white text-white ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
          </motion.div>
        </div>
      </div>
      <div className={`${compact ? 'mt-3' : 'p-6'}`}>
        <h3 className={`font-bold truncate group-hover:text-brand-purple transition-colors ${compact ? 'text-sm' : 'text-xl'}`}>{song.title}</h3>
        <p className={`text-white/50 truncate font-medium ${compact ? 'text-xs' : 'text-sm mt-1'}`}>{song.artist}</p>
        {!compact && (
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-white/20 uppercase tracking-widest">
            <span>Official Lyric Hub</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-brand-purple" />
              <div className="w-1 h-1 rounded-full bg-brand-blue" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SongDetailPage({ song, onBack, isFavorite, onFavoriteToggle, theme }: { song: Song, onBack: () => void, isFavorite: boolean, onFavoriteToggle: (e: React.MouseEvent) => void, theme: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto"
    >
      <button 
        onClick={onBack}
        className={`flex items-center gap-2 mb-8 transition-colors group px-4 py-2 rounded-full border ${
          theme === 'dark' 
            ? 'text-white/60 hover:text-white bg-white/5 border-white/5 hover:border-brand-purple/20' 
            : 'text-slate-500 hover:text-slate-900 bg-white border-slate-200'
        }`}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Hub
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Info & Player Container */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card aspect-video relative group overflow-hidden rounded-[2rem] border-white/5 shadow-2xl bg-black">
            {song.youtubeId ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&rel=0&modestbranding=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="opacity-95 group-hover:opacity-100 transition-opacity"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                <Music className="w-24 h-24 mb-4 stroke-neutral-800" />
                <p className="font-display font-medium tracking-widest">Official Player Buffer...</p>
              </div>
            )}
          </div>

          {/* Music Visualizer Section */}
          <div className={`glass-card p-4 rounded-[2rem] border-white/5 text-center ${theme === 'dark' ? 'bg-neutral-900/50' : 'bg-slate-100'}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-brand-purple">Pulse Visualizer</p>
            <MusicVisualizer isPlaying={true} theme={theme} />
          </div>

          <div className={`glass-card p-8 md:p-12 rounded-[2.5rem] border-white/5 transition-colors ${
            theme === 'dark' ? '' : 'bg-white'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className={`text-4xl md:text-5xl font-display font-bold ${theme === 'dark' ? '' : 'text-slate-900'}`}>Song Actions</h2>
                <p className={`mt-2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Manage this track in your premium library.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onFavoriteToggle}
                  className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-semibold border ${
                    isFavorite 
                      ? 'bg-brand-pink/20 border-brand-pink/30 text-brand-pink' 
                      : (theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200')
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-brand-pink' : ''}`} /> {isFavorite ? 'Favorited' : 'Favorite'}
                </button>
                <button className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-semibold border ${
                  theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}>
                  <Share2 className="w-4 h-4" /> Share track
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Song Metadata & Ads */}
        <div className="lg:col-span-4 space-y-8">
          <div className={`glass-card p-8 rounded-[2.5rem] border-white/5 sticky top-32 transition-colors ${
            theme === 'dark' ? '' : 'bg-white'
          }`}>
            <div className="aspect-square rounded-2xl overflow-hidden mb-8 shadow-2xl group">
              <img src={song.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={song.title} />
            </div>
            
            <div className="space-y-2 mb-8 text-center md:text-left">
              <h1 className="text-3xl font-display font-bold leading-tight">{song.title}</h1>
              <p className="text-brand-purple text-xl font-medium">{song.artist}</p>
              <div className={`flex items-center justify-center md:justify-start gap-4 text-sm font-bold uppercase tracking-widest pt-2 ${
                theme === 'dark' ? 'text-white/30' : 'text-slate-400'
              }`}>
                <span className="flex items-center gap-1"><Disc className="w-3 h-3" /> Digital</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2026</span>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-4 pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
              <div className={`p-4 text-center rounded-2xl group transition-all glass-card ${theme === 'dark' ? 'hover:neon-border' : 'hover:border-brand-purple/40'}`}>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 group-hover:text-brand-purple">Plays</p>
                <p className={`text-lg font-display font-bold ${theme === 'dark' ? '' : 'text-slate-900'}`}>1.2M+</p>
              </div>
              <div className={`p-4 text-center rounded-2xl group transition-all glass-card ${theme === 'dark' ? 'hover:neon-border' : 'hover:border-brand-blue/40'}`}>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 group-hover:text-brand-blue">Rating</p>
                <p className={`text-lg font-display font-bold ${theme === 'dark' ? '' : 'text-slate-900'}`}>4.9/5</p>
              </div>
            </div>

            {/* Ad Space */}
            <div className={`mt-8 border rounded-2xl p-6 text-center group cursor-pointer transition-all ${
              theme === 'dark' ? 'bg-black/40 border-white/5 hover:bg-neutral-900/50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Ad Space: Sponsored</p>
              <div className="w-full h-24 rounded-lg flex items-center justify-center border border-dashed border-white/10 group-hover:border-brand-purple/40 transition-colors">
                <span className="text-xs text-white/20">SoundWave Premium Hub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryIcon({ name, className }: { name: string, className: string }) {
  const icons: Record<string, any> = {
    Flame, Coffee, Gamepad2, Dumbbell, CloudRain, Moon, Music, Disc
  };
  const Icon = icons[name] || Music;
  return <Icon className={className} />;
}