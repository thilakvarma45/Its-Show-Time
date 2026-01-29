import { motion } from 'framer-motion';
import MovieSidebar from './MovieSidebar';
import BookingWizard from './BookingWizard';

const BookingLayout = ({
  selectedMovie,
  currentStep,
  bookingDetails,
  onBack,
  onTimeSelect,
  onSeatsSelect,
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
        <MovieSidebar movie={selectedMovie} onBack={onBack} />
      </div>

      {/* Right Panel - Scrollable */}
      <div className="flex-1 w-full bg-cinema-light lg:overflow-y-auto">
        <BookingWizard
          currentStep={currentStep}
          bookingDetails={bookingDetails}
          onTimeSelect={onTimeSelect}
          onSeatsSelect={onSeatsSelect}
          onPaymentComplete={onPaymentComplete}
          onNewBooking={onNewBooking}
          onStepChange={onStepChange}
          //to make Back button work
          onBack={() => onStepChange(currentStep - 1)}
        />
      </div>
    </motion.div>
  );
};

export default BookingLayout;

