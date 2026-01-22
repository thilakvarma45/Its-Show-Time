import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Ticket, Clapperboard, Mail, Lock, User, Building2, Sparkles } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' or 'owner'
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    theatreName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If owner registration, save to localStorage and show success
    if (!isLogin && role === 'owner') {
      // Store owner registration in localStorage
      const ownerData = {
        email: formData.email,
        name: formData.name,
        role: 'owner',
        theatreName: formData.theatreName
      };
      
      // Get existing owners or create new array
      const existingOwners = JSON.parse(localStorage.getItem('cineverse_owners') || '[]');
      // Check if email already exists, if not add it
      const ownerExists = existingOwners.find(o => o.email === formData.email);
      if (!ownerExists) {
        existingOwners.push(ownerData);
        localStorage.setItem('cineverse_owners', JSON.stringify(existingOwners));
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', theatreName: '' });
      }, 3000);
      return;
    }
    
    // For user registration, also store in localStorage
    if (!isLogin && role === 'user') {
      const userData = {
        email: formData.email,
        name: formData.name,
        role: 'user'
      };
      const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '[]');
      const userExists = existingUsers.find(u => u.email === formData.email);
      if (!userExists) {
        existingUsers.push(userData);
        localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));
      }
    }
    
    // Simulate authentication
    // For login, check localStorage to determine role and retrieve user data
    let userRole = 'user';
    let userData = { ...formData };
    
    if (isLogin) {
      // Check if email exists in owners list
      const owners = JSON.parse(localStorage.getItem('cineverse_owners') || '[]');
      const owner = owners.find(o => o.email === formData.email);
      if (owner) {
        userRole = 'owner';
        userData = {
          ...formData,
          name: owner.name,
          theatreName: owner.theatreName,
          role: 'owner'
        };
      } else {
        // Check if email exists in users list
        const users = JSON.parse(localStorage.getItem('cineverse_users') || '[]');
        const user = users.find(u => u.email === formData.email);
        if (user) {
          userRole = 'user';
          userData = {
            ...formData,
            name: user.name,
            role: 'user'
          };
        } else {
          // New login - default to user (could show error here)
          userRole = 'user';
        }
      }
    } else {
      // Registration - use selected role
      userRole = role;
    }
    
    onAuthSuccess({
      ...userData,
      role: userRole
    });
  };

  const isUser = role === 'user';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Gradient Effects */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Sparkles className={`w-8 h-8 ${isUser ? 'text-amber-500' : 'text-violet-600'}`} />
                <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-widest">
                  Its Show Time
                </h1>
              </motion.div>
              
              <AnimatePresence mode="wait">
                <motion.h2
                  key={isLogin ? 'login' : 'register'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-xl md:text-2xl font-semibold ${isUser ? 'text-amber-600' : 'text-violet-600'} uppercase tracking-wider`}
                >
                  {isLogin ? 'Back to the Movies' : 'Schedule your Show'}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Role Selector - Register Only */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <label className="block text-slate-600 text-sm mb-3 uppercase tracking-wider text-center font-semibold">
                  Choose Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* User Card */}
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isUser
                        ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-500/20'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Ticket className={`w-6 h-6 mx-auto mb-2 ${isUser ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div className={`text-xs font-semibold uppercase tracking-wider ${isUser ? 'text-amber-700' : 'text-slate-600'}`}>
                      The Audience
                    </div>
                    <div className={`text-[10px] mt-1 ${isUser ? 'text-amber-600' : 'text-slate-500'}`}>
                      I want to watch
                    </div>
                  </button>

                  {/* Owner Card */}
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !isUser
                        ? 'border-violet-400 bg-violet-50 shadow-lg shadow-violet-500/20'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Clapperboard className={`w-6 h-6 mx-auto mb-2 ${!isUser ? 'text-violet-600' : 'text-slate-400'}`} />
                    <div className={`text-xs font-semibold uppercase tracking-wider ${!isUser ? 'text-violet-700' : 'text-slate-600'}`}>
                      The Producer
                    </div>
                    <div className={`text-[10px] mt-1 ${!isUser ? 'text-violet-600' : 'text-slate-500'}`}>
                      I want to host
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Success Message - Owner Registration */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                >
                  <div className="text-emerald-700 font-semibold uppercase tracking-wider text-sm">
                    Studio Registered!
                  </div>
                  <div className="text-emerald-600 text-xs mt-1">
                    Please log in to access your console.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name - Register Only */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isUser ? 'text-amber-500' : 'text-violet-500'}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required={!isLogin}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${isUser ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-violet-500 focus:border-violet-500'} transition-colors`}
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isUser ? 'text-amber-500' : 'text-violet-500'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${isUser ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-violet-500 focus:border-violet-500'} transition-colors`}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isUser ? 'text-amber-500' : 'text-violet-500'}`} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    minLength={6}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${isUser ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-violet-500 focus:border-violet-500'} transition-colors`}
                  />
                </div>
              </motion.div>

              {/* Theatre Name - Owner Only */}
              {!isLogin && !isUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
                    <input
                      type="text"
                      name="theatreName"
                      value={formData.theatreName}
                      onChange={handleChange}
                      placeholder="Theatre Name"
                      required={!isUser}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                type="submit"
                className={`w-full py-4 bg-gradient-to-r ${
                  isUser
                    ? 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30'
                    : 'from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/30'
                } text-white rounded-xl font-semibold uppercase tracking-wider transition-all transform hover:scale-[1.02]`}
              >
                {isLogin 
                  ? 'Login' 
                  : isUser 
                    ? 'Register' 
                    : 'Open Box Office'
                }
              </motion.button>
            </form>

            {/* Switch Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '', theatreName: '' });
                  if (isLogin) setRole('user');
                }}
                className="text-slate-600 hover:text-slate-800 text-sm transition-colors"
              >
                {isLogin ? (
                  <>
                    New to the show? <span className={`${isUser ? 'text-amber-600' : 'text-violet-600'} font-semibold`}>Book a cameo</span>
                  </>
                ) : (
                  <>
                    Already cast? <span className={`${isUser ? 'text-amber-600' : 'text-violet-600'} font-semibold`}>Sign in</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

