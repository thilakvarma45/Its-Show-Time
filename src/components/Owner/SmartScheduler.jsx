
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Film, Calendar, X, Plus, Loader2, Search, Upload, Image as ImageIcon, ChevronDown } from 'lucide-react';
// import { searchMovies } from '../../services/tmdb';
// import { toast } from 'react-toastify';

// const SmartScheduler = ({ owner }) => {
//   const [activeTab, setActiveTab] = useState('MOVIE'); // 'MOVIE' | 'EVENT'
//   const [movieResults, setMovieResults] = useState([]);
//   const [loadingMovies, setLoadingMovies] = useState(false);
//   const [movieSearchQuery, setMovieSearchQuery] = useState('');
//   const [movieDropdownOpen, setMovieDropdownOpen] = useState(false);

//   // Movie scheduling state
//   const [movieForm, setMovieForm] = useState({
//     venueId: '',
//     movieId: '',
//     // scheduling window
//     schedulePreset: '7', // '7' | '14' | 'custom'
//     startDate: '',
//     endDate: '',
//     // show times
//     confirmedShows: [],
//     customTime: '',
//     // pricing
//     goldPrice: '',
//     silverPrice: '',
//     vipPrice: ''
//   });

//   // Search movies from TMDB while typing (debounced)
//   useEffect(() => {
//     const loadMovies = async () => {
//       try {
//         const q = movieSearchQuery.trim();
//         if (!q) {
//           setMovieResults([]);
//           setLoadingMovies(false);
//           return;
//         }

//         setLoadingMovies(true);
//         const result = await searchMovies(q, 1);
//         setMovieResults(result?.movies || []);
//       } catch (err) {
//         console.error('Error loading movies:', err);
//         setMovieResults([]);
//       } finally {
//         setLoadingMovies(false);
//       }
//     };

//     // Debounce search to avoid too many API calls
//     const timeoutId = setTimeout(() => {
//       loadMovies();
//     }, movieSearchQuery.trim() ? 500 : 0);

//     return () => clearTimeout(timeoutId);
//   }, [movieSearchQuery]);

//   // Event scheduling state
//   const [eventForm, setEventForm] = useState({
//     venueId: '',
//     eventName: '',
//     artist: '',
//     imageUrl: '',
//     description: '',
//     address: '',
//     dates: [],
//     zones: []
//   });

//   const [eventImageFile, setEventImageFile] = useState(null);
//   const [eventImagePreview, setEventImagePreview] = useState(null);
//   const [uploadingEventImage, setUploadingEventImage] = useState(false);

//   // Suggested time slots
//   const suggestedSlots = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'];

//   // Venues will be provided from backend / owner context instead of mock data
//   const [venues, setVenues] = useState([]);

//   // Filter venues by type (backend uses enum THEATRE / EVENT_GROUND)
//   const theatreVenues = venues.filter(v => {
//     const t = (v.type || '').toString().toUpperCase();
//     return t === 'THEATRE';
//   });
//   const eventVenues = venues.filter(v => {
//     const t = (v.type || '').toString().toUpperCase();
//     return t === 'EVENT_GROUND';
//   });

//   // Load venues for this owner (if provided)
//   useEffect(() => {
//     const loadVenues = async () => {
//       try {
//         if (!owner?.id) {
//           setVenues([]);
//           return;
//         }
//         const token = localStorage.getItem('token');
//         const res = await fetch(`http://localhost:8080/api/venues/owner/${owner.id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         if (!res.ok) {
//           throw new Error('Failed to load venues');
//         }
//         const data = await res.json();
//         setVenues(data);
//       } catch (err) {
//         console.error('Error loading venues:', err);
//         setVenues([]);
//       }
//     };
//     loadVenues();
//   }, [owner]);

//   // Helper to calculate end date for 7/14 presets
//   const calculateEndDate = (start, days) => {
//     if (!start) return '';
//     const startDate = new Date(start);
//     if (Number.isNaN(startDate.getTime())) return '';
//     const end = new Date(startDate);
//     end.setDate(startDate.getDate() + (days - 1));
//     return end.toISOString().split('T')[0];
//   };

//   // Movie form handlers
//   const handleMovieInputChange = (e) => {
//     const { name, value } = e.target;
//     // When changing the preset, auto-update endDate if we already have a startDate
//     if (name === 'schedulePreset') {
//       if (value === '7' || value === '14') {
//         setMovieForm(prev => {
//           const days = value === '7' ? 7 : 14;
//           const newEnd = calculateEndDate(prev.startDate || new Date().toISOString().split('T')[0], days);
//           return {
//             ...prev,
//             schedulePreset: value,
//             startDate: prev.startDate || new Date().toISOString().split('T')[0],
//             endDate: newEnd
//           };
//         });
//       } else {
//         // custom - keep dates as-is, user will pick both
//         setMovieForm(prev => ({ ...prev, schedulePreset: value }));
//       }
//       return;
//     }

//     if (name === 'startDate') {
//       setMovieForm(prev => {
//         // If preset is 7 or 14, recompute endDate automatically
//         if (prev.schedulePreset === '7' || prev.schedulePreset === '14') {
//           const days = prev.schedulePreset === '7' ? 7 : 14;
//           return {
//             ...prev,
//             startDate: value,
//             endDate: calculateEndDate(value, days)
//           };
//         }
//         return { ...prev, startDate: value };
//       });
//       return;
//     }

//     setMovieForm(prev => ({ ...prev, [name]: value }));
//   };

//   const addSuggestedSlot = (slot) => {
//     if (!movieForm.confirmedShows.includes(slot)) {
//       setMovieForm(prev => ({
//         ...prev,
//         confirmedShows: [...prev.confirmedShows, slot]
//       }));
//     }
//   };

//   const removeShow = (slot) => {
//     setMovieForm(prev => ({
//       ...prev,
//       confirmedShows: prev.confirmedShows.filter(s => s !== slot)
//     }));
//   };

