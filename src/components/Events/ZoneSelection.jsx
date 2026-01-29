import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';

const ZoneSelection = ({ event, selectedDate, onContinue }) => {
  const [cart, setCart] = useState({});

  const updateQuantity = (zoneId, categoryType, delta) => {
    // IMPORTANT: keep this updater fully immutable.
    // In React StrictMode, state updaters can be invoked twice in dev.
    // If we mutate nested objects, a single click can look like +2.
    setCart((prev) => {
      const prevZone = prev[zoneId] || {};
      const prevQty = Number(prevZone[categoryType] || 0);
      const nextQty = Math.max(0, prevQty + delta);

      // Build next zone object immutably
      let nextZone = { ...prevZone };
      if (nextQty === 0) {
        delete nextZone[categoryType];
      } else {
        nextZone = { ...nextZone, [categoryType]: nextQty };
      }

      // Build next cart immutably
      const nextCart = { ...prev };
      if (Object.keys(nextZone).length === 0) {
        delete nextCart[zoneId];
      } else {
        nextCart[zoneId] = nextZone;
      }
      return nextCart;
    });
  };

  const getQuantity = (zoneId, categoryType) => {
    return cart[zoneId]?.[categoryType] || 0;
  };

  const calculateTotal = useMemo(() => {
    let totalPasses = 0;
    let totalPrice = 0;

    Object.entries(cart).forEach(([zoneId, categories]) => {
      const zone = event.zones.find(z => z.id === zoneId);
      if (zone) {
        Object.entries(categories).forEach(([categoryType, quantity]) => {
          const category = zone.categories.find(c => c.type === categoryType);
          if (category) {
            totalPasses += quantity;
            totalPrice += category.price * quantity;
          }
        });
      }
    });

    return { totalPasses, totalPrice };
  }, [cart, event.zones]);

  return (
    <div className="space-y-6">
      {/* Stage Visual */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="mx-auto w-4/5 h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mb-2" />
        <div className="text-center text-slate-600 text-sm uppercase tracking-widest">
          Stage
        </div>
      </motion.div>

      {/* Zone Cards */}
      <div className="space-y-4">
        {event.zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`backdrop-blur-xl bg-white/5 rounded-2xl border-2 ${zone.color} p-6 shadow-lg`}
          >
            {/* Zone Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-1 uppercase tracking-wide">
                {zone.name}
              </h3>
              <p className="text-slate-600 text-sm">
                Starts ₹{Math.min(...zone.categories.map(c => c.price))}
              </p>
            </div>

            {/* Category Rows with Steppers */}
            <div className="space-y-3">
              {zone.categories.map((category) => {
                const quantity = getQuantity(zone.id, category.type);
                return (
                  <div
                    key={category.type}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex-1">
                      <div className="text-slate-900 font-semibold">{category.type}</div>
                      <div className="text-purple-600 font-bold">₹{category.price}</div>
                    </div>
                    
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(zone.id, category.type, -1)}
                        disabled={quantity === 0}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4 text-slate-700" />
                      </button>
                      <span className="w-12 text-center text-slate-900 font-bold text-lg">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(zone.id, category.type, 1)}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center transition-all shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Summary Footer */}
      {calculateTotal.totalPasses > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 bg-white border-t-2 border-purple-600 p-6 rounded-t-lg shadow-lg"
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <div className="text-slate-600 text-sm mb-1">Selected Passes</div>
              <div className="text-slate-900 text-2xl font-bold">
                {calculateTotal.totalPasses} {calculateTotal.totalPasses === 1 ? 'Pass' : 'Passes'} • ₹{calculateTotal.totalPrice}
              </div>
            </div>
            <button
              onClick={() => onContinue(cart, calculateTotal.totalPrice)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold uppercase tracking-wider transition-all shadow-lg"
            >
              Proceed to Payment
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ZoneSelection;

