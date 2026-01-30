import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clapperboard, Mail, Lock, User, Film, Eye, EyeOff, CheckCircle } from 'lucide-react';

/**
 * Register screen with role selector (user / owner).
 * Calls backend /api/auth/register and passes created user back.
 */
const Register = ({ onAuthSuccess }) => {
  const [role, setRole] = useState('user'); // 'user' or 'owner'
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role === 'owner' ? 'OWNER' : 'USER',
          theatreName: null,
          phone: null,
          location: null,
        }),
      });

      if (res.status === 409) {
        throw new Error('Email already registered');
      }
      if (!res.ok) {
        throw new Error('Registration failed');
      }

      // Auto-login to get the token
      const loginRes = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!loginRes.ok) {
        // Fallback: just redirect to login if auto-login fails
        window.location.href = '/login';
        return;
      }

      const authData = await loginRes.json();

      if (authData.token) {
        localStorage.setItem('token', authData.token);
      }

      // Show success message briefly
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onAuthSuccess(authData);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isUser = role === 'user';

  // Dynamic colors based on role
  const focusColor = isUser ? 'orange' : 'purple';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-7">
            {/* Header */}
            <div className="text-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-3 shadow-lg"
              >
                <Film className="w-7 h-7 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-black mb-1 text-slate-900"
              >
                ITS SHOW TIME
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-xs"
              >
                Create your account to get started
              </motion.p>
            </div>

            {/* Role Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <label className="block text-slate-700 text-xs font-medium mb-2 text-center">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* User */}
                <motion.button
                  type="button"
                  onClick={() => setRole('user')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-3 rounded-lg border-2 transition-all ${isUser
                      ? 'border-orange-400 bg-orange-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                  {isUser && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5"
                    >
                      <CheckCircle className="w-4 h-4 text-orange-500 fill-orange-50" />
                    </motion.div>
                  )}
                  <Ticket className={`w-6 h-6 mx-auto mb-1.5 ${isUser ? 'text-orange-500' : 'text-slate-400'}`} />
                  <div className={`text-xs font-bold ${isUser ? 'text-orange-600' : 'text-slate-600'}`}>
                    Movie Lover
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isUser ? 'text-orange-500' : 'text-slate-500'}`}>
                    Book tickets
                  </div>
                </motion.button>

                {/* Owner */}
                <motion.button
                  type="button"
                  onClick={() => setRole('owner')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-3 rounded-lg border-2 transition-all ${!isUser
                      ? 'border-purple-400 bg-purple-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                  {!isUser && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5"
                    >
                      <CheckCircle className="w-4 h-4 text-purple-500 fill-purple-50" />
                    </motion.div>
                  )}
                  <Clapperboard className={`w-6 h-6 mx-auto mb-1.5 ${!isUser ? 'text-purple-500' : 'text-slate-400'}`} />
                  <div className={`text-xs font-bold ${!isUser ? 'text-purple-600' : 'text-slate-600'}`}>
                    Venue Owner
                  </div>
                  <div className={`text-[10px] mt-0.5 ${!isUser ? 'text-purple-500' : 'text-slate-500'}`}>
                    Manage venues
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1.5" />
                  <div className="text-green-700 font-bold">
                    Account Created!
                  </div>
                  <div className="text-green-600 text-xs mt-0.5">
                    Redirecting you now...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className={`w-full pl-10 pr-3 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${isUser
                        ? 'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                        : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10'
                      }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className={`w-full pl-10 pr-3 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${isUser
                        ? 'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                        : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10'
                      }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${isUser
                        ? 'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10'
                        : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="mt-5 text-center">
              <p className="text-slate-600 text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-slate-500 text-xs mt-3"
          >
            By signing up, you agree to our Terms & Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

