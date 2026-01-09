import { motion } from 'framer-motion';
import { DollarSign, Ticket, Users, Film } from 'lucide-react';
import { DASHBOARD_STATS } from '../../data/mockData';

const DashboardStats = () => {
  const stats = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `₹${DASHBOARD_STATS.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald',
      change: '+12.5%'
    },
    {
      id: 'tickets',
      label: 'Tickets Sold',
      value: DASHBOARD_STATS.ticketsSold.toLocaleString(),
      icon: Ticket,
      color: 'indigo',
      change: '+8.2%'
    },
    {
      id: 'occupancy',
      label: 'Occupancy %',
      value: `${DASHBOARD_STATS.occupancyPercent}%`,
      icon: Users,
      color: 'blue',
      change: '+3.1%'
    },
    {
      id: 'listings',
      label: 'Active Listings',
      value: DASHBOARD_STATS.activeListings,
      icon: Film,
      color: 'purple',
      change: '+2'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 uppercase tracking-wide">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-900 border border-slate-800 rounded-lg p-6 ${getColorClasses(stat.color)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-6 h-6 opacity-70" />
                <span className="text-xs font-medium opacity-70">{stat.change}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-mono font-bold ${stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'indigo' ? 'text-indigo-400' : stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">Quick Actions</h3>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider text-sm">
            Add Movie
          </button>
          <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider text-sm">
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