//   const handleCustomTimeSubmit = (e) => {
//     e.preventDefault();
//     if (movieForm.customTime && !movieForm.confirmedShows.includes(movieForm.customTime)) {
//       setMovieForm(prev => ({
//         ...prev,
//         confirmedShows: [...prev.confirmedShows, prev.customTime],
//         customTime: ''
//       }));
//     }
//   };

//   const handleMovieSubmit = async (e) => {
//     e.preventDefault();

//     if (!movieForm.venueId || !movieForm.movieId) {
//       toast.error('Please select both a venue and a movie.');
//       return;
//     }
//     if (!movieForm.startDate || !movieForm.endDate) {
//       toast.error('Please select a valid start and end date.');
//       return;
//     }
//     if (movieForm.confirmedShows.length === 0) {
//       toast.error('Please add at least one show time.');
//       return;
//     }

//     try {
//       const payload = {
//         venueId: Number(movieForm.venueId),
//         tmdbMovieId: Number(movieForm.movieId),
//         startDate: movieForm.startDate,
//         endDate: movieForm.endDate,
//         showtimes: movieForm.confirmedShows,
//         silverPrice: Number(movieForm.silverPrice || 0),
//         goldPrice: Number(movieForm.goldPrice || 0),
//         vipPrice: Number(movieForm.vipPrice || 0),
//       };

//       const token = localStorage.getItem('token');
//       const res = await fetch('http://localhost:8080/api/schedules', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         console.error('Failed to create schedule:', text);
//         toast.error('Failed to create movie schedule. Please check backend logs.');
//         return;
//       }

//       const data = await res.json();
//       toast.success(`Movie schedule created! Schedule #${data.scheduleId} • Shows: ${data.generatedShowCount}`);

//       setMovieForm({
//         venueId: '',
//         movieId: '',
//         schedulePreset: '7',
//         startDate: '',
//         endDate: '',
//         confirmedShows: [],
//         customTime: '',
//         goldPrice: '',
//         silverPrice: '',
//         vipPrice: ''
//       });
//     } catch (err) {
//       console.error('Error calling schedule API:', err);
//       toast.error('Unexpected error while creating schedule. See console for details.');
//     }
//   };

//   // Event form handlers
//   const handleEventInputChange = (e) => {
//     const { name, value } = e.target;
//     setEventForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleEventImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please select an image file');
//         return;
//       }
//       setEventImageFile(file);
//       setEventImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const uploadEventImage = async () => {
//     if (!eventImageFile) return null;

//     setUploadingEventImage(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', eventImageFile);

//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8080/api/upload/event', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload image');
//       }

//       const data = await response.json();
//       return `http://localhost:8080${data.imageUrl}`;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Failed to upload image');
//       return null;
//     } finally {
//       setUploadingEventImage(false);
//     }
//   };

//   // Date management for events
//   const addDate = () => {
//     const dateId = `date_${Date.now()}`;
//     setEventForm(prev => ({
//       ...prev,
//       dates: [...prev.dates, { id: dateId, date: '', time: '' }]
//     }));
//   };

//   const updateDate = (dateId, field, value) => {
//     setEventForm(prev => ({
//       ...prev,
//       dates: prev.dates.map(date =>
//         date.id === dateId ? { ...date, [field]: value } : date
//       )
//     }));
//   };

//   const removeDate = (dateId) => {
//     setEventForm(prev => ({
//       ...prev,
//       dates: prev.dates.filter(date => date.id !== dateId)
//     }));
//   };

//   const addZone = () => {
//     setEventForm(prev => ({
//       ...prev,
//       zones: [...prev.zones, {
//         id: `zone_${Date.now()}`,
//         name: '',
//         capacity: '',
//         adultPrice: '',
//         childrenPrice: ''
//       }]
//     }));
//   };

//   const updateZone = (zoneId, field, value) => {
//     setEventForm(prev => ({
//       ...prev,
//       zones: prev.zones.map(zone =>
//         zone.id === zoneId ? { ...zone, [field]: value } : zone
//       )
//     }));
//   };

//   const removeZone = (zoneId) => {
//     setEventForm(prev => ({
//       ...prev,
//       zones: prev.zones.filter(zone => zone.id !== zoneId)
//     }));
//   };

//   const handleEventSubmit = async (e) => {
//     e.preventDefault();

//     if (!owner?.id) {
//       toast.error('Owner information is missing. Please refresh and try again.');
//       return;
//     }

//     if (eventForm.dates.length === 0) {
//       toast.error('Please add at least one date for the event.');
//       return;
//     }

//     if (eventForm.zones.length === 0) {
//       toast.error('Please add at least one zone for the event.');
//       return;
//     }

//     try {
//       // Upload image first if file is selected
//       let uploadedImageUrl = eventForm.imageUrl;
//       if (eventImageFile) {
//         uploadedImageUrl = await uploadEventImage();
//         if (!uploadedImageUrl) {
//           toast.error('Failed to upload event image');
//           return;
//         }
//       }

//       // Get venue to get address if not provided
//       const selectedVenue = eventVenues.find(v => v.id === Number(eventForm.venueId));
//       if (!selectedVenue) {
//         toast.error('Please select a valid venue.');
//         return;
//       }

//       // Build eventConfig JSON matching frontend expectations
//       const zoneColors = [
//         'border-purple-500',
//         'border-pink-500',
//         'border-yellow-500',
//         'border-blue-500',
//         'border-green-500',
//         'border-red-500'
//       ];

