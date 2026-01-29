import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Ticket } from 'lucide-react';

const MyBookings = ({ user, onBack }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        if (!user?.id) {
          setBookings([]);
          return;
        }
        const res = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`);
        if (!res.ok) {
          throw new Error('Failed to load bookings');
        }
        const data = await res.json();

        // Map backend bookings into a UI-friendly shape
        const normalized = data.map(b => ({
          id: b.id,
          type: b.type === 'EVENT' ? 'event' : 'movie',
          title: b.show?.schedule?.tmdbMovieId
            ? `Movie #${b.show.schedule.tmdbMovieId}`
            : b.event?.title || 'Booking',
          poster: b.event?.posterUrl || 'https://via.placeholder.com/300x450?text=Ticket',
          date: b.bookedAt?.substring(0, 10),
          time: '',
          venue: b.show?.venue?.name || b.event?.venue?.name || 'Venue',
          seats: [], // could be derived from bookingDetails JSON in future
          price: b.totalAmount,
          status: b.status?.toLowerCase() || 'confirmed',
        }));

        setBookings(normalized);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setBookings([]);
      }
    };
    loadBookings();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-black px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          My Bookings
        </h1>
        <p className="text-white/60 text-sm sm:text-base">
          View and manage your reservations
        </p>
      </motion.div>

      {/* Bookings List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
          >
            <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-white/60">Start exploring movies and events to make your first booking!</p>
          </motion.div>
        ) : (
          bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={booking.poster}
                    alt={booking.title}
                    className="w-full sm:w-32 h-48 sm:h-44 object-cover rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">{booking.title}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full uppercase">
                        {booking.status}
                      </span>
                    </div>
                    <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
                      {booking.type === 'movie' ? 'Movie' : 'Event'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-sm">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-sm">{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4 text-white/60" />
                      <span className="text-sm">{booking.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Ticket className="w-4 h-4 text-white/60" />
                      <span className="text-sm">{booking.seats.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-white">₹{booking.price}</p>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                      View Ticket
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
