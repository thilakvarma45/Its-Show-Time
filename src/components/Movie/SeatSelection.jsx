import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { generateSeats, SEAT_ROWS } from '../../data/mockData';

const SeatSelection = ({ selectedShow, onContinue }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const seats = useMemo(() => generateSeats(), []);

  const toggleSeat = (seatId, isTaken) => {
    if (isTaken) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getSeatsByRow = (rowId) => {
    return seats.filter(seat => seat.row === rowId);
  };

  const totalPrice = selectedSeats.length * selectedShow.price;

  return (
    <div className="space-y-6 pb-24">
      {/* Screen */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="mx-auto w-3/4 h-1 bg-slate-300 rounded-full mb-2" />
        <div className="text-center text-slate-500 text-sm font-medium uppercase tracking-wide">
          Screen
        </div>
      </motion.div>

      {/* Seat Legend */}
      <div className="flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-200 border border-slate-300 rounded flex items-center justify-center text-slate-600 text-xs font-medium">
            A1
          </div>
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 border border-blue-600 rounded flex items-center justify-center text-white text-xs font-medium">
            A2
          </div>
          <span className="text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-400 border border-slate-500 rounded flex items-center justify-center text-slate-300 text-xs font-medium opacity-60">
            A3
          </div>
          <span className="text-slate-600">Taken</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-200 border border-amber-400 rounded flex items-center justify-center text-amber-700 text-xs font-medium">
            L1
          </div>
          <span className="text-slate-600">VIP</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-2 max-w-6xl mx-auto">
        {SEAT_ROWS.map((row, rowIndex) => {
          const rowSeats = getSeatsByRow(row.id);
          const isVIP = row.type === 'vip';

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.03 }}
              className="flex items-center gap-3"
            >
              {/* Row Label */}
              <div className={`w-10 text-center font-semibold text-sm ${
                isVIP ? 'text-amber-600' : 'text-slate-600'
              }`}>
                {row.id}
              </div>

              {/* Seats Grid */}
              <div className="flex-1 flex items-center gap-1.5 justify-center flex-wrap">
                {rowSeats.map((seat, index) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isTaken = seat.taken;
                  
                  // Create aisle gap after 7th seat (middle aisle)
                  if (index === 7) {
                    return (
                      <div key={`aisle-${row.id}`} className="w-6" />
                    );
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id, isTaken)}
                      disabled={isTaken}
                      className={`
                        w-10 h-10
                        text-xs font-medium
                        transition-all duration-200
                        rounded
                        border-2
                        flex items-center justify-center
                        ${isTaken 
                          ? 'bg-slate-400 border-slate-500 text-slate-300 cursor-not-allowed opacity-60' 
                          : isSelected
                            ? 'bg-blue-500 border-blue-600 text-white shadow-md scale-105'
                            : isVIP
                              ? 'bg-amber-200 border-amber-400 text-amber-700 hover:bg-amber-300 hover:scale-105'
                              : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-slate-300 hover:border-blue-400 hover:scale-105'
                        }
                      `}
                      title={`Seat ${seat.id}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* VIP Label */}
      <div className="text-center pt-4">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-medium">
          Rows L & M - VIP Recliner Seats
        </span>
      </div>

      {/* Sticky Footer */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-6 shadow-lg z-50"
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <div className="text-slate-500 text-sm mb-1">Selected Seats</div>
              <div className="text-slate-900 text-2xl font-bold">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} • ₹{totalPrice}
              </div>
              <div className="text-slate-600 text-sm mt-1 font-medium">
                {selectedSeats.sort().join(', ')}
              </div>
            </div>
            <button
              onClick={() => onContinue(selectedSeats, totalPrice)}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors shadow-md"
            >
              Continue to Payment
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SeatSelection;
