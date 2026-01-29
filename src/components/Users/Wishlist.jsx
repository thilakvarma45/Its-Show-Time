import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, Calendar, Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const Wishlist = ({ user, wishlist = [], onBack, onMovieSelect, onEventSelect, onRemoveFromWishlist }) => {

  const handleRemove = (id, type) => {
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(id, type);
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'movie') {
      onMovieSelect(item);
    } else {
      onEventSelect(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-white px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            My Wishlist
          </h1>
        </div>
        <p className="text-slate-500 text-sm sm:text-base">
          Movies and events you want to watch
        </p>
      </motion.div>

      {/* Wishlist Grid */}
      <div className="max-w-6xl mx-auto">
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg"
          >
            <EmptyState
              icon={<Heart className="text-slate-300" />}
              title="Your wishlist is empty"
              description="Add movies and events to your wishlist to keep track of what you want to watch!"
              action={
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Movies & Events
                </button>
              }
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white backdrop-blur-xl border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-xl transition-all shadow-md"
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id, item.type);
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-slate-800/70 hover:bg-red-600 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>

                {/* Type Badge */}
                {item.type === 'event' && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full uppercase">
                    Event
                  </div>
                )}

                {/* Poster */}
                <div
                  className="cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-slate-800 font-semibold text-base mb-2 line-clamp-1">
                    {item.title}
                  </h3>

                  {item.type === 'movie' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-700 text-sm">{item.rating}</span>
                        <span className="text-slate-500 text-sm">• {item.duration}</span>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-1">
                        {item.genre.join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm">{item.date}</span>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-1">{item.venue}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleItemClick(item)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
