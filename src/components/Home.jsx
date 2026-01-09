import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';
import { MOVIES, EVENTS } from '../data/mockData';

const Home = ({ onMovieSelect, onEventSelect, user }) => {
  return (
    <div className="min-h-screen bg-cinema-light px-4 sm:px-8 py-10 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 tracking-widest uppercase">
          CineVerse
        </h1>
        <p className="text-slate-600 text-lg">
          {user?.name ? `Welcome back, ${user.name}.` : 'Discover Your Next Experience'}
        </p>
        {user?.role && (
          <p className="text-sm uppercase tracking-wide text-slate-500 mt-1">
            {user.role === 'owner' ? 'Producer / Director Mode' : 'Audience / Movie Lover Mode'}
          </p>
        )}
      </motion.div>

      {/* Mixed Grid - Movies & Events */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 sm:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Movies */}
        {MOVIES.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => onMovieSelect(movie)}
          >
            <div className="relative overflow-hidden rounded-lg bg-white transition-transform duration-300 hover:scale-105 shadow-lg">
              {/* Poster with layoutId for shared element transition */}
              <motion.img
                layoutId={`poster-${movie.id}`}
                src={movie.poster}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg mb-2">{movie.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm">{movie.rating}</span>
                  <span className="text-slate-300 text-sm">• {movie.duration}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-1 bg-blue-600/30 text-blue-300 rounded"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Info below poster */}
            <div className="mt-3">
              <h3 className="text-slate-900 font-semibold text-sm truncate">
                {movie.title}
              </h3>
              <p className="text-slate-600 text-xs mt-1">{movie.genre.join(', ')}</p>
            </div>
          </motion.div>
        ))}

        {/* Events */}
        {EVENTS.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (MOVIES.length + index) * 0.1 }}
            className="group cursor-pointer"
            onClick={() => onEventSelect(event)}
          >
            <div className="relative overflow-hidden rounded-lg bg-white transition-transform duration-300 hover:scale-105 shadow-lg">
              {/* Event Badge */}
              <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                Event
              </div>
              
              {/* Poster with layoutId for shared element transition */}
              <motion.img
                layoutId={`poster-${event.id}`}
                src={event.poster}
                alt={event.title}
                className="w-full aspect-[2/3] object-cover"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">{event.venue}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-purple-600/30 text-purple-300 rounded">
                    Live Event
                  </span>
                </div>
              </div>
            </div>

            {/* Info below poster */}
            <div className="mt-3">
              <h3 className="text-slate-900 font-semibold text-sm truncate">
                {event.title}
              </h3>
              <p className="text-slate-600 text-xs mt-1">{event.venue}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;

