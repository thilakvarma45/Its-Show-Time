import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { THEATRES, DATES } from '../../data/mockData';

const TheatreSelection = ({ onTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState(DATES[0].id);

  const handleTimeClick = (theatre, time) => {
    onTimeSelect({
      theatreId: theatre.id,
      theatreName: theatre.name,
      time: time,
      price: theatre.price,
      date: DATES.find(d => d.id === selectedDate)
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Strip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-4 shadow-md"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-slate-900 font-semibold uppercase tracking-wider text-sm">
            Select Date
          </h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {DATES.map((date) => (
            <button
              key={date.id}
              onClick={() => setSelectedDate(date.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg border-2 transition-all ${
                selectedDate === date.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-slate-300 text-slate-600 hover:border-blue-500'
              }`}
            >
              <div className="text-sm font-semibold">{date.day}</div>
              <div className="text-2xl font-bold">{date.date}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Theatre List */}
      <div className="space-y-4">
        <h3 className="text-slate-900 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Select Theatre & Show Time
        </h3>

        {THEATRES.map((theatre, index) => (
          <motion.div
            key={theatre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 border border-slate-200 hover:border-blue-500 transition-colors shadow-md"
          >
            {/* Theatre Info */}
            <div className="mb-4">
              <h4 className="text-slate-900 text-xl font-bold uppercase tracking-wide mb-1">
                {theatre.name}
              </h4>
              <p className="text-slate-600 text-sm">{theatre.location}</p>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {theatre.times.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(theatre, time)}
                  className="px-4 py-3 rounded-lg border-2 border-slate-300 text-slate-700 
                           hover:border-blue-600 hover:bg-blue-600 hover:text-white 
                           transition-all font-medium text-sm"
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Price Info */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <span className="text-slate-600 text-sm">Price: </span>
              <span className="text-slate-900 font-semibold">${theatre.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TheatreSelection;

