import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Calendar, X, Plus } from 'lucide-react';
import { VENUE_LIST, MOVIE_DATABASE } from '../../data/mockData';

const SmartScheduler = () => {
  const [activeTab, setActiveTab] = useState('MOVIE'); // 'MOVIE' | 'EVENT'
  
  // Movie scheduling state
  const [movieForm, setMovieForm] = useState({
    venueId: '',
    movieId: '',
    confirmedShows: [],
    customTime: '',
    goldPrice: '',
    silverPrice: '',
    vipPrice: ''
  });

  // Event scheduling state
  const [eventForm, setEventForm] = useState({
    venueId: '',
    eventName: '',
    artist: '',
    imageUrl: '',
    zones: []
  });

  // Suggested time slots
  const suggestedSlots = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'];

  // Filter venues by type
  const theatreVenues = VENUE_LIST.filter(v => v.type === 'theatre');
  const eventVenues = VENUE_LIST.filter(v => v.type === 'event_ground');

  // Movie form handlers
  const handleMovieInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleMovieSubmit = (e) => {
    e.preventDefault();
    // Here you would save the movie schedule
    alert('Movie schedule created successfully!');
    setMovieForm({
      venueId: '',
      movieId: '',
      confirmedShows: [],
      customTime: '',
      goldPrice: '',
      silverPrice: '',
      vipPrice: ''
    });
  };

  // Event form handlers
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const addZone = () => {
    setEventForm(prev => ({
      ...prev,
      zones: [...prev.zones, { id: Date.now(), name: '', capacity: '', price: '' }]
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

  const handleEventSubmit = (e) => {
    e.preventDefault();
    // Here you would save the event
    alert('Event created successfully!');
    setEventForm({
      venueId: '',
      eventName: '',
      artist: '',
      imageUrl: '',
      zones: []
    });
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
          className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'MOVIE'
              ? 'border-violet-500 text-violet-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Film className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Schedule </span>Movie
        </button>
        <button
          onClick={() => setActiveTab('EVENT')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'EVENT'
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

            {/* Step 2: Select Movie */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Movie</label>
              <select
                name="movieId"
                value={movieForm.movieId}
                onChange={handleMovieInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Search and select a movie...</option>
                {MOVIE_DATABASE.map(movie => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title} ({movie.duration}) - ⭐ {movie.rating}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Smart Timing Picker */}
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
                      className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                        movieForm.confirmedShows.includes(slot)
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

            {/* Step 4: Pricing */}
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Event Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={eventForm.imageUrl}
                onChange={handleEventInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Step 3: Zone Configuration */}
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
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Zone Name (e.g., VIP)"
                          value={zone.name}
                          onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-3">
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
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Price (₹)"
                          value={zone.price}
                          onChange={(e) => updateZone(zone.id, 'price', e.target.value)}
                          required
                          min="0"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
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
