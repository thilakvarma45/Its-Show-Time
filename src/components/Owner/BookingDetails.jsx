import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, CheckCircle, Users, Search } from 'lucide-react';

const BookingDetails = ({ item, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTime, setFilterTime] = useState('all'); // 'all', specific time

  // Mock booking data
  const bookings = [
    { id: 'BK001', userName: 'Rajesh Kumar', seats: ['A1', 'A2'], date: '2024-03-15', time: '7:00 PM', status: 'confirmed' },
    { id: 'BK002', userName: 'Priya Sharma', seats: ['B5', 'B6', 'B7'], date: '2024-03-15', time: '7:00 PM', status: 'confirmed' },
    { id: 'BK003', userName: 'Amit Patel', seats: ['C10'], date: '2024-03-15', time: '7:00 PM', status: 'confirmed' },
    { id: 'BK004', userName: 'Sneha Reddy', seats: ['D3', 'D4'], date: '2024-03-15', time: '10:00 PM', status: 'confirmed' },
    { id: 'BK005', userName: 'Vikram Singh', seats: ['E8', 'E9'], date: '2024-03-16', time: '4:00 PM', status: 'confirmed' },
    { id: 'BK006', userName: 'Ananya Desai', seats: ['F1', 'F2', 'F3', 'F4'], date: '2024-03-16', time: '7:00 PM', status: 'confirmed' },
  ];

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    // Filter by search query (ID or Name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.id.toLowerCase().includes(query) ||
        booking.userName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Group bookings by date and time
  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const key = `${booking.date} ${booking.time}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {});

  // Get unique times for filter
  const uniqueTimes = [...new Set(bookings.map(b => b.time))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Listings</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <img
            src={item.poster}
            alt={item.title}
            className="w-24 h-32 sm:w-32 sm:h-44 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{item.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.type === 'movie' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {item.type === 'movie' ? 'Movie' : 'Event'}
              </span>
            </div>
            {item.type === 'movie' && (
              <p className="text-slate-600 mb-4 text-sm sm:text-base">{item.genre.join(', ')} • {item.duration}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{bookings.length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Seats</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {bookings.reduce((sum, b) => sum + b.seats.length, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">₹{(bookings.length * 350).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Booking ID or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Bookings by Show Time */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4">🎫</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No bookings found</h3>
          <p className="text-slate-600">Try adjusting your search</p>
        </div>
      ) : (
        <div className="space-y-6">
        {Object.entries(groupedBookings).map(([showTime, showBookings], index) => (
          <motion.div
            key={showTime}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">{showTime.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">{showTime.split(' ').slice(1).join(' ')}</span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">{showBookings.length} bookings</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {showBookings.map((booking, idx) => (
                <div
                  key={booking.id}
                  className="px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-24">
                        <p className="text-xs text-slate-500 mb-1">Booking ID</p>
                        <p className="font-mono font-bold text-slate-800">{booking.id}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Customer Name</p>
                        <p className="font-semibold text-slate-800">{booking.userName}</p>
                      </div>
                      <div className="w-48">
                        <p className="text-xs text-slate-500 mb-1">Seats</p>
                        <div className="flex flex-wrap gap-1">
                          {booking.seats.map(seat => (
                            <span
                              key={seat}
                              className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-24 flex justify-end">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-bold">Okay</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Booking ID</p>
                        <p className="font-mono font-bold text-slate-800 text-sm">{booking.id}</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-bold">Okay</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Customer Name</p>
                      <p className="font-semibold text-slate-800">{booking.userName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Seats</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.map(seat => (
                          <span
                            key={seat}
                            className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
