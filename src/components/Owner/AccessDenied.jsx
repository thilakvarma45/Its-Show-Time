import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft } from 'lucide-react';

const AccessDenied = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-red-500/10 rounded-full">
            <ShieldX className="w-12 h-12 text-red-400" />
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Access Denied</h1>
        <p className="text-slate-400 mb-6">
          You don't have permission to access the Owner Dashboard. This area is restricted to authorized theatre and event owners only.
        </p>
        
        <button
          onClick={onLogout}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Login
        </button>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
