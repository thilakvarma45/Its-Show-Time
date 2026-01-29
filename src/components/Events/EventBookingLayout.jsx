import { motion } from 'framer-motion';
import EventSidebar from './EventSidebar';
import EventBookingWizard from './EventBookingWizard';

const EventBookingLayout = ({ 
  selectedEvent, 
  currentStep, 
  bookingDetails, 
  onBack,
  onDateSelect,
  onZonesSelect,
  onPaymentComplete,
  onNewBooking,
  onStepChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-cinema-light flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden"
    >
      {/* Left Sidebar - Static */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px] lg:overflow-y-auto">
        <EventSidebar event={selectedEvent} onBack={onBack} />
      </div>

      {/* Right Panel - Scrollable */}
      <div className="flex-1 w-full bg-cinema-light lg:overflow-y-auto">
        <EventBookingWizard
          currentStep={currentStep}
          bookingDetails={bookingDetails}
          event={selectedEvent}
          onDateSelect={onDateSelect}
          onZonesSelect={onZonesSelect}
          onPaymentComplete={onPaymentComplete}
          onNewBooking={onNewBooking}
          onStepChange={onStepChange}
        />
      </div>
    </motion.div>
  );
};

export default EventBookingLayout;

