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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Smart Scheduler</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('MOVIE')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'MOVIE'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Film className="w-4 h-4 inline-block mr-2" />
          Schedule Movie
        </button>
        <button
          onClick={() => setActiveTab('EVENT')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'EVENT'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Create Event
        </button>
      </div>

      {/* Movie Scheduling Form */}
      {activeTab === 'MOVIE' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6"
        >
          <form onSubmit={handleMovieSubmit} className="space-y-6">
            {/* Step 1: Select Venue */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Select Venue</label>
              <select
                name="venueId"
                value={movieForm.venueId}
                onChange={handleMovieInputChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
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
              <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Select Movie</label>
              <select
                name="movieId"
                value={movieForm.movieId}
                onChange={handleMovieInputChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
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
              <label className="block text-sm text-slate-400 mb-3 uppercase tracking-wider">Select Show Times</label>
              
              {/* Suggested Slots */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Suggested Slots:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => addSuggestedSlot(slot)}
                      disabled={movieForm.confirmedShows.includes(slot)}
                      className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                        movieForm.confirmedShows.includes(slot)
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 cursor-not-allowed'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-400'
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
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Confirmed Shows */}
              {movieForm.confirmedShows.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Confirmed Shows:</p>
                  <div className="flex flex-wrap gap-2">
                    {movieForm.confirmedShows.map(slot => (
                      <span
                        key={slot}
                        className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg text-sm flex items-center gap-2"
                      >
                        {slot}
                        <button
                          type="button"
                          onClick={() => removeShow(slot)}
                          className="hover:text-emerald-300"
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
              <label className="block text-sm text-slate-400 mb-3 uppercase tracking-wider">Pricing</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Gold Price (₹)</label>
                  <input
                    type="number"
                    name="goldPrice"
                    value={movieForm.goldPrice}
                    onChange={handleMovieInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Silver Price (₹)</label>
                  <input
                    type="number"
                    name="silverPrice"
                    value={movieForm.silverPrice}
                    onChange={handleMovieInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">VIP Price (₹)</label>
                  <input
                    type="number"
                    name="vipPrice"
                    value={movieForm.vipPrice}
                    onChange={handleMovieInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider"
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
          className="bg-slate-900 border border-slate-800 rounded-lg p-6"
        >
          <form onSubmit={handleEventSubmit} className="space-y-6">
            {/* Step 1: Select Venue */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Select Venue (Event Grounds)</label>
              <select
                name="venueId"
                value={eventForm.venueId}
                onChange={handleEventInputChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventForm.eventName}
                  onChange={handleEventInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Artist/Performer</label>
                <input
                  type="text"
                  name="artist"
                  value={eventForm.artist}
                  onChange={handleEventInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Event Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={eventForm.imageUrl}
                onChange={handleEventInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Step 3: Zone Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-slate-400 uppercase tracking-wider">Zone Configuration</label>
                <button
                  type="button"
                  onClick={addZone}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Zone
                </button>
              </div>

              {eventForm.zones.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-slate-800 rounded-lg">
                  No zones added yet. Click "Add Zone" to create pricing zones.
                </div>
              ) : (
                <div className="space-y-3">
                  {eventForm.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="grid grid-cols-12 gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Zone Name (e.g., VIP)"
                          value={zone.name}
                          onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-indigo-500"
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
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
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
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={() => removeZone(zone.id)}
                          className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded text-sm transition-colors"
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
              className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider"
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
