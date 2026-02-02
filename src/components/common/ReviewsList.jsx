import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, User, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ReviewsList = ({ isOpen, onClose, reviews, title }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Reviews</h3>
                            <p className="text-sm text-slate-500 mt-1">{title}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <p>No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{review.userName || 'Anonymous'}</span>
                                        </div>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 text-sm leading-relaxed">
                                        {review.review}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewsList;
