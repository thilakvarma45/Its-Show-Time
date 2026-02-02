import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

const MovieCard = ({ item, onClick, onToggleWishlist, isInWishlist }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-[180px] group cursor-pointer relative"
            onClick={() => onClick(item)}
        >
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">

                {/* Wishlist Toggle Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist({ ...item });
                    }}
                    className={`absolute top-2 left-2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isInWishlist
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-black/50 text-white hover:bg-red-500'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-white' : ''}`} />
                </button>

                <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                        {item.rating && (
                            <>
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-xs">{item.rating}</span>
                            </>
                        )}
                    </div>
                    <div className="w-full py-2 bg-violet-600 text-white text-xs font-semibold rounded text-center">
                        Book Now
                    </div>
                </div>
            </div>

            <h4 className="mt-2 text-slate-800 font-medium text-sm truncate">{item.title}</h4>
            <p className="text-slate-500 text-xs truncate">
                {item.type === 'event' ? item.venue : (Array.isArray(item.genre) ? item.genre.slice(0, 2).join(', ') : item.genre)}
            </p>
        </motion.div>
    );
};

export default MovieCard;
