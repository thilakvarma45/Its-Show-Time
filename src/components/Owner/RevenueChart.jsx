import { motion } from 'framer-motion';
import { REVENUE_CHART_DATA } from '../../data/mockData';

const RevenueChart = () => {
  // Find max revenue for scaling
  const maxRevenue = Math.max(...REVENUE_CHART_DATA.map(d => d.revenue));
  
  // Calculate bar heights as percentages
  const chartData = REVENUE_CHART_DATA.map(item => ({
    ...item,
    heightPercent: (item.revenue / maxRevenue) * 100
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wide">Revenue Trend (Last 7 Days)</h3>
      
      <div className="flex items-end justify-between gap-2 h-64">
        {chartData.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col items-center gap-2"
          >
            {/* Bar */}
            <div className="w-full flex flex-col items-center justify-end h-full">
              <motion.div
                className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg hover:from-emerald-400 hover:to-emerald-300 transition-all cursor-pointer relative group"
                style={{ height: `${item.heightPercent}%` }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  ₹{item.revenue.toLocaleString()}
                </div>
              </motion.div>
            </div>
            
            {/* Day Label */}
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-2">
              {item.day}
            </div>
            
            {/* Revenue Value */}
            <div className="text-xs font-mono text-emerald-400 font-semibold">
              ₹{(item.revenue / 1000).toFixed(0)}k
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Chart Legend */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
        <span>Total Weekly Revenue: <span className="font-mono text-emerald-400 font-semibold">₹{REVENUE_CHART_DATA.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</span></span>
        <span>Average Daily: <span className="font-mono text-emerald-400 font-semibold">₹{Math.round(REVENUE_CHART_DATA.reduce((sum, d) => sum + d.revenue, 0) / REVENUE_CHART_DATA.length).toLocaleString()}</span></span>
      </div>
    </div>
  );
};

export default RevenueChart;
