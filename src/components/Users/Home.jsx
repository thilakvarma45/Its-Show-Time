import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { fetchPopularMovies, searchMovies } from '../../services/tmdb';

const Home = ({ onMovieSelect, onEventSelect, user, wishlist = [], onToggleWishlist, searchQuery = '', setSearchQuery }) => {
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'latest'
  const [filterType, setFilterType] = useState('all'); // 'all', 'movies', 'events'
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trending banner state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Recommendations state
  const [recommendedMovies, setRecommendedMovies] = useState([]);

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
      {/* Filters and Sort - Below Global Header */}
      <div className="px-4 sm:px-8 py-4">
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

      {/* Trending Movies Banner Slider */}
      {trendingMovies.length > 0 && (
        <div className="relative h-[400px] sm:h-[500px] overflow-hidden mx-2.5 rounded-lg bg-slate-900" style={{ width: 'calc(100% - 20px)' }}>
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Backdrop Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${trendingMovies[currentSlide]?.backdrop})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center px-8 sm:px-16">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">
                      Trending Now
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                    {trendingMovies[currentSlide]?.title}
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base line-clamp-3 mb-6 max-w-xl">
                    {trendingMovies[currentSlide]?.overview}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{trendingMovies[currentSlide]?.rating}/5</span>
                    </div>
                    <button
                      onClick={() => onMovieSelect({ ...trendingMovies[currentSlide], type: 'movie' })}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {trendingMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 sm:px-8 py-8">
        {/* Recommended For You Section */}
        {recommendedMovies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-6">
              <Film className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-bold text-slate-900">Recommended For You</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recommendedMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onMovieSelect({ ...movie, type: 'movie' })}
                  className="flex-shrink-0 w-40 cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-medium">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{movie.genre?.slice(0, 2).join(', ')}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

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
