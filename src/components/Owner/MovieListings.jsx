import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Calendar, ChevronRight, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { EVENTS } from '../../data/mockData';
import { fetchPopularMovies, searchMovies } from '../../services/tmdb';

const MovieListings = ({ onSelectShow }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'movies', 'events'
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from TMDB on mount and when search query changes
  useEffect(() => {
    const loadMovies = async () => {
      if (filterType === 'events') {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let result;
        if (searchQuery.trim()) {
          // Search movies if there's a query
          result = await searchMovies(searchQuery);
        } else {
          // Load popular movies by default
          result = await fetchPopularMovies(1);
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

  const allListings = [
    ...movies.map(m => ({ ...m, type: 'movie' })),
    ...EVENTS.map(e => ({ ...e, type: 'event' }))
  ];

  // Filter listings
  const filteredListings = allListings.filter(item => {
    // Filter by type
    if (filterType === 'movies' && item.type !== 'movie') return false;
    if (filterType === 'events' && item.type !== 'event') return false;
    
    // If searching and filter is movies, TMDB search already handled it
    // But we still filter events locally if needed
    if (searchQuery && item.type === 'event') {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">Active Listings</h2>
        <p className="text-sm sm:text-base text-slate-600">Manage your movies and events</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
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
          </div>
          <span className="text-sm text-slate-500">
            {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-12 h-12 animate-spin text-violet-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Loading movies...</h3>
          <p className="text-slate-600">Fetching the latest from TMDB</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Error loading movies</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No listings found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredListings.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
            onClick={() => onSelectShow(item)}
          >
            <div className="relative">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                  item.type === 'movie' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {item.type === 'movie' ? 'Movie' : 'Event'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                {item.title}
              </h3>
              
              {item.type === 'movie' ? (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="line-clamp-1">{item.genre.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="line-clamp-1">{item.venue}</span>
                  </div>
                </div>
              )}

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5 sm:mb-1">Total Bookings</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-800">
                    {Math.floor(Math.random() * 500) + 100}
                  </p>
                </div>
                <button className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-semibold text-violet-600 group-hover:gap-1.5 sm:group-hover:gap-2 transition-all">
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieListings;
