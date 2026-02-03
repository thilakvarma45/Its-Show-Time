import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, CheckCircle, Users, Search } from 'lucide-react';

const BookingDetails = ({ item, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTime, setFilterTime] = useState('all'); // placeholder for future backend-based filter
  const [bookings, setBookings] = useState([]);
  const [eventZoneNameById, setEventZoneNameById] = useState({});
  const [eventDatesById, setEventDatesById] = useState({});

  // If this is an event, load its eventConfig once so we can show Zone NAME instead of zoneId.
  useEffect(() => {
    const loadEventZones = async () => {
      if (item?.type !== 'event' || !item?.id) {
        setEventZoneNameById({});
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/events/${item.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error('Failed to load event details');
        }
        const full = await res.json();
        let parsed = {};
        try {
          parsed = full?.eventConfig ? JSON.parse(full.eventConfig) : {};
        } catch {
          parsed = {};
        }

        const zones = Array.isArray(parsed?.zones) ? parsed.zones : [];
        const zoneMap = zones.reduce((acc, z) => {
          if (z?.id) acc[String(z.id)] = z?.name || String(z.id);
          return acc;
        }, {});
        setEventZoneNameById(zoneMap);

        const dates = Array.isArray(parsed?.dates) ? parsed.dates : [];
        const dateMap = dates.reduce((acc, d) => {
          if (d?.id) acc[String(d.id)] = { date: d.date, time: d.time };
          return acc;
        }, {});
        setEventDatesById(dateMap);

      } catch (e) {
        console.error('Error loading event zones:', e);
        setEventZoneNameById({});
        setEventDatesById({});
      }
    };

    loadEventZones();
  }, [item]);

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Determine correct ID and endpoints
        const isMovie = item.type === 'movie';
        const idToUse = isMovie ? (item.tmdbMovieId ?? item.id) : item.id;

        const analyticsUrl = `http://localhost:8080/api/analytics/${isMovie ? 'movie' : 'event'}/${idToUse}`;
        const bookingsUrl = `http://localhost:8080/api/bookings/${isMovie ? 'movie' : 'event'}/${idToUse}`;

        // Fetch Analytics and Bookings in parallel
        const [analyticsRes, bookingsRes] = await Promise.all([
          fetch(analyticsUrl, { headers }),
          fetch(bookingsUrl, { headers })
        ]);

        if (analyticsRes.ok) {
          setAnalytics(await analyticsRes.json());
        }

        if (bookingsRes.ok) {
          const data = await bookingsRes.json();

          // Normalize bookings for the table (we don't need to filter anymore!)
          const normalized = data.map((b) => {
            let seats = [];
            let ticketCount = 0;

            try {
              if (b.bookingDetails) {
                const details = JSON.parse(b.bookingDetails);

                // Movie bookings: seats array
                if (b.type === 'MOVIE' && Array.isArray(details.seats)) {
                  seats = details.seats;
                  ticketCount = seats.length;
                }

                // Event bookings
                if (b.type === 'EVENT' && details.selectedZones && typeof details.selectedZones === 'object') {
                  const zoneEntries = Object.entries(details.selectedZones);
                  const zoneSummaries = zoneEntries.map(([zoneId, categories]) => {
                    const totalForZone = Object.values(categories || {}).reduce(
                      (sum, qty) => sum + (Number(qty) || 0),
                      0
                    );
                    ticketCount += totalForZone;
                    const zoneName = eventZoneNameById[String(zoneId)] || zoneId;
                    return { label: `${zoneName}: ${totalForZone}`, total: totalForZone };
                  });
                  seats = zoneSummaries.filter((z) => z.total > 0).map((z) => z.label);
                }
              }
            } catch {
              seats = [];
              ticketCount = 0;
            }

            // Show Date/Time
            let showDate = b.show?.showDate || (b.bookedAt ? b.bookedAt.substring(0, 10) : '');
            let showTime = b.show?.showTime || '';
            if (b.type === 'EVENT' && b.eventDateId && eventDatesById[b.eventDateId]) {
              showDate = eventDatesById[b.eventDateId].date;
              showTime = eventDatesById[b.eventDateId].time;
            }

            // Venue Name
            const venueName = b.show?.venue?.name || b.event?.venue?.name || (b.event?.address) || 'Unknown Venue';

            return {
              id: b.bookingCode || `BK${b.id}`,
              userName: b.user?.name || b.userName || 'Guest', // Handle both entity and summary structures
              seats,
              ticketCount,
              date: showDate,
              time: showTime,
              status: b.status || 'CONFIRMED',
              totalAmount: Number(b.totalAmount) || 0,
              venueName,
            };
          });
          setBookings(normalized);
        }
      } catch (e) {
        console.error('Error loading data:', e);
      }
    };
    loadData();
  }, [item, eventZoneNameById, eventDatesById]);

  // Filter bookings (client-side search only)
  const filteredBookings = bookings.filter(booking => {
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
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === 'movie'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
                }`}>
                {item.type === 'movie' ? 'Movie' : 'Event'}
              </span>
            </div>
            {item.type === 'movie' && (
              <p className="text-slate-600 mb-4 text-sm sm:text-base">
                {Array.isArray(item.genre) ? item.genre.join(', ') : ''}{item.duration ? ` • ${item.duration}` : ''}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {analytics ? analytics.totalBookings : '-'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">
                  {item.type === 'movie' ? 'Total Seats' : 'Total Passes'}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {analytics ? analytics.totalSeats : '-'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  ₹{analytics ? analytics.totalRevenue.toLocaleString() : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Theatre */}
        {(() => {
          const theatreRevenue = bookings.reduce((acc, booking) => {
            // Exclude cancelled bookings from revenue calculation
            if (booking.status === 'CANCELLED') return acc;

            const theatre = booking.venueName;
            if (!acc[theatre]) {
              acc[theatre] = { revenue: 0, bookings: 0, seats: 0 };
            }
            acc[theatre].revenue += booking.totalAmount;
            acc[theatre].bookings += 1;
            acc[theatre].seats += booking.ticketCount || booking.seats.length;
            return acc;
          }, {});

          return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 mt-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Revenue by Theatre</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.keys(theatreRevenue).length === 0 ? (
                  <p className="text-sm text-slate-500 col-span-full">No confirmed bookings yet.</p>
                ) : (
                  Object.entries(theatreRevenue).map(([theatre, stats]) => (
                    <div key={theatre} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
                      <p className="font-semibold text-slate-800 mb-2 truncate" title={theatre}>{theatre}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">Revenue:</span>
                          <span className="text-sm font-bold text-indigo-700">₹{stats.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">Bookings:</span>
                          <span className="text-sm font-semibold text-slate-700">{stats.bookings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">Seats:</span>
                          <span className="text-sm font-semibold text-slate-700">{stats.seats}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })()}
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
                        <div className="w-40">
                          <p className="text-xs text-slate-500 mb-1">Booking ID</p>
                          <p className="font-mono font-bold text-slate-800 text-sm truncate" title={booking.id}>{booking.id}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">Customer Name</p>
                          <p className="font-semibold text-slate-800">{booking.userName}</p>
                          <p className="text-xs text-slate-500 mt-1">{booking.venueName}</p>
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
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${booking.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                              }`}
                          >
                            {booking.status === 'CANCELLED' ? (
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="text-sm font-bold">
                              {booking.status === 'CANCELLED' ? 'Cancelled' : 'Okay'}
                            </span>
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
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          {booking.status === 'CANCELLED' ? (
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="text-sm font-bold">
                            {booking.status === 'CANCELLED' ? 'Cancelled' : 'Okay'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Customer Name</p>
                        <p className="font-semibold text-slate-800">{booking.userName}</p>
                        <p className="text-xs text-slate-500 mt-1">{booking.venueName}</p>
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