//       const eventConfig = {
//         dates: eventForm.dates.map((d, idx) => ({
//           id: d.id || `date_${idx + 1}`,
//           label: d.date && d.time
//             ? `${new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | ${d.time}`
//             : d.date || `Date ${idx + 1}`,
//           date: d.date,
//           time: d.time || ''
//         })),
//         zones: eventForm.zones.map((z, idx) => ({
//           id: z.id || `zone_${idx + 1}`,
//           name: z.name || `Zone ${idx + 1}`,
//           capacity: Number(z.capacity) || 0,
//           color: zoneColors[idx % zoneColors.length], // Assign color for UI
//           categories: [
//             { type: 'Adult', price: Number(z.adultPrice) || 0 },
//             { type: 'Children', price: Number(z.childrenPrice) || 0 }
//           ]
//         }))
//       };

//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8080/api/events', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           ownerId: owner.id,
//           venueId: Number(eventForm.venueId),
//           title: eventForm.eventName,
//           description: eventForm.artist || eventForm.description || '',
//           posterUrl: uploadedImageUrl || '',
//           address: eventForm.address || selectedVenue.address || selectedVenue.location || '',
//           eventConfig: JSON.stringify(eventConfig)
//         })
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         console.error('Failed to create event:', text);
//         toast.error('Failed to create event. Please check backend logs.');
//         return;
//       }

//       const data = await response.json();
//       toast.success(`Event "${eventForm.eventName}" created successfully!`);

//       // Reset form and image states
//       setEventImageFile(null);
//       setEventImagePreview(null);
//       setEventForm({
//         venueId: '',
//         eventName: '',
//         artist: '',
//         imageUrl: '',
//         description: '',
//         address: '',
//         dates: [],
//         zones: []
//       });
//     } catch (err) {
//       console.error('Error creating event:', err);
//       toast.error('Unexpected error while creating event. See console for details.');
//     }
//   };

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       <div>
//         <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">Smart Scheduler</h2>
//         <p className="text-sm sm:text-base text-slate-600">Schedule movies and create events</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto">
//         <button
//           onClick={() => setActiveTab('MOVIE')}
//           className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${activeTab === 'MOVIE'
//               ? 'border-violet-500 text-violet-600'
//               : 'border-transparent text-slate-500 hover:text-slate-700'
//             }`}
//         >
//           <Film className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1.5 sm:mr-2" />
//           <span className="hidden sm:inline">Schedule </span>Movie
//         </button>
//         <button
//           onClick={() => setActiveTab('EVENT')}
//           className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${activeTab === 'EVENT'
//               ? 'border-violet-500 text-violet-600'
//               : 'border-transparent text-slate-500 hover:text-slate-700'
//             }`}
//         >
//           <Calendar className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1.5 sm:mr-2" />
//           <span className="hidden sm:inline">Create </span>Event
//         </button>
//       </div>

//       {/* Movie Scheduling Form */}
//       {activeTab === 'MOVIE' && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white border border-slate-200 rounded-xl p-8"
//         >
//           <form onSubmit={handleMovieSubmit} className="space-y-6">
//             {/* Step 1: Select Venue */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">Select Venue</label>
//               <select
//                 name="venueId"
//                 value={movieForm.venueId}
//                 onChange={handleMovieInputChange}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//               >
//                 <option value="">Choose a theatre...</option>
//                 {theatreVenues.map(venue => (
//                   <option key={venue.id} value={venue.id}>
//                     {venue.name} - {venue.location} (Capacity: {venue.capacity})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Step 2: Search and Select Movie */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">Search and Select Movie</label>

//               {/* Movie Search + Dropdown */}
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search movies by title..."
//                   value={movieSearchQuery}
//                   onChange={(e) => {
//                     const next = e.target.value;
//                     setMovieSearchQuery(next);
//                     // Require re-select if user edits the text
//                     setMovieForm((prev) => ({ ...prev, movieId: '' }));
//                     setMovieDropdownOpen(true);
//                   }}
//                   onFocus={() => setMovieDropdownOpen(true)}
//                   onBlur={() => {
//                     // Allow click on dropdown items before closing
//                     setTimeout(() => setMovieDropdownOpen(false), 150);
//                   }}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
//                 />
//                 {movieSearchQuery && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setMovieSearchQuery('');
//                       setMovieForm((prev) => ({ ...prev, movieId: '' }));
//                       setMovieResults([]);
//                       setMovieDropdownOpen(false);
//                     }}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}

//                 {/* Dropdown */}
//                 {movieDropdownOpen && movieSearchQuery.trim() && (
//                   <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
//                     {loadingMovies ? (
//                       <div className="px-4 py-3 flex items-center gap-2 text-slate-600">
//                         <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
//                         <span className="text-sm">Searching…</span>
//                       </div>
//                     ) : movieResults.length === 0 ? (
//                       <div className="px-4 py-3 text-sm text-slate-600">
//                         No movies found. Try a different name.
//                       </div>
//                     ) : (
//                       <div className="max-h-72 overflow-y-auto">
//                         {movieResults.map((m) => (
//                           <button
//                             key={m.id}
//                             type="button"
//                             onClick={() => {
//                               setMovieForm((prev) => ({ ...prev, movieId: String(m.id) }));
//                               setMovieSearchQuery(m.title);
//                               setMovieDropdownOpen(false);
//                             }}
//                             className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3"
//                           >
//                             <div className="min-w-0">
//                               <div className="font-semibold text-slate-800 truncate">{m.title}</div>
//                               <div className="text-xs text-slate-500 truncate">
//                                 {m.duration ? m.duration : '—'} {m.rating ? `• ⭐ ${m.rating}` : ''}
//                               </div>
//                             </div>
//                             <ChevronDown className="w-4 h-4 text-slate-300 flex-shrink-0" />
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Selected movie helper */}
//               <p className="mt-2 text-xs text-slate-500">
//                 {movieForm.movieId ? `Selected TMDB Movie ID: ${movieForm.movieId}` : 'Type and select a movie from the dropdown.'}
//               </p>
//             </div>

//             {/* Step 3: Run Duration (7 / 14 / Custom) */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">
//                 Run Duration in This Theatre
//               </label>

