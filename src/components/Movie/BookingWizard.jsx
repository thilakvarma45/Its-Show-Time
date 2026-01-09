import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import TheatreSelection from './TheatreSelection';
import SeatSelection from './SeatSelection';
import PaymentForm from '../PaymentForm';
import Ticket from '../Ticket';

const STEPS = [
  { id: 1, label: 'THEATRES' },
  { id: 2, label: 'SEATS' },
  { id: 3, label: 'PAYMENT' },
  { id: 4, label: 'TICKET' }
];

const BookingWizard = ({ 
  currentStep, 
  bookingDetails, 
  onTimeSelect, 
  onSeatsSelect, 
  onPaymentComplete,
  onNewBooking 
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Stepper Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-6 overflow-x-auto">
        <div className="flex items-center justify-between max-w-3xl mx-auto gap-3 min-w-[560px]">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep > step.id
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>0{step.id}</span>
                  )}
                </div>
                <div
                  className={`mt-2 text-xs font-semibold tracking-widest ${
                    currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <TheatreSelection onTimeSelect={onTimeSelect} />
          )}
          {currentStep === 2 && (
            <SeatSelection 
              selectedShow={bookingDetails.selectedShow} 
              onContinue={onSeatsSelect} 
            />
          )}
          {currentStep === 3 && (
            <PaymentForm 
              bookingDetails={bookingDetails} 
              onPaymentComplete={onPaymentComplete} 
            />
          )}
          {currentStep === 4 && (
            <Ticket 
              bookingDetails={bookingDetails} 
              onNewBooking={onNewBooking} 
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingWizard;

