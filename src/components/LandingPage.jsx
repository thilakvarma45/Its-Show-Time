import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Calendar, 
  Ticket, 
  Search, 
  Shield, 
  Clock, 
  Star,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle2,
  Play,
  Camera,
  Popcorn
} from 'lucide-react';

const LandingPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const userFeatures = [
    {
      icon: Search,
      title: 'Discover Movies',
      description: 'Browse thousands of movies from TMDB with real-time data and ratings',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Ticket,
      title: 'Easy Booking',
      description: 'Simple 4-step booking process: Select, Choose, Pay, Enjoy',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      title: 'Events & Movies',
      description: 'Book both movie tickets and live event passes in one place',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Star,
      title: 'Wishlist',
      description: 'Save your favorite movies and events for later booking',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const ownerFeatures = [
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track revenue, bookings, and occupancy rates in real-time',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Settings,
      title: 'Smart Scheduler',
      description: 'Schedule movies and events with intelligent time slot suggestions',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Venue Management',
      description: 'Manage multiple venues, capacities, and amenities easily',
      color: 'from-rose-500 to-rose-600'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications on bookings and revenue changes',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const benefits = [
    'Secure payment processing',
    'Real-time seat availability',
    'Mobile-friendly interface',
    '24/7 customer support',
    'Instant booking confirmation',
    'Digital ticket delivery'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SHOW TIME</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-sky-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Movie Camera Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl mb-8 shadow-xl"
            >
              <Camera className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 mb-6 leading-tight">
              Your Cinema
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-light">
              Book movies and events. For movie lovers and venue owners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all shadow-md"
              >
                Login
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="mt-16 flex items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Popcorn className="w-6 h-6 text-amber-500" />
                <span className="text-sm font-medium">Movies</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <Ticket className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-medium">Events</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <Play className="w-6 h-6 text-pink-500" />
                <span className="text-sm font-medium">Live Shows</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Users */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-slate-900 mb-4">For Movie Lovers</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-4 rounded-full"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Everything you need to discover and book your next entertainment experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(`user-${index}`)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all bg-gradient-to-br ${feature.color} ${
                  hoveredFeature === `user-${index}` ? 'scale-110 rotate-3' : ''
                }`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Owners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-slate-900 mb-4">For Venue Owners</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-4 rounded-full"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Powerful tools to manage your venues, schedule shows, and grow your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(`owner-${index}`)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all bg-gradient-to-br ${feature.color} ${
                  hoveredFeature === `owner-${index}` ? 'scale-110 rotate-3' : ''
                }`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-black text-slate-900 mb-6">
                Why Choose Show Time?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mb-8 rounded-full"></div>
              <p className="text-lg text-slate-600 mb-8 font-light">
                We've built a platform that works seamlessly for both entertainment seekers and venue managers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-light">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-slate-50 to-sky-50 p-12 rounded-2xl border border-slate-200 shadow-xl"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Film className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Real Movie Data</h3>
                    <p className="text-slate-600 font-light">Powered by TMDB API</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Secure Payments</h3>
                    <p className="text-slate-600 font-light">Multiple payment options</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Instant Booking</h3>
                    <p className="text-slate-600 font-light">Get confirmed in seconds</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <div className="w-32 h-1 bg-white mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
              Join thousands of users who are already booking their favorite movies and events with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group px-10 py-5 bg-white text-blue-600 font-black text-lg hover:bg-slate-50 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-10 py-5 bg-transparent border-2 border-white text-white font-black text-lg hover:bg-white/10 rounded-xl transition-all"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Show Time</span>
            </div>
            <p className="text-white/70 text-sm font-light">
              © 2024 Show Time. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
