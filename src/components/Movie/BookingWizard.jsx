import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import TheatreSelection from './TheatreSelection';
import SeatSelection from './SeatSelection';
import PaymentForm from '../Users/PaymentForm';
import Ticket from '../Users/Ticket';

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
  onNewBooking,
  onBack,
  onStepChange
}) => {
  const canGoToStep = (targetStepId) => {
    if (!onStepChange) return false;
    if (targetStepId === currentStep) return false;

    // NEVER allow going back from ticket step (step 4)
    if (currentStep === 4) return false;

    // Allow going back to previous steps (but not from ticket)
    if (targetStepId < currentStep) return true;

    // Guards for moving forward via header clicks
    if (targetStepId === 2) {
      return !!bookingDetails?.selectedShow;
    }

    if (targetStepId === 3) {
      return (
        !!bookingDetails?.selectedShow &&
        Array.isArray(bookingDetails?.selectedSeats) &&
        bookingDetails.selectedSeats.length > 0
      );
    }

    // Ticket step should only be reached through successful payment flow
    if (targetStepId === 4) {
      return currentStep === 4;
    }

    return false;
  };
  return (
    <div className="h-full flex flex-col">

      {/* ================= STEPPER HEADER ================= */}
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
                    // When going back via stepper, clear subsequent selections
                    if (step.id < currentStep) {
                      // This will trigger handleStepChange in AppContent which clears selections
                      onStepChange(step.id);
                    } else {
                      // Going forward - normal behavior
                      onStepChange(step.id);
                    }
                  }
                }}
                className={`flex items-center flex-1 text-left focus:outline-none ${isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
              >

                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.id
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
                    className={`mt-2 text-xs font-semibold tracking-widest ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                      }`}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Connector */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep > step.id ? 'bg-green-600' : 'bg-slate-300'
                      }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto px-8 py-8">

        {/* 🔙 Back Button - Never show on ticket step */}
        {currentStep > 1 && currentStep < 4 && (
          <button
            onClick={() => {
              // Go back one step and clear subsequent selections
              if (currentStep === 3) {
                // Going back from payment to seats - clear seats
                onStepChange(2);
              } else if (currentStep === 2) {
                // Going back from seats to theatres - clear show
                onStepChange(1);
              }
            }}
            className="flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {/* Step Transition */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <TheatreSelection
              onTimeSelect={onTimeSelect}
              selectedShow={bookingDetails.selectedShow}
              movieId={bookingDetails.selectedMovie?.id}
            />
          )}

          {currentStep === 2 && (
            <SeatSelection
              selectedShow={bookingDetails.selectedShow}
              initialSelectedSeats={bookingDetails.selectedSeats}
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
