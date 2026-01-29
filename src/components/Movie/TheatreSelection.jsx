import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';

const TheatreSelection = ({ onTimeSelect, selectedShow, movieId }) => {
  const today = new Date();
  // Show the next 14 days so the user can book as long as shows exist in that window.
  const generatedDates = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + idx);
    return {
      id: idx + 1,
      day: d.toLocaleDateString(undefined, { weekday: 'short' }),
      date: d.getDate()
    };
  });

  const [selectedDate, setSelectedDate] = useState(selectedShow?.date?.id || generatedDates[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [theatres, setTheatres] = useState([]);

  // Load all venues and then shows per venue for the selected date
  useEffect(() => {
    const loadTheatres = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/venues');
        if (!res.ok) {
          throw new Error('Failed to load venues');
        }
        const venues = await res.json();
        const theatreVenues = venues.filter(
          (v) => (v.type || '').toString().toUpperCase() === 'THEATRE'
        );

        const today = new Date();
        const baseDate = new Date(today);
        baseDate.setDate(today.getDate() + (selectedDate - 1));
        const isoDate = baseDate.toISOString().split('T')[0];

        const withShows = await Promise.all(
          theatreVenues.map(async (venue) => {
            try {
              // Filter shows by movie ID if provided
              const url = movieId 
                ? `http://localhost:8080/api/shows/venue/${venue.id}?date=${isoDate}&movieId=${movieId}`
                : `http://localhost:8080/api/shows/venue/${venue.id}?date=${isoDate}`;
              
              const showRes = await fetch(url);
              if (!showRes.ok) {
                return { ...venue, shows: [] };
              }
              const shows = await showRes.json();
              return { ...venue, shows };
            } catch {
              return { ...venue, shows: [] };
            }
          })
        );
        setTheatres(withShows);
      } catch (err) {
        console.error('Error loading theatres/shows:', err);
        setTheatres([]);
      }
    };
    loadTheatres();
  }, [selectedDate, movieId]);

  const handleTimeClick = (theatre, show) => {
    onTimeSelect({
      showId: show.id,
      theatreId: theatre.id,
      theatreName: theatre.name,
      time: show.time,
      // pass both category prices from backend
      standardPrice: show.standardPrice,
      vipPrice: show.vipPrice,
      // fallback single price for any older consumers
      price: show.standardPrice || show.vipPrice || 0,
      date: generatedDates.find((d) => d.id === selectedDate),
    });
  };

  // Filter theatres by search query
  const filteredTheatres = theatres
    .map((theatre) => ({
      ...theatre,
      shows: Array.isArray(theatre.shows) ? theatre.shows : [],
    }))
    .filter((theatre) => {
      const matchesSearch =
        theatre.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theatre.location.toLowerCase().includes(searchQuery.toLowerCase());
      // Only keep theatres that match search AND have at least one show for this date
      return matchesSearch && theatre.shows.length > 0;
    });

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
          {generatedDates.map((date) => (
            <button
              key={date.id}
              onClick={() => setSelectedDate(date.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg border-2 transition-all ${selectedDate === date.id
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

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search theatres by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </motion.div>

      {/* Theatre List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Select Theatre & Show Time
          </h3>
          <span className="text-sm text-slate-500">
            {filteredTheatres.length} {filteredTheatres.length === 1 ? 'theatre' : 'theatres'}
          </span>
        </div>

        {filteredTheatres.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <div className="text-5xl mb-3">🎬</div>
            <h4 className="text-lg font-semibold text-slate-800 mb-1">No shows available</h4>
            <p className="text-slate-600 text-sm">
              {movieId 
                ? "This movie has not been scheduled at any theatre yet. Please check back later or try a different date."
                : "There are currently no theatres with shows available for this date."}
            </p>
          </div>
        ) : (
          filteredTheatres.map((theatre, index) => (
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
                {theatre.shows.length === 0 ? (
                  <div className="col-span-3 md:col-span-5 text-sm text-slate-500">
                    No shows scheduled for this theatre on the selected date.
                  </div>
                ) : (
                  theatre.shows.map((show) => {
                  const isSelected =
                    selectedShow?.theatreId === theatre.id &&
                    selectedShow?.time === show.time &&
                    selectedShow?.date?.id === selectedDate;

                  return (
                    <button
                      key={show.id}
                      onClick={() => handleTimeClick(theatre, show)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] ring-2 ring-blue-400 ring-offset-2'
                          : 'border-slate-300 text-slate-700 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
                        }`}
                    >
                      {show.time}
                    </button>
                  );
                  })
                )}
              </div>

              {/* Price Info (show-level pricing shown in seat selection / payment) */}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TheatreSelection;

