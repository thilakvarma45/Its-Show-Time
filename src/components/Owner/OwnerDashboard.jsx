import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Building2, Calendar, Menu, X, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import MovieListings from './MovieListings';
import BookingDetails from './BookingDetails';
import VenueManagement from './VenueManagement';
import SmartScheduler from './SmartScheduler';
import AccessDenied from './AccessDenied';

const OwnerDashboard = ({ user }) => {
  const [activeView, setActiveView] = useState('LISTINGS'); // 'LISTINGS' | 'VENUES' | 'SCHEDULER'
  const [selectedShow, setSelectedShow] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is owner (support both 'owner' and 'OWNER')
  if (!user || (user.role && user.role.toUpperCase() !== 'OWNER')) {
    return <AccessDenied />;
  }

  const handleSelectShow = (show) => {
    setSelectedShow(show);
  };

  const handleBackToListings = () => {
    setSelectedShow(null);
  };

  const navigationItems = [
    { id: 'LISTINGS', label: 'Movie Listings', icon: Film, description: 'Manage shows & bookings' },
    { id: 'VENUES', label: 'Venue Management', icon: Building2, description: 'Configure screens & seats' },
    { id: 'SCHEDULER', label: 'Smart Scheduler', icon: Calendar, description: 'Plan your showtimes' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Mobile Menu Button - Floating Fab */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-80 bg-slate-50/50 border-r border-slate-100 sticky top-0 h-screen overflow-y-auto backdrop-blur-xl">
          <div className="p-8 h-full flex flex-col">
            <div className="mb-10 pl-2">
              <h1 className="text-2xl font-black tracking-tighter text-slate-900">
                Producer<span className="text-indigo-600">Panel</span>.
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Venue Administration</p>
            </div>

            <nav className="space-y-2 flex-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id && !selectedShow;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setSelectedShow(null);
                    }}
                    className={`group w-full flex items-start text-left gap-4 p-4 rounded-2xl transition-all duration-300 ${isActive
                      ? 'bg-white shadow-xl shadow-slate-200 ring-1 ring-black/5'
                      : 'hover:bg-white hover:shadow-lg hover:shadow-slate-100'
                      }`}
                  >
                    <div className={`mt-0.5 p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`block font-bold text-base ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                        {item.description}
                      </span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-indigo-400 ml-auto mt-1" />}
                  </button>
                );
              })}
            </nav>


          </div>
        </aside>

        {/* Mobile Sidebar - Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
              />

              {/* Sidebar */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto shadow-2xl"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-xl font-black text-slate-900">Producer<span className="text-indigo-600">Panel</span></h1>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Venue Admin</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-3 flex-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id && !selectedShow;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveView(item.id);
                            setSelectedShow(null);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${isActive
                            ? 'bg-indigo-50 text-indigo-900 ring-1 ring-indigo-100'
                            : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                            }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <div className="text-left">
                            <span className="block font-bold">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-white">
          {/* Top Bar for Mobile */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-black text-slate-900">Producer<span className="text-indigo-600">Panel</span></h1>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'O'}
            </div>
          </div>

          <div className="p-4 sm:p-8 lg:p-12 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              {selectedShow ? (
                <motion.div
                  key="booking-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookingDetails item={selectedShow} owner={user} onBack={handleBackToListings} />
                </motion.div>
              ) : activeView === 'LISTINGS' ? (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-0">
                    <MovieListings onSelectShow={handleSelectShow} owner={user} />
                  </div>
                </motion.div>
              ) : activeView === 'VENUES' ? (
                <motion.div
                  key="venues"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <VenueManagement owner={user} />
                </motion.div>
              ) : (
                <motion.div
                  key="scheduler"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SmartScheduler owner={user} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
