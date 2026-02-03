import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Login screen.
 * Talks to backend /api/auth/login and passes the authenticated user
 * back via onAuthSuccess.
 */
const Login = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!res.ok) {
        throw new Error('Invalid email or password');
      }
      const user = await res.json();

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Save token to localStorage
      if (user.token) {
        localStorage.setItem('token', user.token);
      }
      // Persist user so refresh keeps session
      localStorage.setItem('authUser', JSON.stringify(user));

      onAuthSuccess(user);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden flex items-center justify-center p-6 selection:bg-rose-500 selection:text-white">

      {/* Dynamic Cursor Light */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 mix-blend-multiply opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(244,63,94,0.15), transparent 80%)`
        }}
      ></div>

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-br from-rose-50 to-indigo-50 rounded-bl-[10rem] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-slate-50 rounded-tr-[10rem] -z-10"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40">

        {/* Left Side: Visual */}
        <div className="hidden md:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white overflow-hidden group">
          {/* Abstract Background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900"></div>

          {/* Floating Posters Layer - Behind Text */}
          <div className="absolute inset-0 z-0 opacity-60">
            {/* Poster 1 */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [6, 12, 6] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-[-40px] w-48 h-72 rounded-xl shadow-2xl border-4 border-white/5 overflow-hidden transform rotate-6"
            >
              <img src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover" alt="Concert" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </motion.div>

            {/* Poster 2 */}
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [-6, 0, -6] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-40 -left-10 w-40 h-60 rounded-xl shadow-2xl border-4 border-white/5 overflow-hidden transform -rotate-6"
            >
              <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover" alt="Movie" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </motion.div>

            {/* Golden Ticket */}
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-64 h-32 bg-gradient-to-r from-yellow-500 via-amber-200 to-yellow-500 rounded-lg shadow-[0_0_50px_rgba(234,179,8,0.3)] flex items-center justify-between p-4 border border-white/20"
            >
              <div className="border-r-2 border-dashed border-black/20 h-full pr-4 flex items-center justify-center">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
                  <span className="font-black text-black/50 text-xl">ST</span>
                </div>
              </div>
              <div className="flex-1 pl-4">
                <div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Admit One</div>
                <div className="text-2xl font-black text-black/80 tracking-tighter">PREMIUM</div>
                <div className="flex gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-black/20"></div>
                  <div className="w-2 h-2 rounded-full bg-black/20"></div>
                  <div className="w-10 h-2 rounded-full bg-black/10"></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 group backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all">
              <div className="w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg">
                <span className="font-bold text-lg">S</span>
              </div>
              <span className="text-lg font-black tracking-tight">ShowTime.</span>
            </Link>
          </div>

          <div className="relative z-10 mt-auto backdrop-blur-sm bg-black/30 p-6 rounded-3xl border border-white/10">
            <h2 className="text-4xl font-black leading-tight mb-3">
              Welcome Back.
            </h2>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              "The cinema has no boundary; it is a ribbon of dream." <br /> <span className="text-slate-400 italic mt-1 block">- Orson Welles</span>
            </p>
          </div>

          {/* Decor */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white/50 backdrop-blur-xl">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center md:text-left mb-10">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Sign In</h1>
              <p className="text-slate-500 font-medium text-sm">
                New user? <Link to="/register" className="text-rose-600 font-bold hover:text-rose-700 transition-colors">Create an account</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-rose-600 hover:text-rose-700">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-rose-500 border-rose-500' : 'border-slate-300 bg-white group-hover:border-rose-400'}`}>
                    {rememberMe && <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>}
                  </div>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-sm text-rose-600 font-medium"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-rose-600 transition-all flex items-center justify-center gap-2 group shadow-xl hover:shadow-rose-500/20 hover:-translate-y-0.5"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
              Protected by ShowTime Security. <br /> By logging in you agree to our Terms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

