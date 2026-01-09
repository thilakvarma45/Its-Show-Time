import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2, Calendar, Clock, MapPin, Armchair } from 'lucide-react';

const Ticket = ({ bookingDetails, onNewBooking }) => {
  const isEvent = bookingDetails.bookingType === 'EVENT';
  const item = isEvent ? bookingDetails.selectedEvent : bookingDetails.selectedMovie;
  const currency = isEvent ? '₹' : '$';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          Booking Confirmed!
        </h2>
        <p className="text-slate-600">Your tickets have been sent to your email</p>
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
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover blur-sm opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          <div className="absolute bottom-4 left-6 right-6">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
              {item.title}
            </h3>
            <div className="flex gap-2 mt-2">
              {isEvent ? (
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 rounded backdrop-blur-sm">
                  Live Event
                </span>
              ) : (
                item.genre?.map((g) => (
                  <span key={g} className="text-xs px-2 py-1 bg-blue-600/30 text-blue-200 rounded backdrop-blur-sm">
                    {g}
                  </span>
                ))
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
                  <MapPin className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Venue</div>
                    <div className="text-slate-900 font-semibold">{bookingDetails.selectedDate?.venue}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Date & Time</div>
                    <div className="text-slate-900 font-semibold">{bookingDetails.selectedDate?.dateLabel}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Armchair className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="text-slate-600 text-xs uppercase mb-1">Zones & Passes</div>
                  <div className="text-slate-900 font-semibold">
                    {Object.entries(bookingDetails.selectedZones || {}).map(([zoneId, categories]) => {
                      const zone = item.zones.find(z => z.id === zoneId);
                      const details = Object.entries(categories).map(([cat, qty]) => `${qty} ${cat}${qty > 1 ? 's' : ''}`).join(', ');
                      return `${zone?.name}: ${details}`;
                    }).join(' | ')}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Movie Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <MapPin className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Theatre</div>
                    <div className="text-slate-900 font-semibold">{bookingDetails.selectedShow?.theatreName}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Date</div>
                    <div className="text-slate-900 font-semibold">
                      {bookingDetails.selectedShow?.date?.day} {bookingDetails.selectedShow?.date?.date}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <Clock className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Show Time</div>
                    <div className="text-slate-900 font-semibold">{bookingDetails.selectedShow?.time}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Armchair className={`w-5 h-5 ${isEvent ? 'text-purple-500' : 'text-blue-500'} flex-shrink-0`} />
                  <div>
                    <div className="text-slate-600 text-xs uppercase mb-1">Seats</div>
                    <div className="text-slate-900 font-semibold">{bookingDetails.selectedSeats?.join(', ')}</div>
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
              <div className={`text-2xl font-bold ${isEvent ? 'text-purple-600' : 'text-blue-600'}`}>{currency}{bookingDetails.totalPrice}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-600 text-xs uppercase mb-1">Booking ID</div>
              <div className="text-slate-900 font-mono">BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center pt-4">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border-2 border-slate-200">
              <div className="text-center text-xs text-gray-800">
                <div className="font-bold mb-1">QR CODE</div>
                <div className="text-[10px]">Scan at {isEvent ? 'Venue' : 'Theatre'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <button className={`flex-1 px-6 py-3 bg-white border border-slate-300 ${isEvent ? 'hover:border-purple-600' : 'hover:border-blue-600'} text-slate-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md`}>
          <Download className="w-5 h-5" />
          Download
        </button>
        <button className={`flex-1 px-6 py-3 bg-white border border-slate-300 ${isEvent ? 'hover:border-purple-600' : 'hover:border-blue-600'} text-slate-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md`}>
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </motion.div>

      {/* Book Another */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onNewBooking}
        className={`w-full px-6 py-3 ${isEvent ? 'text-purple-600 hover:text-purple-700' : 'text-blue-600 hover:text-blue-700'} rounded-lg font-semibold transition-colors`}
      >
        Book Another {isEvent ? 'Event' : 'Movie'}
      </motion.button>
    </div>
  );
};

export default Ticket;

