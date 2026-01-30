import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, SlidersHorizontal, Loader2, Heart, ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import { fetchPopularMovies, searchMovies, fetchTrendingMovies, getMovieRecommendations } from '../../services/tmdb';

const Home = ({ onMovieSelect, onEventSelect, user, wishlist = [], onToggleWishlist, searchQuery = '', setSearchQuery }) => {
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'latest'
  const [filterType, setFilterType] = useState('all'); // 'all', 'movies', 'events'
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trending banner state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerLoading, setBannerLoading] = useState(true);

  // Recommended movies state
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

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

  // Fetch trending movies for banner
  useEffect(() => {
    const loadTrendingMovies = async () => {
      setBannerLoading(true);
      try {
        const trending = await fetchTrendingMovies();
        setTrendingMovies(trending);
      } catch (err) {
        console.error('Error loading trending movies:', err);
        setTrendingMovies([]);
      } finally {
        setBannerLoading(false);
      }
    };
    loadTrendingMovies();
  }, []);

  // Compute banner items based on filter type
  const bannerItems = filterType === 'events'
    ? events.slice(0, 5).map(e => ({
      id: e.id,
      title: e.title,
      overview: 'An exciting live event awaits you!',
      rating: null,
      backdrop: e.poster,
      poster: e.poster,
      venue: e.venue,
      type: 'event'
    }))
    : trendingMovies.map(m => ({ ...m, type: 'movie' }));

  // Reset banner index when filter changes
  useEffect(() => {
    setCurrentBannerIndex(0);
  }, [filterType]);

  // Auto-transition banner every 5 seconds
  useEffect(() => {
    if (bannerItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerItems.length]);

  // Banner navigation handlers
  const goToPrevBanner = useCallback(() => {
    setCurrentBannerIndex((prev) =>
      prev === 0 ? bannerItems.length - 1 : prev - 1
    );
  }, [bannerItems.length]);

  const goToNextBanner = useCallback(() => {
    setCurrentBannerIndex((prev) =>
      (prev + 1) % bannerItems.length
    );
  }, [bannerItems.length]);

  // Store search history when user searches and fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecommendedLoading(true);
      try {
        if (filterType === 'events') {
          // For events filter, show other events as recommendations
          const eventRecs = events.slice(0, 8).map(e => ({
            id: e.id,
            title: e.title,
            poster: e.poster,
            venue: e.venue,
            type: 'event'
          }));
          setRecommendedMovies(eventRecs);
        } else {
          // For movies/all filter, use movie recommendations
          const searchHistory = JSON.parse(localStorage.getItem('movieSearchHistory') || '[]');

          if (searchHistory.length > 0) {
            // Get last searched movie ID and fetch recommendations
            const lastMovieId = searchHistory[searchHistory.length - 1];
            const recommendations = await getMovieRecommendations(lastMovieId);
            setRecommendedMovies(recommendations.map(m => ({ ...m, type: 'movie' })));
          } else if (trendingMovies.length > 0) {
            // Fallback: use first trending movie for recommendations
            const recommendations = await getMovieRecommendations(trendingMovies[0].id);
            setRecommendedMovies(recommendations.map(m => ({ ...m, type: 'movie' })));
          }
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setRecommendedMovies([]);
      } finally {
        setRecommendedLoading(false);
      }
    };

    // Only fetch if we have trending movies loaded (as fallback) or events loaded
    if (!bannerLoading || (filterType === 'events' && events.length > 0)) {
      fetchRecommendations();
    }
  }, [bannerLoading, trendingMovies, filterType, events]);

  // Save movie to search history when clicked
  const handleMovieClick = useCallback((movie) => {
    // Store in search history
    const searchHistory = JSON.parse(localStorage.getItem('movieSearchHistory') || '[]');
    // Add to history if not already there, keep last 10 movies
    const filtered = searchHistory.filter(id => id !== movie.id);
    filtered.push(movie.id);
    localStorage.setItem('movieSearchHistory', JSON.stringify(filtered.slice(-10)));

    // Call the original handler
    onMovieSelect(movie);
  }, [onMovieSelect]);

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
      {/* Filters and Sort */}
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

      {/* Trending Banner Carousel */}
      {!bannerLoading && bannerItems.length > 0 && (
        <div className="px-4 sm:px-8 py-4">
          <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden bg-black rounded-2xl">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentBannerIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                {/* Backdrop Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${bannerItems[currentBannerIndex]?.backdrop || bannerItems[currentBannerIndex]?.poster})`
                  }}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="max-w-2xl"
                    >
                      {/* Badge - different for movies vs events */}
                      <div className="flex items-center gap-2 mb-4">
                        {bannerItems[currentBannerIndex]?.type === 'event' ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">🎭 Featured Event</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                              <span className="text-white text-xs font-bold uppercase tracking-wider">🔥 Trending Now</span>
                            </div>
                            {bannerItems[currentBannerIndex]?.rating && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-sm font-semibold">{bannerItems[currentBannerIndex]?.rating}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {bannerItems[currentBannerIndex]?.title}
                      </h2>

                      {/* Overview / Venue */}
                      <p className="text-slate-200 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-6 leading-relaxed">
                        {bannerItems[currentBannerIndex]?.type === 'event'
                          ? `📍 ${bannerItems[currentBannerIndex]?.venue || 'Venue details available on booking'}`
                          : bannerItems[currentBannerIndex]?.overview}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            if (bannerItems[currentBannerIndex]?.type === 'event') {
                              onEventSelect({ id: bannerItems[currentBannerIndex]?.id });
                            } else {
                              handleMovieClick({ id: bannerItems[currentBannerIndex]?.id, title: bannerItems[currentBannerIndex]?.title });
                            }
                          }}
                          className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all shadow-lg hover:scale-105 ${bannerItems[currentBannerIndex]?.type === 'event'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-purple-500/30'
                            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hover:shadow-violet-500/30'
                            }`}
                        >
                          <Play className="w-5 h-5 fill-white" />
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={goToNextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {bannerItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`transition-all duration-300 ${index === currentBannerIndex
                    ? 'w-8 h-2 bg-white rounded-full'
                    : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner Loading Skeleton */}
      {bannerLoading && (
        <div className="px-4 sm:px-8 py-4">
          <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-gradient-to-r from-slate-800 to-slate-700 animate-pulse flex items-center justify-center rounded-2xl">
            <Loader2 className="w-10 h-10 animate-spin text-white/50" />
          </div>
        </div>
      )}

      {/* Recommended Movies Section */}
      {recommendedMovies.length > 0 && !recommendedLoading && (
        <div className="px-4 sm:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${filterType === 'events'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}>
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">
                  {filterType === 'events' ? 'Featured Events' : 'Recommended For You'}
                </span>
              </div>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {recommendedMovies.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0 w-[180px] group cursor-pointer"
                    onClick={() => item.type === 'event' ? onEventSelect(item) : handleMovieClick(item)}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      {/* Poster */}
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-full aspect-[2/3] object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-4xl">🎭</span>
                        </div>
                      )}

                      {/* Badge - Rating for movies, Event label for events */}
                      {item.type === 'event' ? (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                          <span className="text-white text-xs font-semibold">Event</span>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-xs font-semibold">{item.rating}</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <button className={`w-full py-2 text-white text-sm font-semibold rounded-lg transition-all ${item.type === 'event'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
                          }`}>
                          Book Now
                        </button>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <h4 className="mt-2 text-slate-800 font-medium text-sm truncate">{item.title}</h4>
                    <p className="text-slate-500 text-xs">
                      {item.type === 'event' ? item.venue : item.genre?.slice(0, 2).join(' • ')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Recommended Loading Skeleton */}
      {recommendedLoading && (
        <div className="px-4 sm:px-8 py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-48 h-8 bg-slate-200 rounded-full animate-pulse" />
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[180px]">
                <div className="w-full aspect-[2/3] bg-slate-200 rounded-xl animate-pulse" />
                <div className="mt-2 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="mt-1 h-3 w-20 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

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
                onClick={() => item.type === 'movie' ? handleMovieClick(item) : onEventSelect(item)}
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