//               {/* Preset selector */}
//               <div className="flex flex-wrap gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => handleMovieInputChange({ target: { name: 'schedulePreset', value: '7' } })}
//                   className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${movieForm.schedulePreset === '7'
//                       ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/40'
//                       : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-600'
//                     }`}
//                 >
//                   Next 7 days
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleMovieInputChange({ target: { name: 'schedulePreset', value: '14' } })}
//                   className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${movieForm.schedulePreset === '14'
//                       ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/40'
//                       : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-600'
//                     }`}
//                 >
//                   Next 14 days
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleMovieInputChange({ target: { name: 'schedulePreset', value: 'custom' } })}
//                   className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${movieForm.schedulePreset === 'custom'
//                       ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/40'
//                       : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-600'
//                     }`}
//                 >
//                   Custom calendar
//                 </button>
//               </div>

//               {/* Date pickers */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs text-slate-600 mb-1 font-medium">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={movieForm.startDate}
//                     onChange={handleMovieInputChange}
//                     required
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs text-slate-600 mb-1 font-medium">
//                     {movieForm.schedulePreset === 'custom' ? 'End Date' : 'Calculated End Date'}
//                   </label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={movieForm.endDate}
//                     onChange={handleMovieInputChange}
//                     required
//                     disabled={movieForm.schedulePreset !== 'custom'}
//                     className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${movieForm.schedulePreset !== 'custom' ? 'opacity-70 cursor-not-allowed' : ''
//                       }`}
//                   />
//                   {movieForm.schedulePreset !== 'custom' && movieForm.startDate && movieForm.endDate && (
//                     <p className="mt-1 text-[11px] text-slate-500">
//                       This movie will appear from{' '}
//                       <span className="font-semibold">{movieForm.startDate}</span> to{' '}
//                       <span className="font-semibold">{movieForm.endDate}</span>.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Step 4: Smart Timing Picker */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">Select Show Times</label>

//               {/* Suggested Slots */}
//               <div className="mb-4">
//                 <p className="text-xs text-slate-600 mb-2 font-medium">Suggested Slots:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {suggestedSlots.map(slot => (
//                     <button
//                       key={slot}
//                       type="button"
//                       onClick={() => addSuggestedSlot(slot)}
//                       disabled={movieForm.confirmedShows.includes(slot)}
//                       className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${movieForm.confirmedShows.includes(slot)
//                           ? 'bg-violet-100 border-violet-300 text-violet-700 cursor-not-allowed'
//                           : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-600'
//                         }`}
//                     >
//                       {slot}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Custom Time Input */}
//               <div className="mb-4">
//                 <form onSubmit={handleCustomTimeSubmit} className="flex gap-2">
//                   <input
//                     type="text"
//                     value={movieForm.customTime}
//                     onChange={(e) => setMovieForm(prev => ({ ...prev, customTime: e.target.value }))}
//                     placeholder="Enter custom time (e.g., 10:30 AM)"
//                     className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                   />
//                   <button
//                     type="submit"
//                     className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all"
//                   >
//                     Add
//                   </button>
//                 </form>
//               </div>

//               {/* Confirmed Shows */}
//               {movieForm.confirmedShows.length > 0 && (
//                 <div>
//                   <p className="text-xs text-slate-600 mb-2 font-medium">Confirmed Shows:</p>
//                   <div className="flex flex-wrap gap-2">
//                     {movieForm.confirmedShows.map(slot => (
//                       <span
//                         key={slot}
//                         className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2"
//                       >
//                         {slot}
//                         <button
//                           type="button"
//                           onClick={() => removeShow(slot)}
//                           className="hover:text-emerald-900"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Step 5: Pricing */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">Pricing</label>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs text-slate-600 mb-1 font-medium">Gold Price (₹)</label>
//                   <input
//                     type="number"
//                     name="goldPrice"
//                     value={movieForm.goldPrice}
//                     onChange={handleMovieInputChange}
//                     required
//                     min="0"
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-slate-600 mb-1 font-medium">Silver Price (₹)</label>
//                   <input
//                     type="number"
//                     name="silverPrice"
//                     value={movieForm.silverPrice}
//                     onChange={handleMovieInputChange}
//                     required
//                     min="0"
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-slate-600 mb-1 font-medium">VIP Price (₹)</label>
//                   <input
//                     type="number"
//                     name="vipPrice"
//                     value={movieForm.vipPrice}
//                     onChange={handleMovieInputChange}
//                     required
//                     min="0"
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
//             >
//               Create Movie Schedule
//             </button>
//           </form>
//         </motion.div>
//       )}

//       {/* Event Scheduling Form */}
//       {activeTab === 'EVENT' && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8"
//         >
//           <form onSubmit={handleEventSubmit} className="space-y-6">
//             {/* Step 1: Select Venue */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">Select Venue (Event Grounds)</label>
//               <select
//                 name="venueId"
//                 value={eventForm.venueId}
//                 onChange={handleEventInputChange}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//               >
//                 <option value="">Choose an event ground...</option>
//                 {eventVenues.map(venue => (
//                   <option key={venue.id} value={venue.id}>
//                     {venue.name} - {venue.location} (Capacity: {venue.capacity})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Step 2: Event Details */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Event Name</label>
//                 <input
//                   type="text"
//                   name="eventName"
//                   value={eventForm.eventName}
//                   onChange={handleEventInputChange}
//                   required
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Artist/Performer</label>
//                 <input
//                   type="text"
//                   name="artist"
//                   value={eventForm.artist}
//                   onChange={handleEventInputChange}
//                   required
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">Event Image</label>
//               <div className="grid grid-cols-1 gap-4">
//                 {/* Image Upload */}
//                 <div className="flex items-center gap-4">
//                   <label className="flex-1 cursor-pointer">
//                     <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-lg hover:border-violet-500 transition-all">
//                       <Upload className="w-5 h-5 text-violet-600" />
//                       <span className="text-sm font-medium text-violet-700">
//                         {eventImageFile ? eventImageFile.name : 'Choose event poster'}
//                       </span>
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleEventImageChange}
//                       className="hidden"
//                     />
//                   </label>
//                   {eventImagePreview && (
//                     <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-violet-200">
//                       <img
//                         src={eventImagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setEventImageFile(null);
//                           setEventImagePreview(null);
//                         }}
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Alternative: Image URL */}
//                 <div className="flex items-center gap-3">
//                   <div className="flex-1">
//                     <input
//                       type="url"
//                       name="imageUrl"
//                       value={eventForm.imageUrl}
//                       onChange={handleEventInputChange}
//                       placeholder="Or paste image URL (https://...)"
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                       disabled={!!eventImageFile}
//                     />
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={eventForm.address}
//                     onChange={handleEventInputChange}
//                     placeholder="Event address (optional)"
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={eventForm.description}
//                 onChange={handleEventInputChange}
//                 placeholder="Event description..."
//                 rows="3"
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//               />
//             </div>

