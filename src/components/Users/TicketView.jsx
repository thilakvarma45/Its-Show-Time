import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, Armchair, ArrowLeft, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getMovieById } from '../../services/tmdb';
import { formatBookingId, formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const TicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/bookings/${id}`);
        if (!response.ok) {
          throw new Error('Booking not found');
        }
        const data = await response.json();
        setBooking(data);

        // If it's a movie booking, fetch movie details from TMDB
        if (data.type === 'MOVIE' && data.show?.tmdbMovieId) {
          try {
            const movie = await getMovieById(data.show.tmdbMovieId);
            setMovieDetails(movie);
          } catch (err) {
            console.error('Error fetching movie details:', err);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'preview') {
      fetchBooking();
    } else {
      setError('Invalid booking ID');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <LoadingSpinner size={8} className="min-h-screen" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const isEvent = booking?.type === 'EVENT';
  const item = isEvent ? booking?.event : booking?.show;
  const displayBookingId = formatBookingId(booking?.id);
  const ticketUrl = `${window.location.origin}/ticket/${booking?.id}`;
  const movieTitle = movieDetails?.title || `Show #${item?.id}`;
  const moviePoster = movieDetails?.poster || null;

  // Parse booking details
  let bookingDetails = {};
  try {
    bookingDetails = JSON.parse(booking?.bookingDetails || '{}');
  } catch (e) {
    console.error('Error parsing booking details:', e);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 uppercase tracking-wide">
            Your Ticket
          </h2>
          <p className="text-slate-600">Present this at the {isEvent ? 'venue' : 'theatre'}</p>
        </motion.div>

        {/* Digital Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-lg"
        >
          {/* Banner */}
          <div className="relative h-48 overflow-hidden">
            {moviePoster && !isEvent ? (
              <>
                <img
                  src={moviePoster}
                  alt={movieTitle}
                  className="w-full h-full object-cover blur-sm opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
              </>
            ) : (
              <>
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-white" />
              </>
            )}
            <div className="absolute bottom-4 left-6 right-6">
              <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-wide drop-shadow-lg">
                {isEvent ? item?.title : movieTitle}
              </h3>
              <div className="flex gap-2 mt-2">
                {isEvent ? (
                  <span className="text-xs px-2 py-1 bg-purple-600/30 text-purple-900 rounded backdrop-blur-sm">
                    Live Event
                  </span>
                ) : (
                  <>
                    <span className="text-xs px-2 py-1 bg-blue-600/30 text-blue-900 rounded backdrop-blur-sm">
                      Movie
                    </span>
                    {movieDetails?.genre?.slice(0, 2).map((g) => (
                      <span key={g} className="text-xs px-2 py-1 bg-blue-600/30 text-blue-900 rounded backdrop-blur-sm">
                        {g}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-6 space-y-4">
            {isEvent ? (
              <>
                {/* Event Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs uppercase mb-1">Venue</div>
                      <div className="text-slate-900 font-semibold">{item?.venue?.name || 'Event Venue'}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs uppercase mb-1">Date</div>
                      <div className="text-slate-900 font-semibold">{booking?.eventDateId || 'TBD'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Armchair className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-slate-600 text-xs uppercase mb-1">Zones & Passes</div>
                    <div className="text-slate-900 font-semibold">
                      {bookingDetails.selectedZones ? (
                        Object.entries(bookingDetails.selectedZones).map(([zoneName, categories]) => {
                          const details = Object.entries(categories).map(([cat, qty]) => `${qty} ${cat}${qty > 1 ? 's' : ''}`).join(', ');
                          return `${zoneName}: ${details}`;
                        }).join(' | ')
                      ) : 'No zones selected'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Movie Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs uppercase mb-1">Date</div>
                      <div className="text-slate-900 font-semibold">
                        {formatDate(item?.showDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-xs uppercase mb-1">Show Time</div>
                      <div className="text-slate-900 font-semibold">{item?.showTime || 'TBD'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Armchair className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Seats</div>
                    <div className="text-slate-900 font-semibold">
                      {bookingDetails.seats ? bookingDetails.seats.join(', ') : 'No seats selected'}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="border-t border-dashed border-slate-300 my-4" />

            {/* Price & Booking ID */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-slate-600 text-xs uppercase mb-1">Total Amount</div>
                <div className={`text-2xl font-bold ${isEvent ? 'text-purple-600' : 'text-blue-600'}`}>
                  {formatCurrency(booking?.totalAmount)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-600 text-xs uppercase mb-1">Booking ID</div>
                <div className="text-slate-900 font-mono font-bold">{displayBookingId}</div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                booking?.status === 'CONFIRMED' 
                  ? 'bg-green-100 text-green-700' 
                  : booking?.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {booking?.status || 'PENDING'}
              </span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center pt-4">
              <div className="bg-white p-3 rounded-lg border-2 border-slate-200 shadow-sm">
                <QRCodeSVG 
                  value={ticketUrl} 
                  size={128}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Scan at {isEvent ? 'Venue' : 'Theatre'}</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-600">
          <p>Booked on: {formatDate(booking?.bookedAt)}</p>
          <p className="mt-1">Payment: {booking?.paymentMethod?.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
