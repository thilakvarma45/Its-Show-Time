import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { EVENTS } from '../../data/mockData';
import { fetchPopularMovies, searchMovies } from '../../services/tmdb';

const Home = ({ onMovieSelect, onEventSelect, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'latest'
  const [filterType, setFilterType] = useState('all'); // 'all', 'movies', 'events'
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from TMDB on mount and when search query changes
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (searchQuery.trim() && filterType !== 'events') {
          // Search movies if there's a query
          result = await searchMovies(searchQuery);
        } else if (filterType !== 'events') {
          // Load popular movies by default
          result = await fetchPopularMovies(1);
        } else {
          // If filtering by events only, don't fetch movies
          setMovies([]);
          setLoading(false);
          return;
        }
        setMovies(result.movies);
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Failed to load movies. Please try again later.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      loadMovies();
    }, searchQuery.trim() ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterType]);

  // Combine and filter items
  const allItems = [
    ...movies.map(m => ({ ...m, type: 'movie' })),
    ...EVENTS.map(e => ({ ...e, type: 'event' }))
  ];

  const filteredItems = allItems
    .filter(item => {
      // Filter by type
      if (filterType === 'movies' && item.type !== 'movie') return false;
      if (filterType === 'events' && item.type !== 'event') return false;
      
      // If searching and filter is movies, TMDB search already handled it
      // But we still filter events locally if needed
      if (searchQuery && item.type === 'event') {
        return item.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'rating' && a.rating && b.rating) {
        return b.rating - a.rating;
      } else if (sortBy === 'latest' && a.releaseDate && b.releaseDate) {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-cinema-light px-4 sm:px-8 py-10 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 tracking-widest uppercase">
          Its Show Time
        </h1>
        <p className="text-slate-600 text-lg">
          {user?.name ? `Welcome back, ${user.name}.` : 'Discover Your Next Experience'}
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search movies and events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Filter:</span>
          </div>
          
          {/* Type Filter */}
          <div className="flex gap-2">
            {['all', 'movies', 'events'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterType === type
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-300 mx-2" />

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            >
              <option value="name">Name (A-Z)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="latest">Latest First</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="ml-auto text-sm text-slate-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
          </div>
        </div>
      </motion.div>

      {/* Mixed Grid - Movies & Events */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="w-12 h-12 animate-spin text-violet-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Loading movies...</h3>
          <p className="text-slate-600">Fetching the latest from TMDB</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Error loading movies</h3>
          <p className="text-slate-600">{error}</p>
        </motion.div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No results found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => item.type === 'movie' ? onMovieSelect(item) : onEventSelect(item)}
            >
              <div className="relative overflow-hidden rounded-lg bg-white transition-transform duration-300 hover:scale-105 shadow-lg">
                {/* Event Badge */}
                {item.type === 'event' && (
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Event
                  </div>
                )}
                
                {/* Poster with layoutId for shared element transition */}
                <motion.img
                  layoutId={`poster-${item.id}`}
                  src={item.poster}
                  alt={item.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  {item.type === 'movie' ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm">{item.rating}</span>
                        <span className="text-slate-300 text-sm">• {item.duration}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {item.genre.map((g) => (
                          <span
                            key={g}
                            className="text-xs px-2 py-1 bg-blue-600/30 text-blue-300 rounded"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-purple-300" />
                        <span className="text-white text-sm">{item.venue}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-purple-600/30 text-purple-300 rounded">
                          Live Event
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Info below poster */}
              <div className="mt-3">
                <h3 className="text-slate-900 font-semibold text-sm truncate">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  {item.type === 'movie' ? item.genre.join(', ') : item.venue}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Home;

