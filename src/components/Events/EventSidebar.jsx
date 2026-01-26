import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';

const EventSidebar = ({ event, onBack }) => {
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
        <span className="text-sm">Back to Events</span>
      </button>

      {/* Spacer to push content down below booking steps bar */}
      <div className="h-32"></div>

      {/* Poster with shared element transition */}
      <motion.img
        layoutId={`poster-${event.id}`}
        src={event.poster}
        alt={event.title}
        className="w-full max-w-[240px] mx-auto rounded-lg shadow-xl mb-5"
      />

      {/* Event Details */}
      <div className="flex-1">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full uppercase tracking-wide mb-3">
            Live Event
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
          {event.title}
        </h2>

        {/* Venue Info */}
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <div className="text-slate-600 text-sm font-semibold mb-1">{event.venue}</div>
            <div className="text-slate-500 text-xs">{event.address}</div>
          </div>
        </div>

        {/* Dates Available */}
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <div className="text-slate-600 text-sm font-semibold mb-2">Available Dates</div>
            <div className="space-y-1">
              {event.dates.map((date) => (
                <div key={date.id} className="text-slate-500 text-xs">
                  {date.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventSidebar;

