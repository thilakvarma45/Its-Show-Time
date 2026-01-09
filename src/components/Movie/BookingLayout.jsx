import { motion } from 'framer-motion';
import MovieSidebar from './MovieSidebar';
import BookingWizard from './BookingWizard';
import PaymentForm from '../PaymentForm';
import Ticket from '../Ticket';

const BookingLayout = ({ 
  selectedMovie, 
  currentStep, 
  bookingDetails, 
  onBack,
  onTimeSelect,
  onSeatsSelect,
  onPaymentComplete,
  onNewBooking
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-cinema-light flex flex-col lg:flex-row"
    >
      {/* Left Sidebar - 30% */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px]">
        <MovieSidebar movie={selectedMovie} onBack={onBack} />
      </div>

      {/* Right Panel - 70% */}
      <div className="flex-1 w-full bg-cinema-light">
        <BookingWizard
          currentStep={currentStep}
          bookingDetails={bookingDetails}
          onTimeSelect={onTimeSelect}
          onSeatsSelect={onSeatsSelect}
          onPaymentComplete={onPaymentComplete}
          onNewBooking={onNewBooking}
        />
      </div>
    </motion.div>
  );
};

export default BookingLayout;

