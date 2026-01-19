import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-red-50 rounded-full">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-6">
          You don't have permission to access the Owner Dashboard. This area is restricted to authorized theatre and event owners only.
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Login
        </button>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
