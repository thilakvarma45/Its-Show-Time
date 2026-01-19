import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Auth from './components/Auth';
import Home from './components/Home';
import BookingLayout from './components/Movie/BookingLayout';
import EventBookingLayout from './components/Events/EventBookingLayout';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import ProfileDropdown from './components/ProfileDropdown';
import Settings from './components/Settings';
import MyBookings from './components/MyBookings';
import Wishlist from './components/Wishlist';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Main state management
  const [view, setView] = useState('HOME'); // 'HOME' | 'BOOKING' | 'SETTINGS' | 'BOOKINGS' | 'WISHLIST' | 'OWNER_DASHBOARD'
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

  // Handler: Back to Home (role-aware)
  const handleBack = () => {
    // Redirect based on user role
    if (user?.role === 'owner') {
      setView('OWNER_DASHBOARD');
    } else {
      setView('HOME');
    }
    setSelectedMovie(null);
    setSelectedEvent(null);
    setSelectedShow(null);
    setSelectedDate(null);
    setSelectedSeats([]);
    setSelectedZones({});
    setTotalPrice(0);
    setBookingStep(1);
  };

  // Handler: Navigate to home based on role
  const handleNavigateHome = () => {
    if (user?.role === 'owner') {
      setView('OWNER_DASHBOARD');
    } else {
      setView('HOME');
    }
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
    // Reset all state
    setView('HOME');
    setSelectedMovie(null);
    setSelectedEvent(null);
    setSelectedShow(null);
    setSelectedDate(null);
    setSelectedSeats([]);
    setSelectedZones({});
    setTotalPrice(0);
    setBookingStep(1);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Handler: Profile Dropdown Navigation
  const handleProfileNavigation = (action) => {
    if (action === 'settings') {
      setView('SETTINGS');
    } else if (action === 'bookings') {
      setView('BOOKINGS');
    } else if (action === 'wishlist') {
      setView('WISHLIST');
    } else if (action === 'home') {
      handleNavigateHome();
    }
  };

  // Handler: Save Settings
  const handleSaveSettings = (formData) => {
    setUser({
      ...user,
      ...formData,
    });
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
      {/* Modern Navbar with Gradient */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={handleNavigateHome}
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                  <span className="text-2xl">🎬</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">
                  ITS SHOW TIME
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Your Entertainment Hub
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              onNavigate={handleProfileNavigation}
            />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'OWNER_DASHBOARD' ? (
          <OwnerDashboard
            key="owner-dashboard"
            user={user}
          />
        ) : view === 'SETTINGS' ? (
          <Settings
            key="settings"
            user={user}
            onBack={handleNavigateHome}
            onSave={handleSaveSettings}
          />
        ) : view === 'BOOKINGS' ? (
          <MyBookings
            key="bookings"
            user={user}
            onBack={handleNavigateHome}
          />
        ) : view === 'WISHLIST' ? (
          <Wishlist
            key="wishlist"
            user={user}
            onBack={handleNavigateHome}
            onMovieSelect={handleMovieSelect}
            onEventSelect={handleEventSelect}
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
