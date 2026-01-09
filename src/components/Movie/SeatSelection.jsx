import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Armchair } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Screen */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="mx-auto w-4/5 h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mb-2" />
        <div className="text-center text-slate-600 text-sm uppercase tracking-widest">
          Screen
        </div>
      </motion.div>

      {/* Seat Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-300 rounded-t-md rounded-b-sm border-2 border-slate-400 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-md before:bg-slate-400" />
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-t-md rounded-b-sm relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-md before:bg-blue-500" />
          <span className="text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-900/50 rounded-t-md rounded-b-sm border-2 border-red-500/30 opacity-60 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-md before:bg-red-600/50" />
          <span className="text-slate-600">Taken</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {SEAT_ROWS.map((row, rowIndex) => {
          const rowSeats = getSeatsByRow(row.id);
          const isVIP = row.type === 'vip';

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="flex items-center gap-4"
            >
              {/* Row Label */}
              <div className={`w-12 text-center font-bold ${isVIP ? 'text-yellow-500' : 'text-slate-600'}`}>
                {row.id}
              </div>

              {/* Seats Grid */}
              <div className={`flex-1 grid gap-1.5 justify-center ${
                isVIP 
                  ? 'grid-cols-8' 
                  : 'grid-cols-[repeat(4,auto),1.5rem,repeat(4,auto)]'
              }`}>
                {rowSeats.map((seat, index) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isTaken = seat.taken;
                  
                  // Create aisle gap for standard seats (after 4th seat)
                  if (!isVIP && index === 4) {
                    return (
                      <div key={`aisle-${row.id}`} className="col-span-1" />
                    );
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id, isTaken)}
                      disabled={isTaken}
                      className={`
                        relative w-8 h-8 ${isVIP ? 'w-10 h-10' : ''}
                        ${isVIP ? 'text-xs' : 'text-[10px]'}
                        font-semibold transition-all duration-200
                        ${isTaken 
                          ? 'bg-red-900/50 text-red-500 border border-red-500/30 cursor-not-allowed opacity-60' 
                          : isSelected
                            ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-110 z-10'
                            : 'bg-slate-300 text-slate-600 border-2 border-slate-400 hover:border-blue-500 hover:scale-105'
                        }
                        rounded-t-md rounded-b-sm
                        flex items-center justify-center
                        before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1
                        before:rounded-t-md
                        ${isTaken 
                          ? 'before:bg-red-600/50' 
                          : isSelected
                            ? 'before:bg-blue-500'
                            : 'before:bg-slate-400'
                        }
                      `}
                      title={`Seat ${seat.id}${seat.number}`}
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
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-600 text-sm">
          <Armchair className="w-4 h-4" />
          Row I - VIP Recliner Seats
        </span>
      </div>

      {/* Sticky Footer */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 bg-white border-t-2 border-blue-600 p-6 rounded-t-lg shadow-lg"
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <div className="text-slate-600 text-sm mb-1">Selected Seats</div>
              <div className="text-slate-900 text-2xl font-bold">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} • ${totalPrice}
              </div>
              <div className="text-slate-600 text-sm mt-1">
                {selectedSeats.sort().join(', ')}
              </div>
            </div>
            <button
              onClick={() => onContinue(selectedSeats, totalPrice)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold uppercase tracking-wider transition-colors"
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

