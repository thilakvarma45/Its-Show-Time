import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  ArrowRight,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { fetchPopularMovies, fetchNowPlayingMovies } from '../services/tmdb';

const LandingPage = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Hero Scroll Animations: Dim and Zoom Out
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // State for different movie rows
  const [row1Movies, setRow1Movies] = useState([]);
  const [row2Movies, setRow2Movies] = useState([]);
  const [row3Movies, setRow3Movies] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch Movies from TMDB using existing functions
  useEffect(() => {
    const loadMovies = async () => {
      try {
        // Fetch diverse sets of movies
        const [popular1, popular2, nowPlaying] = await Promise.all([
          fetchPopularMovies(1),
          fetchPopularMovies(2),
          fetchNowPlayingMovies()
        ]);

        // Set state for each row
        // Duplicate arrays to ensure smooth infinite scroll
        setRow1Movies([...popular1.movies, ...popular1.movies]);
        setRow2Movies([...popular2.movies, ...popular2.movies]);
        setRow3Movies([...nowPlaying, ...nowPlaying]);

      } catch (error) {
        console.error("Failed to load movies", error);
        // Fallback handled by empty state rendering standard placeholders if needed
      }
    };
    loadMovies();
  }, []);

  const fallbackPosters = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=500&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans overflow-x-hidden selection:bg-rose-500 selection:text-white">

      {/* Dynamic Cursor Light */}
      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-500 mix-blend-multiply"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0), transparent 80%)`
        }}
      ></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 md:py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 group px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 hover:bg-white/90 transition-all">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
              <Ticket className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-slate-900">ShowTime.</span>
          </Link>

          <div className="flex items-center gap-2 bg-white/70 p-1.5 md:p-2 rounded-full shadow-lg shadow-black/5 border border-white/20 backdrop-blur-xl hover:bg-white/90 transition-all">
            <Link to="/login" className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-slate-600 hover:text-black transition-colors rounded-full hover:bg-white/50">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 md:px-6 md:py-2.5 bg-black text-white text-xs md:text-sm font-bold rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: Horizontal Marquee Posters using DIFFERENT Movies */}
      <section ref={targetRef} className="relative h-[100vh] min-h-[600px] overflow-hidden bg-black text-white flex flex-col justify-center">

        {/* Marquee Background Container */}
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0 flex flex-col justify-center gap-6 md:gap-8 md:rotate-[-6deg] scale-125 origin-center"
        >
          {/* Row 1 - Left */}
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {row1Movies.length > 0 ? row1Movies.map((movie, i) => (
              <PosterCard key={`r1-${i}`} movie={movie} />
            )) : fallbackPosters.map((url, i) => <PosterCard key={`fb1-${i}`} movie={{ poster: url }} />)}
          </div>

          {/* Row 2 - Right (Reverse) */}
          <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
            {row2Movies.length > 0 ? row2Movies.map((movie, i) => (
              <PosterCard key={`r2-${i}`} movie={movie} />
            )) : fallbackPosters.map((url, i) => <PosterCard key={`fb2-${i}`} movie={{ poster: url }} />)}
          </div>

          {/* Row 3 - Left */}
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {row3Movies.length > 0 ? row3Movies.map((movie, i) => (
              <PosterCard key={`r3-${i}`} movie={movie} />
            )) : fallbackPosters.map((url, i) => <PosterCard key={`fb3-${i}`} movie={{ poster: url }} />)}
          </div>

        </motion.div>

        {/* Gradient Overlays */}
        {/* Gradient Overlays - Darkened for text visibility */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 pt-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-8 pointer-events-auto shadow-2xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            {/* Using a distinct, brighter text color for visibility */}
            <span className="text-xs font-bold text-white tracking-wide uppercase shadow-sm">Millions of Tickets Sold</span>
          </motion.div>

          {/* Title with heavy shadow for readability over colored posters */}
          {/* Title with heavy shadow and glass effect for readability */}
          <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl">
            <span className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">BOOK THE</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-[0_10px_20px_rgba(0,0,0,1)] filter">
              MOMENT.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 max-w-xl mx-auto mb-10 font-medium leading-relaxed drop-shadow-md">
            Cinema, Concerts, Sports & More. <br className="hidden md:block" />
            Access the best events with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto w-full sm:w-auto px-6 sm:px-0">
            <Link to="/register" className="h-14 px-8 bg-rose-600 text-white rounded-full font-bold text-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-105 w-full sm:w-auto">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="h-14 px-8 bg-white/20 text-white border border-white/30 rounded-full font-bold text-lg hover:bg-white/30 transition-all backdrop-blur-md flex items-center justify-center w-full sm:w-auto shadow-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ADVANTAGES SECTION */}
      <section className="py-24 px-6 bg-white relative z-20 -mt-12 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Why ShowTime?</h2>
            <p className="text-slate-500 text-lg">A unified platform for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* For Users */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4">For Fans</h3>
              <ul className="space-y-3">
                {[
                  "No hidden fees or surprise charges",
                  "Interactive 3D seat selection",
                  "Instant QR code ticket delivery",
                  "24/7 Priority Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* For Owners - Lighter Premium Gradient */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-[2rem] border border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-shadow duration-300">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">For Venues</h3>
              <ul className="space-y-3">
                {[
                  "Real-time revenue analytics dashboard",
                  "Dynamic pricing tools & controls",
                  "Scanner app included for door staff",
                  "Direct payout to your bank account"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ENRICHED FEATURE CARDS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1]">
              Engineered for <br />
              <span className="text-slate-400">Pure Joy.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

            {/* Card 1: Revenue Analytics */}
            <div className="md:col-span-8 bg-[#F5F5F7] rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
              <div className="relative z-10 max-w-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold shadow-sm mb-4 text-emerald-600">
                  <TrendingUp className="w-3 h-3" /> Live Data
                </div>
                <h3 className="text-2xl font-black mb-3">Powerful Analytics</h3>
                <p className="text-slate-500 text-base font-medium leading-relaxed mb-6">
                  Owners get a crystal-clear view of their business. Track ticket sales, revenue, and occupancy in real-time.
                </p>
              </div>

              <div className="absolute bottom-0 right-0 w-full md:w-3/5 h-48 bg-white rounded-tl-[1.5rem] border-t border-l border-black/5 shadow-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-slate-400">Total Revenue</div>
                    <div className="text-xl font-black text-slate-900">₹1,24,592</div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+14.2%</div>
                </div>
                <div className="flex items-end gap-1.5 h-24 w-full mb-4">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-100 rounded-t-sm relative group/bar overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full bg-slate-900 transition-all duration-1000 group-hover/bar:bg-rose-500"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Tickets Sold</div>
                    <div className="text-sm font-black text-slate-900">14,203</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Avg. Price</div>
                    <div className="text-sm font-black text-slate-900">₹850</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive Seating */}
            <div className="md:col-span-4 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] p-8 overflow-hidden relative group">
              <div className="mb-4">
                <h3 className="text-xl font-black">Smart Seating</h3>
                <p className="text-slate-500 text-xs mt-1">Pick the perfect spot.</p>
              </div>

              <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100 p-3 relative">
                <div className="w-full h-3 bg-slate-200 rounded-full mb-6 text-[6px] flex items-center justify-center text-slate-400 uppercase tracking-widest font-bold">Screen</div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[...Array(36)].map((_, i) => {
                    const isSold = [2, 3, 8, 9, 14, 15, 22].includes(i);
                    const isSelected = i === 27;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-[4px] transition-all ${isSold ? 'bg-slate-200 opacity-50' :
                          isSelected ? 'bg-rose-500 shadow-md scale-110' :
                            'bg-white border border-black/10 hover:border-black/30'
                          }`}
                      ></div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Card 3: Ticket Visual */}
            <div className="md:col-span-6 bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-1">Paperless Entry</h3>
                  <p className="text-slate-400 text-sm">Your phone is your ticket.</p>
                </div>

                {/* Visual: Unique Holographic Ticket */}
                <div className="relative mt-8 group-hover:scale-105 transition-transform duration-500 w-full max-w-xs mx-auto">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

                  <div className="relative bg-zinc-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {/* Holographic Top */}
                    <div className="bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-violet-500/20 p-4 relative overflow-hidden backdrop-blur-sm">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Ticket className="w-20 h-20 rotate-12 text-cyan-400" />
                      </div>
                      <div className="relative z-10 flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] text-cyan-300 tracking-[0.2em] border border-cyan-500/50 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)]">VIP ACCESS</span>
                        <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                      </div>
                      <h4 className="font-black text-2xl uppercase tracking-tighter leading-none mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">Neon<br />Nights</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">World Tour 2026</p>
                    </div>

                    {/* Ticket Body with "Tear" effect */}
                    <div className="p-5 relative bg-zinc-900/90 backdrop-blur-md">
                      {/* Cutouts */}
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-slate-900 rounded-full"></div>
                      <div className="absolute -right-3 top-0 w-6 h-6 bg-slate-900 rounded-full"></div>
                      <div className="absolute left-3 right-3 top-3 border-t-2 border-dashed border-white/10"></div>

                      <div className="flex justify-between items-end mb-6 mt-4">
                        <div>
                          <div className="text-[9px] uppercase text-zinc-500 font-bold mb-0.5">Date</div>
                          <div className="text-sm font-bold text-white">Oct 24</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-zinc-500 font-bold mb-0.5">Time</div>
                          <div className="text-sm font-bold text-white">08:00 PM</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-zinc-500 font-bold mb-0.5">Gate</div>
                          <div className="text-sm font-bold text-cyan-400">A4</div>
                        </div>
                      </div>

                      {/* Barcode Strip */}
                      <div className="flex items-center justify-between">
                        <div className="h-8 flex gap-0.5 items-end opacity-40">
                          {[...Array(20)].map((_, i) => (
                            <div key={i} className={`w-0.5 bg-white ${Math.random() > 0.5 ? 'h-full' : 'h-2/3'}`}></div>
                          ))}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[10px] text-zinc-500">ID: 8X92</span>
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div> Sold
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div> Selected
                    </div>
                    <div className="text-xs font-bold text-slate-900">₹1,200</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Discovery */}
            <div className="md:col-span-6 bg-[#EFF0F6] rounded-[2rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="relative z-10 w-full max-w-sm">
                <h3 className="text-2xl font-black mb-1">Instant Discovery</h3>
                <p className="text-slate-500 font-medium text-sm mb-6">Trending in <span className="text-rose-600 font-bold">Hyderabad</span> right now.</p>

                <div className="flex gap-3 overflow-hidden mask-linear justify-center">
                  {(row3Movies.length > 0 ? row3Movies.slice(0, 3) : [1, 2, 3]).map((item, i) => (
                    <div key={i} className="w-20 h-28 bg-white rounded-lg shadow-md border border-white/50 p-1 transform transition-transform hover:-translate-y-2 overflow-hidden">
                      {typeof item === 'object' && item.poster ? (
                        <img src={item.poster} className="w-full h-full object-cover rounded-md" alt="Mini Poster" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 animate-pulse rounded-md"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Footer */}
      <div className="py-8 bg-black overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          {['Blockbusters', 'Live Sports', 'Comedy Specials', 'Theater', 'Workshops', 'Concerts', 'Blockbusters', 'Live Sports'].map((item, i) => (
            <span key={i} className="text-3xl font-black text-white/20 uppercase tracking-tighter">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">ShowTime.</span>
            </div>
            <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
              Redefining entertainment booking.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>© 2026 ShowTime Inc.</p>
        </div>
      </footer>

      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .mask-linear {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
};

// Poster Card Component for Horizontal Marquee
const PosterCard = ({ movie }) => (
  <div className="w-40 md:w-52 aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 relative group flex-shrink-0 shadow-2xl border-2 border-white/10">
    <img
      src={movie.poster || movie}
      alt={movie.title || "Poster"}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.style.backgroundColor = '#1e293b'; // slate-800
      }}
    />
  </div>
);

export default LandingPage;
