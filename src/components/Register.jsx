import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clapperboard, Mail, Lock, User, Sparkles } from 'lucide-react';

/**
 * Register screen with role selector (user / owner).
 * Calls backend /api/auth/register and passes created user back.
 */
const Register = ({ onAuthSuccess }) => {
  const [role, setRole] = useState('user'); // 'user' or 'owner'
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
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

      const user = await res.json();

      // For owners, briefly show success message, then let parent route decide navigation
      if (role === 'owner') {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onAuthSuccess(user);
        }, 1500);
      } else {
        onAuthSuccess(user);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isUser = role === 'user';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Sparkles className={`w-8 h-8 ${isUser ? 'text-amber-500' : 'text-violet-600'}`} />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-widest">
                  Its Show Time
                </h1>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.h2
                  key="register-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-xl font-semibold ${isUser ? 'text-amber-600' : 'text-violet-600'} uppercase tracking-wider`}
                >
                  Create your account
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Role Selector */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <label className="block text-slate-600 text-sm mb-3 uppercase tracking-wider text-center font-semibold">
                Choose Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* User */}
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

                {/* Owner */}
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

            {/* Success for owner */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                >
                  <div className="text-emerald-700 font-semibold uppercase tracking-wider text-sm">
                    Owner Registered!
                  </div>
                  <div className="text-emerald-600 text-xs mt-1">
                    Redirecting to your console...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isUser ? 'text-amber-500' : 'text-violet-500'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isUser ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-violet-500 focus:border-violet-500'
                  } transition-colors`}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isUser ? 'text-amber-500' : 'text-violet-500'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isUser ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-violet-500 focus:border-violet-500'
                  } transition-colors`}
                />
              </div>

              {/* Password */}
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
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isUser ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-violet-500 focus:border-violet-500'
                  } transition-colors`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`w-full py-4 bg-gradient-to-r ${
                  isUser
                    ? 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30'
                    : 'from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/30'
                } text-white rounded-xl font-semibold uppercase tracking-wider transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {submitting ? 'Creating account...' : isUser ? 'Register' : 'Open Box Office'}
              </motion.button>
            </form>

            {error && (
              <div className="mt-4 text-center text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

