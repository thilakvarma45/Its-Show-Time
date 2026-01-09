import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';

const VenueSelection = ({ event, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date.id);
    onDateSelect({
      dateId: date.id,
      dateLabel: date.label,
      venue: event.venue,
      address: event.address
    });
  };

  return (
    <div className="space-y-6">
      {/* Venue Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 border border-slate-200 shadow-md"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-1 uppercase tracking-wide">
              {event.venue}
            </h3>
            <p className="text-slate-600 text-sm">{event.address}</p>
          </div>
        </div>
      </motion.div>

      {/* Date/Time Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-slate-900 font-semibold uppercase tracking-wider text-sm">
            Select Show
          </h3>
        </div>

        <div className="space-y-3">
          {event.dates.map((date, index) => (
            <motion.button
              key={date.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleDateClick(date)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedDate === date.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-purple-500'
              }`}
            >
              <div className="font-semibold text-lg">{date.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueSelection;

