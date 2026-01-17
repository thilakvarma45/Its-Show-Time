import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Auth from './components/Auth';
import Home from './components/Home';
import BookingLayout from './components/Movie/BookingLayout';
import EventBookingLayout from './components/Events/EventBookingLayout';
import OwnerDashboard from './components/Owner/OwnerDashboard';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Main state management
  const [view, setView] = useState('HOME'); // 'HOME' | 'BOOKING'
  const [bookingType, setBookingType] = useState('MOVIE'); // 'MOVIE' | 'EVENT'
  const [bookingStep, setBookingStep] = useState(1); // 1-4
  
  // Movie state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Event state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedZones, setSelectedZones] = useState({});
  
  // Shared state
  const [totalPrice, setTotalPrice] = useState(0);

  // Handler: Movie selection from Home
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedEvent(null);
    setBookingType('MOVIE');
    setView('BOOKING');
    setBookingStep(1);
  };

  // Handler: Event selection from Home
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSelectedMovie(null);
    setBookingType('EVENT');
    setView('BOOKING');
    setBookingStep(1);
  };

  // Handler: Back to Home
  const handleBack = () => {
    setView('HOME');
    setSelectedMovie(null);
    setSelectedEvent(null);
    setSelectedShow(null);
    setSelectedDate(null);
    setSelectedSeats([]);
    setSelectedZones({});
    setTotalPrice(0);
    setBookingStep(1);
  };

  // Movie Handlers
  const handleTimeSelect = (showDetails) => {
    setSelectedShow(showDetails);
    setBookingStep(2);
  };

  const handleSeatsSelect = (seats, price) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
    setBookingStep(3);
  };

  // Event Handlers
  const handleDateSelect = (dateDetails) => {
    setSelectedDate(dateDetails);
    setBookingStep(2);
  };

  const handleZonesSelect = (zones, price) => {
    setSelectedZones(zones);
    setTotalPrice(price);
    setBookingStep(3);
  };

  // Shared Handlers
  const handlePaymentComplete = () => {
    setBookingStep(4);
  };

  const handleNewBooking = () => {
    handleBack();
  };

  // Handler: Authentication success
  const handleAuthSuccess = (authData) => {
    setUser(authData);
    setIsAuthenticated(true);
    // Redirect based on role
    if (authData.role === 'owner') {
      setView('OWNER_DASHBOARD');
    } else {
      setView('HOME');
    }
  };

  // Handler: Logout
  const handleLogout = () => {
    handleBack();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Prepare booking details object
  const bookingDetails = bookingType === 'MOVIE' ? {
    selectedMovie,
    selectedShow,
    selectedSeats,
    totalPrice,
    bookingType: 'MOVIE'
  } : {
    selectedEvent,
    selectedDate,
    selectedZones,
    totalPrice,
    bookingType: 'EVENT'
  };

  // Show Auth if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-cinema-light text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-lg bg-black/30 sticky top-0 z-20">
        <div>
          <p className="text-xl font-semibold tracking-wide uppercase">ITS SHOW TIME</p>
          <p className="text-sm text-white/70">
            Welcome back, {user?.name || (user?.role === 'owner' ? 'Producer' : 'macha')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs uppercase tracking-widest text-white/60">
            <div>{user?.role === 'owner' ? 'Director' : 'Movie Lover'}</div>
            <div className="text-[10px] text-white/50">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs uppercase tracking-widest bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'OWNER_DASHBOARD' ? (
          <OwnerDashboard
            key="owner-dashboard"
            user={user}
            onLogout={handleLogout}
          />
        ) : view === 'HOME' ? (
          <Home
            key="home"
            onMovieSelect={handleMovieSelect}
            onEventSelect={handleEventSelect}
            user={user}
          />
        ) : bookingType === 'MOVIE' ? (
          <BookingLayout
            key="movie-booking"
            selectedMovie={selectedMovie}
            currentStep={bookingStep}
            bookingDetails={bookingDetails}
            onBack={handleBack}
            onTimeSelect={handleTimeSelect}
            onSeatsSelect={handleSeatsSelect}
            onPaymentComplete={handlePaymentComplete}
            onNewBooking={handleNewBooking}
          />
        ) : (
          <EventBookingLayout
            key="event-booking"
            selectedEvent={selectedEvent}
            currentStep={bookingStep}
            bookingDetails={bookingDetails}
            onBack={handleBack}
            onDateSelect={handleDateSelect}
            onZonesSelect={handleZonesSelect}
            onPaymentComplete={handlePaymentComplete}
            onNewBooking={handleNewBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
