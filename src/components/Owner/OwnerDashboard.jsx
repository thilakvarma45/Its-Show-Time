import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Building2, Calendar, LogOut } from 'lucide-react';
import DashboardStats from './DashboardStats';
import RevenueChart from './RevenueChart';
import VenueManagement from './VenueManagement';
import SmartScheduler from './SmartScheduler';
import AccessDenied from './AccessDenied';

const OwnerDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('DASHBOARD'); // 'DASHBOARD' | 'VENUES' | 'SCHEDULER'

  // Check if user is owner
  if (!user || user.role !== 'owner') {
    return <AccessDenied onLogout={onLogout} />;
  }

  const navigationItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'VENUES', label: 'Venues', icon: Building2 },
    { id: 'SCHEDULER', label: 'Scheduler', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wide uppercase">CineVerse Control Room</h1>
            <p className="text-sm text-slate-400 mt-1">
              {user?.name || 'Nolan Enterprises'} • Director Console
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm uppercase tracking-wider bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-400'
                      : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeView === 'DASHBOARD' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <DashboardStats />
                <RevenueChart />
              </motion.div>
            )}
            {activeView === 'VENUES' && (
              <motion.div
                key="venues"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VenueManagement />
              </motion.div>
            )}
            {activeView === 'SCHEDULER' && (
              <motion.div
                key="scheduler"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SmartScheduler />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
