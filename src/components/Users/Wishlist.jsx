import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, Calendar, Trash2, MapPin, Ticket } from 'lucide-react';
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <button
              onClick={onBack}
              className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors mb-6"
            >
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-400 group-hover:bg-slate-50 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              My Wishlist
              <span className="text-rose-500 ml-1">.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Your curated list of movies and events to watch.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-4xl font-black text-slate-900">{wishlist.length}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Saved Items</div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="min-h-[400px]">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-rose-300 fill-rose-100" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
              <p className="text-slate-500 max-w-md text-center mb-8">
                Looks like you haven't saved anything yet. Explore movies and events to build your personal collection!
              </p>
              <button
                onClick={onBack}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black hover:-translate-y-1 transition-all shadow-lg"
              >
                Start Exploring
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {wishlist.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemAnim}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  {/* Poster Image */}
                  <div className="aspect-[2/3] relative overflow-hidden bg-slate-100">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Top Actions */}
                    <div className="absolute top-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.id, item.type);
                        }}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hover Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                      <button
                        onClick={() => handleItemClick(item)}
                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-rose-50 transition-colors shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                      {item.type}
                    </div>
                  </div>

                  {/* Info Section (Visible always) */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors item-title" title={item.title}>
                      {item.title}
                    </h3>

                    {item.type === 'movie' ? (
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-slate-700">{item.rating}</span>
                        </div>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{item.duration}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                        <span className="text-slate-300">|</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{item.venue}</span>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-50 flex flex-wrap gap-2">
                      {item.genre && item.genre.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
