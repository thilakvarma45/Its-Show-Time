import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { VENUE_LIST, AVAILABLE_AMENITIES } from '../../data/mockData';
import VenueCard from './VenueCard';

const VenueManagement = () => {
  const [venues, setVenues] = useState(VENUE_LIST);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    pincode: '',
    country: 'India',
    capacity: '',
    amenities: [],
    type: 'theatre'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVenue = {
      id: venues.length + 1,
      ...formData,
      capacity: parseInt(formData.capacity)
    };
    setVenues([...venues, newVenue]);
    setFormData({
      name: '',
      location: '',
      address: '',
      pincode: '',
      country: 'India',
      capacity: '',
      amenities: [],
      type: 'theatre'
    });
    setShowAddModal(false);
  };

  const handleDelete = (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      setVenues(venues.filter(v => v.id !== venueId));
    }
  };

  const handleEdit = (venue) => {
    setFormData({
      name: venue.name,
      location: venue.location,
      address: venue.address,
      pincode: venue.pincode,
      country: venue.country,
      capacity: venue.capacity.toString(),
      amenities: venue.amenities,
      type: venue.type
    });
    setShowAddModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white uppercase tracking-wide">Venue Management</h2>
        <button
          onClick={() => {
            setFormData({
              name: '',
              location: '',
              address: '',
              pincode: '',
              country: 'India',
              capacity: '',
              amenities: [],
              type: 'theatre'
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Venue
        </button>
      </div>

      {/* Venue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add Venue Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white uppercase tracking-wide">Add New Venue</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 uppercase tracking-wider">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="theatre">Theatre</option>
                    <option value="event_ground">Event Ground</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-3 uppercase tracking-wider">Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_AMENITIES.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          formData.amenities.includes(amenity)
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors uppercase tracking-wider"
                  >
                    Save Venue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg font-medium transition-colors uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VenueManagement;
