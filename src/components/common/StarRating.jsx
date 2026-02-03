import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StarRating = ({
    rating = 0,
    onRate,
    readonly = false,
    size = 'md', // sm, md, lg
    showLabel = false,
    className = ''
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10'
    };

    const handleMouseEnter = (index) => {
        if (!readonly) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    const handleClick = (index) => {
        if (!readonly && onRate) {
            onRate(index);
        }
    };

    const currentRating = hoverRating || rating;

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                        key={star}
                        whileHover={!readonly ? { scale: 1.2 } : {}}
                        whileTap={!readonly ? { scale: 0.9 } : {}}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'} outline-none focus:outline-none`}
                        type="button"
                    >
                        <Star
                            className={`${sizes[size]} transition-all duration-200 ${star <= currentRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-transparent text-slate-300'
                                } ${hoverRating > 0 && star <= hoverRating ? 'drop-shadow-md' : ''}`}
                            strokeWidth={star <= currentRating ? 0 : 1.5}
                        />
                    </motion.button>
                ))}
            </div>

            {showLabel && (
                <AnimatePresence mode="wait">
                    {readonly ? (
                        <motion.span
                            key="static-rating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium text-slate-800"
                        >
                            {rating > 0 ? `${rating.toFixed(1)}/5` : 'No ratings yet'}
                        </motion.span>
                    ) : (
                        <motion.span
                            key="interactive-rating"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm font-medium text-slate-600 h-5"
                        >
                            {hoverRating > 0
                                ? ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][hoverRating - 1]
                                : (rating > 0 ? 'Your rating' : 'Rate this')}
                        </motion.span>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default StarRating;
