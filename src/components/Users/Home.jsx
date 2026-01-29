import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Search, SlidersHorizontal, Loader2, Heart } from 'lucide-react';
import { fetchPopularMovies, searchMovies } from '../../services/tmdb';

const Home = ({ onMovieSelect, onEventSelect, user, wishlist = [], onToggleWishlist, searchQuery = '', setSearchQuery }) => {
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'latest'
  const [filterType, setFilterType] = useState('all'); // 'all', 'movies', 'events'
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
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

  // Load events from backend once
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/events');
        if (!res.ok) {
          throw new Error('Failed to load events');
        }
        const data = await res.json();
        // Basic summary; full dates/zones will be fetched on selection
        const normalized = data.map(e => ({
          id: e.id,
          type: 'event',
          title: e.title,
          poster: e.posterUrl,
          venue: e.venue?.name || e.address || 'Event venue',
          address: e.address,
        }));
        setEvents(normalized);
      } catch (err) {
        console.error('Error loading events:', err);
        setEvents([]);
      }
    };
    loadEvents();
  }, []);

  // Combine and filter items
  const allItems = [
    ...movies.map(m => ({ ...m, type: 'movie' })),
    ...events
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
    <div className="min-h-screen bg-cinema-light">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies or events..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="text-2xl font-light">×</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filters and Sort - Below Search */}
      <div className="px-4 sm:px-8 py-4 bg-white border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3"
        >
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
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === type
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
        </motion.div>
      </div>

      <div className="px-4 sm:px-8 py-8">
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

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist({ ...item, type: item.type });
                    }}
                    className={`absolute top-2 left-2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${wishlist.some(w => w.id === item.id && w.type === item.type)
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-black/50 text-white hover:bg-red-500'
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${wishlist.some(w => w.id === item.id && w.type === item.type)
                        ? 'fill-white'
                        : ''
                        }`}
                    />
                  </button>

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
    </div>
  );
};

export default Home;
