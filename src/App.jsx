import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Home from './components/Users/Home';
import MovieDetails from './components/Users/MovieDetails';
import BookingLayout from './components/Movie/BookingLayout';
import EventBookingLayout from './components/Events/EventBookingLayout';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import ProfileDropdown from './components/Users/ProfileDropdown';
import Settings from './components/Settings';
import MyBookings from './components/Users/MyBookings';
import Wishlist from './components/Users/Wishlist';

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main App Content (with routing)
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Main state management
  const [view, setView] = useState('HOME');
  const [bookingType, setBookingType] = useState('MOVIE');
  const [bookingStep, setBookingStep] = useState(1);
  
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

  // Handler: Movie selection from Home - navigate to movie details
  const handleMovieSelect = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Handler: Book Now from Movie Details
  const handleBookNow = (movie) => {
    setSelectedMovie(movie);
    setSelectedEvent(null);
    setBookingType('MOVIE');
    setBookingStep(1);
    navigate('/booking/movie', { state: { movie } });
  };

  // Handler: Event selection from Home
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSelectedMovie(null);
    setBookingType('EVENT');
    setBookingStep(1);
    navigate('/booking/event', { state: { event } });
  };

  // Handler: Back to Home (role-aware)
  const handleBack = () => {
    if (user?.role === 'owner') {
      setView('OWNER_DASHBOARD');
      navigate('/owner/dashboard');
    } else {
      setView('HOME');
      navigate('/home');
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
      navigate('/owner/dashboard');
    } else {
      setView('HOME');
      navigate('/home');
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
      navigate('/owner/dashboard');
    } else {
      setView('HOME');
      navigate('/home');
    }
  };

  // Handler: Logout
  const handleLogout = () => {
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
    navigate('/');
  };

  // Handler: Profile Dropdown Navigation
  const handleProfileNavigation = (action) => {
    if (action === 'settings') {
      setView('SETTINGS');
      navigate('/settings');
    } else if (action === 'bookings') {
      setView('BOOKINGS');
      navigate('/bookings');
    } else if (action === 'wishlist') {
      setView('WISHLIST');
      navigate('/wishlist');
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


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'owner' ? '/owner/dashboard' : '/home'} replace />
            ) : (
              <Auth onAuthSuccess={handleAuthSuccess} initialMode="login" />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'owner' ? '/owner/dashboard' : '/home'} replace />
            ) : (
              <Auth onAuthSuccess={handleAuthSuccess} initialMode="register" />
            )
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <div className="min-h-screen bg-cinema-light text-white">
                <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                      <button
                        onClick={handleNavigateHome}
                        className="flex items-center gap-2 sm:gap-3 group"
                      >
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                          <span className="text-2xl">🎬</span>
                        </div>
                        <div className="hidden sm:block">
                          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            ITS SHOW TIME
                          </h1>
                          <p className="text-xs text-slate-500 font-medium">
                            Your Entertainment Hub
                          </p>
                        </div>
                      </button>
                      <ProfileDropdown
                        user={user}
                        onLogout={handleLogout}
                        onNavigate={handleProfileNavigation}
                      />
                    </div>
                  </div>
                </header>
                <Home
                  onMovieSelect={handleMovieSelect}
                  onEventSelect={handleEventSelect}
                  user={user}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute user={user}>
              <div className="min-h-screen bg-white">
                <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                      <button
                        onClick={handleNavigateHome}
                        className="flex items-center gap-2 sm:gap-3 group"
                      >
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                          <span className="text-2xl">🎬</span>
                        </div>
                        <div className="hidden sm:block">
                          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            ITS SHOW TIME
                          </h1>
                        </div>
                      </button>
                      <ProfileDropdown
                        user={user}
                        onLogout={handleLogout}
                        onNavigate={handleProfileNavigation}
                      />
                    </div>
                  </div>
                </header>
                <MovieDetails onBookNow={handleBookNow} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <div className="min-h-screen bg-cinema-light text-white">
                <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                      <button
                        onClick={handleNavigateHome}
                        className="flex items-center gap-2 sm:gap-3 group"
                      >
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                          <span className="text-2xl">🎬</span>
                        </div>
                        <div className="hidden sm:block">
                          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            ITS SHOW TIME
                          </h1>
                        </div>
                      </button>
                      <ProfileDropdown
                        user={user}
                        onLogout={handleLogout}
                        onNavigate={handleProfileNavigation}
                      />
                    </div>
                  </div>
                </header>
                <Settings
                  user={user}
                  onBack={handleNavigateHome}
                  onSave={handleSaveSettings}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute user={user}>
              <div className="min-h-screen bg-cinema-light text-white">
                <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                      <button
                        onClick={handleNavigateHome}
                        className="flex items-center gap-2 sm:gap-3 group"
                      >
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                          <span className="text-2xl">🎬</span>
                        </div>
                        <div className="hidden sm:block">
                          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            ITS SHOW TIME
                          </h1>
                        </div>
                      </button>
                      <ProfileDropdown
                        user={user}
                        onLogout={handleLogout}
                        onNavigate={handleProfileNavigation}
                      />
                    </div>
                  </div>
                </header>
                <MyBookings
                  user={user}
                  onBack={handleNavigateHome}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute user={user}>
              <div className="min-h-screen bg-cinema-light text-white">
                <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                      <button
                        onClick={handleNavigateHome}
                        className="flex items-center gap-2 sm:gap-3 group"
                      >
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                          <span className="text-2xl">🎬</span>
                        </div>
                        <div className="hidden sm:block">
                          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            ITS SHOW TIME
                          </h1>
                        </div>
                      </button>
                      <ProfileDropdown
                        user={user}
                        onLogout={handleLogout}
                        onNavigate={handleProfileNavigation}
                      />
                    </div>
                  </div>
                </header>
                <Wishlist
                  user={user}
                  onBack={handleNavigateHome}
                  onMovieSelect={handleMovieSelect}
                  onEventSelect={handleEventSelect}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute user={user}>
              {user?.role === 'owner' ? (
                <div className="min-h-screen bg-cinema-light text-white">
                  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                      <div className="flex items-center justify-between h-16">
                        <button
                          onClick={handleNavigateHome}
                          className="flex items-center gap-2 sm:gap-3 group"
                        >
                          <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                            <span className="text-2xl">🎬</span>
                          </div>
                          <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                              ITS SHOW TIME
                            </h1>
                          </div>
                        </button>
                        <ProfileDropdown
                          user={user}
                          onLogout={handleLogout}
                          onNavigate={handleProfileNavigation}
                        />
                      </div>
                    </div>
                  </header>
                  <OwnerDashboard user={user} />
                </div>
              ) : (
                <Navigate to="/home" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Booking Routes */}
        <Route
          path="/booking/movie"
          element={
            <ProtectedRoute user={user}>
              <BookingLayout
                selectedMovie={location.state?.movie || selectedMovie}
                currentStep={bookingStep}
                bookingDetails={bookingDetails}
                onBack={handleBack}
                onTimeSelect={handleTimeSelect}
                onSeatsSelect={handleSeatsSelect}
                onPaymentComplete={handlePaymentComplete}
                onNewBooking={handleNewBooking}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/event"
          element={
            <ProtectedRoute user={user}>
              <EventBookingLayout
                selectedEvent={location.state?.event || selectedEvent}
                currentStep={bookingStep}
                bookingDetails={bookingDetails}
                onBack={handleBack}
                onDateSelect={handleDateSelect}
                onZonesSelect={handleZonesSelect}
                onPaymentComplete={handlePaymentComplete}
                onNewBooking={handleNewBooking}
              />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// Main App Component with Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
