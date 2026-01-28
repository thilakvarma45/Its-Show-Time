import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import VenueSelection from './VenueSelection';
import ZoneSelection from './ZoneSelection';
import PaymentForm from '../Users/PaymentForm';
import Ticket from '../Users/Ticket';

const STEPS = [
  { id: 1, label: 'VENUE' },
  { id: 2, label: 'ZONES' },
  { id: 3, label: 'PAYMENT' },
  { id: 4, label: 'TICKET' }
];

const EventBookingWizard = ({ 
  currentStep, 
  bookingDetails, 
  event,
  onDateSelect, 
  onZonesSelect, 
  onPaymentComplete,
  onNewBooking,
  onStepChange
}) => {
  const canGoToStep = (targetStepId) => {
    if (!onStepChange) return false;
    if (targetStepId === currentStep) return false;

    // Always allow going back
    if (targetStepId < currentStep) return true;

    // Forward guards based on selected data
    if (targetStepId === 2) {
      return !!bookingDetails?.selectedDate;
    }

    if (targetStepId === 3) {
      const zones = bookingDetails?.selectedZones || {};
      const totalPasses = Object.values(zones).reduce(
        (sum, cats) => sum + Object.values(cats).reduce((s, q) => s + q, 0),
        0
      );
      return !!bookingDetails?.selectedDate && totalPasses > 0;
    }

    if (targetStepId === 4) {
      return currentStep === 4;
    }

    return false;
  };
  return (
    <div className="h-full flex flex-col">
      {/* Stepper Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-6 overflow-x-auto">
        <div className="flex items-center justify-between max-w-3xl mx-auto gap-3 min-w-[560px]">
          {STEPS.map((step, index) => {
            const isClickable = canGoToStep(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (isClickable) {
                    onStepChange(step.id);
                  }
                }}
                className={`flex items-center flex-1 text-left focus:outline-none ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep > step.id
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
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
            </button>
          );})}
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
            <VenueSelection event={event} onDateSelect={onDateSelect} />
          )}
          {currentStep === 2 && (
            <ZoneSelection 
              event={event}
              selectedDate={bookingDetails.selectedDate} 
              onContinue={onZonesSelect} 
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

export default EventBookingWizard;

