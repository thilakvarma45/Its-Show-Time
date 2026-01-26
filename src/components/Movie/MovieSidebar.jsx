import { motion } from 'framer-motion';
import { Star, Clock, ArrowLeft } from 'lucide-react';

const MovieSidebar = ({ movie, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full bg-white p-6 flex flex-col overflow-y-auto"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back to Movies</span>
      </button>

      {/* Spacer to push content down below booking steps bar */}
      <div className="h-32"></div>

      {/* Poster with shared element transition */}
      <motion.img
        layoutId={`poster-${movie.id}`}
        src={movie.poster}
        alt={movie.title}
        className="w-full max-w-[240px] mx-auto rounded-lg shadow-xl mb-5"
      />

      {/* Movie Details */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
          {movie.title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(movie.rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-slate-300'
              }`}
            />
          ))}
          <span className="text-slate-900 ml-2 font-semibold">{movie.rating}</span>
        </div>

        {/* Genre Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {movie.genre.map((g) => (
            <span
              key={g}
              className="px-3 py-1 bg-blue-600/20 text-blue-700 rounded-full text-sm border border-blue-600/30"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-5 h-5" />
          <span>{movie.duration}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieSidebar;