//             {/* Step 3: Event Dates */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="block text-sm font-semibold text-slate-700">Event Dates & Times</label>
//                 <button
//                   type="button"
//                   onClick={addDate}
//                   className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-violet-500/30"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Date
//                 </button>
//               </div>

//               {eventForm.dates.length === 0 ? (
//                 <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
//                   No dates added yet. Click "Add Date" to add event dates.
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {eventForm.dates.map((date) => (
//                     <div
//                       key={date.id}
//                       className="grid grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
//                     >
//                       <div className="col-span-5">
//                         <input
//                           type="date"
//                           value={date.date}
//                           onChange={(e) => updateDate(date.id, 'date', e.target.value)}
//                           required
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="col-span-5">
//                         <input
//                           type="time"
//                           value={date.time}
//                           onChange={(e) => updateDate(date.id, 'time', e.target.value)}
//                           required
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <button
//                           type="button"
//                           onClick={() => removeDate(date.id)}
//                           className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-semibold transition-colors"
//                         >
//                           <X className="w-4 h-4 mx-auto" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Step 4: Zone Configuration */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="block text-sm font-semibold text-slate-700">Zone Configuration</label>
//                 <button
//                   type="button"
//                   onClick={addZone}
//                   className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-violet-500/30"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Zone
//                 </button>
//               </div>

//               {eventForm.zones.length === 0 ? (
//                 <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
//                   No zones added yet. Click "Add Zone" to create pricing zones.
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {eventForm.zones.map((zone) => (
//                     <div
//                       key={zone.id}
//                       className="grid grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
//                     >
//                       <div className="col-span-3">
//                         <input
//                           type="text"
//                           placeholder="Zone Name (e.g., VIP)"
//                           value={zone.name}
//                           onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
//                           required
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <input
//                           type="number"
//                           placeholder="Capacity"
//                           value={zone.capacity}
//                           onChange={(e) => updateZone(zone.id, 'capacity', e.target.value)}
//                           required
//                           min="1"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <input
//                           type="number"
//                           placeholder="Adult (₹)"
//                           value={zone.adultPrice}
//                           onChange={(e) => updateZone(zone.id, 'adultPrice', e.target.value)}
//                           required
//                           min="0"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <input
//                           type="number"
//                           placeholder="Children (₹)"
//                           value={zone.childrenPrice}
//                           onChange={(e) => updateZone(zone.id, 'childrenPrice', e.target.value)}
//                           required
//                           min="0"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <button
//                           type="button"
//                           onClick={() => removeZone(zone.id)}
//                           className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-semibold transition-colors"
//                         >
//                           <X className="w-4 h-4 mx-auto" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
//             >
//               Create Event
//             </button>
//           </form>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default SmartScheduler;




import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Calendar, X, Plus, Loader2, Search, Upload, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { searchMovies } from '../../services/tmdb';
import { toast } from 'react-toastify';

const SmartScheduler = ({ owner }) => {
  const [activeTab, setActiveTab] = useState('MOVIE'); // 'MOVIE' | 'EVENT'
  const [movieResults, setMovieResults] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [movieDropdownOpen, setMovieDropdownOpen] = useState(false);

  // Movie scheduling state
  const [movieForm, setMovieForm] = useState({
    venueId: '',
    movieId: '',
    // scheduling window
    schedulePreset: '7', // '7' | '14' | 'custom'
    startDate: '',
    endDate: '',
    // show times
    confirmedShows: [],
    customTime: '',
    // pricing
    goldPrice: '',
    silverPrice: '',
    vipPrice: ''
  });

  // Search movies from TMDB while typing (debounced)
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const q = movieSearchQuery.trim();
        if (!q) {
          setMovieResults([]);
          setLoadingMovies(false);
          return;
        }

        setLoadingMovies(true);
        const result = await searchMovies(q, 1);
        setMovieResults(result?.movies || []);
      } catch (err) {
        console.error('Error loading movies:', err);
        setMovieResults([]);
      } finally {
        setLoadingMovies(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      loadMovies();
    }, movieSearchQuery.trim() ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [movieSearchQuery]);

  // Event scheduling state
  const [eventForm, setEventForm] = useState({
    venueId: '',
    eventName: '',
    artist: '',
    imageUrl: '',
    description: '',
    address: '',
    dates: [],
    zones: []
  });

  const [eventImageFile, setEventImageFile] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState(null);
  const [uploadingEventImage, setUploadingEventImage] = useState(false);

  // Suggested time slots
  const suggestedSlots = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'];

  // Venues will be provided from backend / owner context instead of mock data
  const [venues, setVenues] = useState([]);

  // Filter venues by type (backend uses enum THEATRE / EVENT_GROUND)
  const theatreVenues = venues.filter(v => {
    const t = (v.type || '').toString().toUpperCase();
    return t === 'THEATRE';
  });
  const eventVenues = venues.filter(v => {
    const t = (v.type || '').toString().toUpperCase();
    return t === 'EVENT_GROUND';
  });

  // Load venues for this owner (if provided)
  useEffect(() => {
    const loadVenues = async () => {
      try {
        if (!owner?.id) {
          setVenues([]);
          return;
        }
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/venues/owner/${owner.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to load venues');
        }
        const data = await res.json();
        setVenues(data);
      } catch (err) {
        console.error('Error loading venues:', err);
        setVenues([]);
      }
    };
    loadVenues();
  }, [owner]);

  // Helper to calculate end date for 7/14 presets
  const calculateEndDate = (start, days) => {
    if (!start) return '';
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return '';
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + (days - 1));
    return end.toISOString().split('T')[0];
  };

  // Movie form handlers
  const handleMovieInputChange = (e) => {
    const { name, value } = e.target;
    // When changing the preset, auto-update endDate if we already have a startDate
    if (name === 'schedulePreset') {
      if (value === '7' || value === '14') {
        setMovieForm(prev => {
          const days = value === '7' ? 7 : 14;
          const newEnd = calculateEndDate(prev.startDate || new Date().toISOString().split('T')[0], days);
          return {
            ...prev,
            schedulePreset: value,
            startDate: prev.startDate || new Date().toISOString().split('T')[0],
            endDate: newEnd
          };
        });
      } else {
        // custom - keep dates as-is, user will pick both
        setMovieForm(prev => ({ ...prev, schedulePreset: value }));
      }
      return;
    }

    if (name === 'startDate') {
      setMovieForm(prev => {
        // If preset is 7 or 14, recompute endDate automatically
        if (prev.schedulePreset === '7' || prev.schedulePreset === '14') {
          const days = prev.schedulePreset === '7' ? 7 : 14;
          return {
            ...prev,
            startDate: value,
            endDate: calculateEndDate(value, days)
          };
        }
        return { ...prev, startDate: value };
      });
      return;
    }

    setMovieForm(prev => ({ ...prev, [name]: value }));
  };

  const addSuggestedSlot = (slot) => {
    if (!movieForm.confirmedShows.includes(slot)) {
      setMovieForm(prev => ({
        ...prev,
        confirmedShows: [...prev.confirmedShows, slot]
      }));
    }
  };

  const removeShow = (slot) => {
    setMovieForm(prev => ({
      ...prev,
      confirmedShows: prev.confirmedShows.filter(s => s !== slot)
    }));
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    if (movieForm.customTime && !movieForm.confirmedShows.includes(movieForm.customTime)) {
      setMovieForm(prev => ({
        ...prev,
        confirmedShows: [...prev.confirmedShows, prev.customTime],
        customTime: ''
      }));
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();

    if (!movieForm.venueId || !movieForm.movieId) {
      toast.error('Please select both a venue and a movie.');
      return;
    }
    if (!movieForm.startDate || !movieForm.endDate) {
      toast.error('Please select a valid start and end date.');
      return;
    }
    if (movieForm.confirmedShows.length === 0) {
      toast.error('Please add at least one show time.');
      return;
    }

    try {
      const payload = {
        venueId: Number(movieForm.venueId),
        tmdbMovieId: Number(movieForm.movieId),
        startDate: movieForm.startDate,
        endDate: movieForm.endDate,
        showtimes: movieForm.confirmedShows,
        silverPrice: Number(movieForm.silverPrice || 0),
        goldPrice: Number(movieForm.goldPrice || 0),
        vipPrice: Number(movieForm.vipPrice || 0),
      };

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to create schedule:', text);
        toast.error('Failed to create movie schedule. Please check backend logs.');
        return;
      }

      const data = await res.json();
      toast.success(`Movie schedule created! Schedule #${data.scheduleId} • Shows: ${data.generatedShowCount}`);

      setMovieForm({
        venueId: '',
        movieId: '',
        schedulePreset: '7',
        startDate: '',
        endDate: '',
        confirmedShows: [],
        customTime: '',
        goldPrice: '',
        silverPrice: '',
        vipPrice: ''
      });
    } catch (err) {
      console.error('Error calling schedule API:', err);
      toast.error('Unexpected error while creating schedule. See console for details.');
    }
  };

  // Event form handlers
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setEventImageFile(file);
      setEventImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadEventImage = async () => {
    if (!eventImageFile) return null;

    setUploadingEventImage(true);
    try {
      const formData = new FormData();
      formData.append('image', eventImageFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/upload/event', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return `http://localhost:8080${data.imageUrl}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploadingEventImage(false);
    }
  };

  // Date management for events
  const addDate = () => {
    const dateId = `date_${Date.now()}`;
    setEventForm(prev => ({
      ...prev,
      dates: [...prev.dates, { id: dateId, date: '', time: '' }]
    }));
  };

  const updateDate = (dateId, field, value) => {
    setEventForm(prev => ({
      ...prev,
      dates: prev.dates.map(date =>
        date.id === dateId ? { ...date, [field]: value } : date
      )
    }));
  };

  const removeDate = (dateId) => {
    setEventForm(prev => ({
      ...prev,
      dates: prev.dates.filter(date => date.id !== dateId)
    }));
  };

  const addZone = () => {
    setEventForm(prev => ({
      ...prev,
      zones: [...prev.zones, {
        id: `zone_${Date.now()}`,
        name: '',
        capacity: '',
        adultPrice: '',
        childrenPrice: ''
      }]
    }));
  };

  const updateZone = (zoneId, field, value) => {
    setEventForm(prev => ({
      ...prev,
      zones: prev.zones.map(zone =>
        zone.id === zoneId ? { ...zone, [field]: value } : zone
      )
    }));
  };

  const removeZone = (zoneId) => {
    setEventForm(prev => ({
      ...prev,
      zones: prev.zones.filter(zone => zone.id !== zoneId)
    }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (!owner?.id) {
      toast.error('Owner information is missing. Please refresh and try again.');
      return;
    }

    if (eventForm.dates.length === 0) {
      toast.error('Please add at least one date for the event.');
      return;
    }

    if (eventForm.zones.length === 0) {
      toast.error('Please add at least one zone for the event.');
      return;
    }

    try {
      // Upload image first if file is selected
      let uploadedImageUrl = eventForm.imageUrl;
      if (eventImageFile) {
        uploadedImageUrl = await uploadEventImage();
        if (!uploadedImageUrl) {
          toast.error('Failed to upload event image');
          return;
        }
      }

      // Get venue to get address if not provided
      const selectedVenue = eventVenues.find(v => v.id === Number(eventForm.venueId));
      if (!selectedVenue) {
        toast.error('Please select a valid venue.');
        return;
      }

      // Build eventConfig JSON matching frontend expectations
      const zoneColors = [
        'border-purple-500',
        'border-pink-500',
        'border-yellow-500',
        'border-blue-500',
        'border-green-500',
        'border-red-500'
      ];

      const eventConfig = {
        dates: eventForm.dates.map((d, idx) => ({
          id: d.id || `date_${idx + 1}`,
          label: d.date && d.time
            ? `${new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | ${d.time}`
            : d.date || `Date ${idx + 1}`,
          date: d.date,
          time: d.time || ''
        })),
        zones: eventForm.zones.map((z, idx) => ({
          id: z.id || `zone_${idx + 1}`,
          name: z.name || `Zone ${idx + 1}`,
          capacity: Number(z.capacity) || 0,
          color: zoneColors[idx % zoneColors.length], // Assign color for UI
          categories: [
            { type: 'Adult', price: Number(z.adultPrice) || 0 },
            { type: 'Children', price: Number(z.childrenPrice) || 0 }
          ]
        }))
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ownerId: owner.id,
          venueId: Number(eventForm.venueId),
          title: eventForm.eventName,
          description: eventForm.artist || eventForm.description || '',
          posterUrl: uploadedImageUrl || '',
          address: eventForm.address || selectedVenue.address || selectedVenue.location || '',
          eventConfig: JSON.stringify(eventConfig)
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to create event:', text);
        toast.error('Failed to create event. Please check backend logs.');
        return;
      }

      const data = await response.json();
      toast.success(`Event "${eventForm.eventName}" created successfully!`);

      // Reset form and image states
      setEventImageFile(null);
      setEventImagePreview(null);
      setEventForm({
        venueId: '',
        eventName: '',
        artist: '',
        imageUrl: '',
        description: '',
        address: '',
        dates: [],
        zones: []
      });
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Unexpected error while creating event. See console for details.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">Smart Scheduler</h2>
        <p className="text-sm sm:text-base text-slate-600">Schedule movies and create events</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('MOVIE')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${activeTab === 'MOVIE'
            ? 'border-violet-500 text-violet-600'
            : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Film className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Schedule </span>Movie
        </button>
        <button
          onClick={() => setActiveTab('EVENT')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${activeTab === 'EVENT'
            ? 'border-violet-500 text-violet-600'
            : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Create </span>Event
        </button>
      </div>

      {/* Movie Scheduling Form */}
      {activeTab === 'MOVIE' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-8"
        >
          <form onSubmit={handleMovieSubmit} className="space-y-6">
            {/* Step 1: Select Venue */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Venue</label>
              <select
                name="venueId"
                value={movieForm.venueId}
                onChange={handleMovieInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Choose a theatre...</option>
                {theatreVenues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.location} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Search and Select Movie */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search and Select Movie</label>

              {/* Movie Search + Dropdown */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search movies by title..."
                  value={movieSearchQuery}
                  onChange={(e) => {
                    const next = e.target.value;
                    setMovieSearchQuery(next);
                    // Require re-select if user edits the text
                    setMovieForm((prev) => ({ ...prev, movieId: '' }));
                    setMovieDropdownOpen(true);
                  }}
                  onFocus={() => setMovieDropdownOpen(true)}
                  onBlur={() => {
                    // Allow click on dropdown items before closing
                    setTimeout(() => setMovieDropdownOpen(false), 150);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
                />
                {movieSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setMovieSearchQuery('');
                      setMovieForm((prev) => ({ ...prev, movieId: '' }));
                      setMovieResults([]);
                      setMovieDropdownOpen(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Dropdown */}
                {movieDropdownOpen && movieSearchQuery.trim() && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                    {loadingMovies ? (
                      <div className="px-4 py-3 flex items-center gap-2 text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                        <span className="text-sm">Searching…</span>
                      </div>
                    ) : movieResults.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-600">
                        No movies found. Try a different name.
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto">
                        {movieResults.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent input blur
                              setMovieForm((prev) => ({ ...prev, movieId: String(m.id) }));
                              setMovieSearchQuery(m.title);
                              setMovieDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate">{m.title}</div>
                              <div className="text-xs text-slate-500 truncate">
                                {m.duration ? m.duration : '—'} {m.rating ? `• ⭐ ${m.rating}` : ''}
                              </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected movie helper */}
              <p className="mt-2 text-xs text-slate-500">
                {movieForm.movieId ? `Selected TMDB Movie ID: ${movieForm.movieId}` : 'Type and select a movie from the dropdown.'}
              </p>
            </div>

            {/* Step 3: Run Duration (7 / 14 / Custom) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Run Duration in This Theatre
              </label>

              {/* Preset selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleMovieInputChange({ target: { name: 'schedulePreset', value: '7' } })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${movieForm.schedulePreset === '7'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/40'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                    }`}
                >
                  Next 7 days
                </button>
                <button
                  type="button"
                  onClick={() => handleMovieInputChange({ target: { name: 'schedulePreset', value: '14' } })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${movieForm.schedulePreset === '14'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/40'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                    }`}
                >
                  Next 14 days
                </button>
                <button
                  type="button"
                  onClick={() => handleMovieInputChange({ target: { name: 'schedulePreset', value: 'custom' } })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${movieForm.schedulePreset === 'custom'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/40'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                    }`}
                >
                  Custom calendar
                </button>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={movieForm.startDate}
                    onChange={handleMovieInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    {movieForm.schedulePreset === 'custom' ? 'End Date' : 'Calculated End Date'}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={movieForm.endDate}
                    onChange={handleMovieInputChange}
                    required
                    disabled={movieForm.schedulePreset !== 'custom'}
                    className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${movieForm.schedulePreset !== 'custom' ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  />
                  {movieForm.schedulePreset !== 'custom' && movieForm.startDate && movieForm.endDate && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      This movie will appear from{' '}
                      <span className="font-semibold">{movieForm.startDate}</span> to{' '}
                      <span className="font-semibold">{movieForm.endDate}</span>.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Smart Timing Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Show Times</label>

              {/* Suggested Slots */}
              <div className="mb-4">
                <p className="text-xs text-slate-600 mb-2 font-medium">Suggested Slots:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => addSuggestedSlot(slot)}
                      disabled={movieForm.confirmedShows.includes(slot)}
                      className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${movieForm.confirmedShows.includes(slot)
                        ? 'bg-violet-100 border-violet-300 text-violet-700 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-600'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Time Input */}
              <div className="mb-4">
                <form onSubmit={handleCustomTimeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={movieForm.customTime}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, customTime: e.target.value }))}
                    placeholder="Enter custom time (e.g., 10:30 AM)"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Confirmed Shows */}
              {movieForm.confirmedShows.length > 0 && (
                <div>
                  <p className="text-xs text-slate-600 mb-2 font-medium">Confirmed Shows:</p>
                  <div className="flex flex-wrap gap-2">
                    {movieForm.confirmedShows.map(slot => (
                      <span
                        key={slot}
                        className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2"
                      >
                        {slot}
                        <button
                          type="button"
                          onClick={() => removeShow(slot)}
                          className="hover:text-emerald-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 5: Pricing */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Pricing</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Gold Price (₹)</label>
                  <input
                    type="number"
                    name="goldPrice"
                    value={movieForm.goldPrice}
                    onChange={handleMovieInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Silver Price (₹)</label>
                  <input
                    type="number"
                    name="silverPrice"
                    value={movieForm.silverPrice}
                    onChange={handleMovieInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">VIP Price (₹)</label>
                  <input
                    type="number"
                    name="vipPrice"
                    value={movieForm.vipPrice}
                    onChange={handleMovieInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
            >
              Create Movie Schedule
            </button>
          </form>
        </motion.div>
      )}

      {/* Event Scheduling Form */}
      {activeTab === 'EVENT' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8"
        >
          <form onSubmit={handleEventSubmit} className="space-y-6">
            {/* Step 1: Select Venue */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Venue (Event Grounds)</label>
              <select
                name="venueId"
                value={eventForm.venueId}
                onChange={handleEventInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Choose an event ground...</option>
                {eventVenues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.location} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventForm.eventName}
                  onChange={handleEventInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Artist/Performer</label>
                <input
                  type="text"
                  name="artist"
                  value={eventForm.artist}
                  onChange={handleEventInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Event Image</label>
              <div className="grid grid-cols-1 gap-4">
                {/* Image Upload */}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-lg hover:border-violet-500 transition-all">
                      <Upload className="w-5 h-5 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">
                        {eventImageFile ? eventImageFile.name : 'Choose event poster'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageChange}
                      className="hidden"
                    />
                  </label>
                  {eventImagePreview && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-violet-200">
                      <img
                        src={eventImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEventImageFile(null);
                          setEventImagePreview(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Alternative: Image URL */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      name="imageUrl"
                      value={eventForm.imageUrl}
                      onChange={handleEventInputChange}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      disabled={!!eventImageFile}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={eventForm.address}
                    onChange={handleEventInputChange}
                    placeholder="Event address (optional)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={eventForm.description}
                onChange={handleEventInputChange}
                placeholder="Event description..."
                rows="3"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Step 3: Event Dates */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">Event Dates & Times</label>
                <button
                  type="button"
                  onClick={addDate}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-violet-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Add Date
                </button>
              </div>

              {eventForm.dates.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
                  No dates added yet. Click "Add Date" to add event dates.
                </div>
              ) : (
                <div className="space-y-3">
                  {eventForm.dates.map((date) => (
                    <div
                      key={date.id}
                      className="grid grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="col-span-5">
                        <input
                          type="date"
                          value={date.date}
                          onChange={(e) => updateDate(date.id, 'date', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="time"
                          value={date.time}
                          onChange={(e) => updateDate(date.id, 'time', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={() => removeDate(date.id)}
                          className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-semibold transition-colors"
                        >
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Zone Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">Zone Configuration</label>
                <button
                  type="button"
                  onClick={addZone}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-violet-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Add Zone
                </button>
              </div>

              {eventForm.zones.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
                  No zones added yet. Click "Add Zone" to create pricing zones.
                </div>
              ) : (
                <div className="space-y-3">
                  {eventForm.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="grid grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Zone Name (e.g., VIP)"
                          value={zone.name}
                          onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Capacity"
                          value={zone.capacity}
                          onChange={(e) => updateZone(zone.id, 'capacity', e.target.value)}
                          required
                          min="1"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Adult (₹)"
                          value={zone.adultPrice}
                          onChange={(e) => updateZone(zone.id, 'adultPrice', e.target.value)}
                          required
                          min="0"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Children (₹)"
                          value={zone.childrenPrice}
                          onChange={(e) => updateZone(zone.id, 'childrenPrice', e.target.value)}
                          required
                          min="0"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-3">
                        <button
                          type="button"
                          onClick={() => removeZone(zone.id)}
                          className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-semibold transition-colors"
                        >
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
            >
              Create Event
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default SmartScheduler;