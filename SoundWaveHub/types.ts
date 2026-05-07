export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  youtubeId?: string;
  lyrics?: string;
  trending?: boolean;
  category?: string;
  isRecent?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
}

export const TRENDING_SONGS: Song[] = [
  {
    id: '1',
    title: 'Starboy',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
    youtubeId: '34Na4j8AVgA',
    trending: true,
    category: 'pop'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
    youtubeId: 'fHI8X4OXW-Q',
    trending: true,
    category: 'pop'
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&q=80',
    youtubeId: 'TUVcZfQe-Kw',
    trending: true,
    category: 'pop'
  },
  {
    id: '4',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    youtubeId: 'kTJczUoc26U',
    trending: true,
    category: 'pop'
  },
  {
    id: '5',
    title: 'Enemy',
    artist: 'Imagine Dragons',
    coverUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80',
    youtubeId: 'D9G1VOjgm_8',
    trending: true,
    category: 'gaming'
  },
  {
    id: '6',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    coverUrl: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?w=800&q=80',
    youtubeId: 'mRD0-GxqHVo',
    isRecent: true,
    category: 'chill'
  },
  {
    id: '7',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee8a81690db?w=800&q=80',
    youtubeId: 'XXYlFuWEuKI',
    isRecent: true,
    category: 'pop'
  },
  {
    id: '8',
    title: 'Peaches',
    artist: 'Justin Bieber',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    youtubeId: 'tQ0yjYUFKAE',
    isRecent: true,
    category: 'chill'
  }
];

export const POPULAR_ARTISTS: Artist[] = [
  { id: '1', name: 'The Weeknd', genre: 'R&B / Pop', imageUrl: 'https://images.unsplash.com/photo-1520529011850-be1970223c71?w=400&h=400&fit=crop' },
  { id: '2', name: 'Dua Lipa', genre: 'Pop / Dance', imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop' },
  { id: '3', name: 'Imagine Dragons', genre: 'Alt Rock', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: '4', name: 'Justin Bieber', genre: 'Pop', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' }
];

export const CATEGORIES = [
  { id: 'trending', name: 'Trending', icon: 'Flame' },
  { id: 'chill', name: 'Chill', icon: 'Coffee' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'workout', name: 'Workout', icon: 'Dumbbell' },
  { id: 'sad', name: 'Sad Songs', icon: 'CloudRain' },
  { id: 'relaxing', name: 'Relaxing', icon: 'Moon' },
  { id: 'pop', name: 'Pop', icon: 'Music' },
  { id: 'classics', name: 'Classics', icon: 'Disc' }
];
