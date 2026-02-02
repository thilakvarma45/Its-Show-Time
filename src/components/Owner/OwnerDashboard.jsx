import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Building2, Calendar, Menu, X } from 'lucide-react';
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
    { id: 'LISTINGS', label: 'Movie Listings', icon: Film },
    { id: 'VENUES', label: 'Venues', icon: Building2 },
    { id: 'SCHEDULER', label: 'Scheduler', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar Navigation - Desktop (sticky + scrollable) */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Producer Panel
            </h2>
            <nav className="space-y-2">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
              
              {/* Sidebar */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-slate-200 z-40 overflow-y-auto"
              >
                <div className="p-6">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Producer Panel
                  </h2>
                  <nav className="space-y-2">
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
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {selectedShow ? (
              <motion.div
                key="booking-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BookingDetails item={selectedShow} onBack={handleBackToListings} />
              </motion.div>
            ) : activeView === 'LISTINGS' ? (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MovieListings onSelectShow={handleSelectShow} owner={user} />
              </motion.div>
            ) : activeView === 'VENUES' ? (
              <motion.div
                key="venues"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VenueManagement owner={user} />
              </motion.div>
            ) : (
              <motion.div
                key="scheduler"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SmartScheduler owner={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
