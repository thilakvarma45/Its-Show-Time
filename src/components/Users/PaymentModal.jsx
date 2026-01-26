import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, X } from 'lucide-react';

const PaymentModal = ({ isOpen, status, onClose, bookingType = 'MOVIE', paymentMethod = 'card', selectedUpiApp = '' }) => {
  const accentColor = bookingType === 'MOVIE' ? 'blue' : 'purple';
  const accentClass = accentColor === 'blue' ? 'text-blue-600 bg-blue-600' : 'text-purple-600 bg-purple-600';
  const gradientClass = accentColor === 'blue' 
    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
  
  const isUpi = paymentMethod === 'upi' && selectedUpiApp;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={status === 'completed' ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto"
            >
              {status === 'processing' && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-6"
                  >
                    <Loader2 className={`w-20 h-20 ${accentColor === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment</h3>
                  {isUpi ? (
                    <div className="space-y-2">
                      <p className="text-slate-600 font-semibold text-lg">
                        Check your <span className={`${accentColor === 'blue' ? 'text-blue-600' : 'text-purple-600'} font-bold`}>{selectedUpiApp}</span> app for confirmation and pay
                      </p>
                      <p className="text-slate-500 text-sm">Please approve the payment request on your UPI app</p>
                    </div>
                  ) : (
                    <p className="text-slate-600">Please wait while we process your payment...</p>
                  )}
                  <div className="mt-6 flex justify-center gap-2">
                    <motion.div 
                      className={`w-2 h-2 ${accentColor === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} rounded-full`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className={`w-2 h-2 ${accentColor === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} rounded-full`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className={`w-2 h-2 ${accentColor === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} rounded-full`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                </div>
              )}

              {status === 'completed' && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                  <p className="text-slate-600 mb-6">Your payment has been processed successfully.</p>
                  <button
                    onClick={onClose}
                    className={`px-6 py-3 ${gradientClass} text-white rounded-lg font-semibold transition-all shadow-lg`}
                  >
                    Continue
                  </button>
                </div>
              )}

              {status === 'failed' && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6"
                  >
                    <X className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h3>
                  <p className="text-slate-600 mb-6">There was an issue processing your payment. Please try again.</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

