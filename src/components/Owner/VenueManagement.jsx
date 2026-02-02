import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, SlidersHorizontal } from 'lucide-react';
import { AVAILABLE_AMENITIES } from '../../data/mockData';
import VenueCard from './VenueCard';
import { toast } from 'react-toastify';

const VenueManagement = ({ owner }) => {
  const [venues, setVenues] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteVenueId, setConfirmDeleteVenueId] = useState(null);
  const [deletingVenue, setDeletingVenue] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'theatre', 'event_ground'
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

  // Load venues for this owner from backend
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
        setVenues(
          data.map((v) => ({
            ...v,
            // Backend stores amenities as JSON/text; normalize to array for UI.
            amenities: (() => {
              if (!v.amenities) return [];
              try {
                const parsed = JSON.parse(v.amenities);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })(),
          }))
        );
      } catch (err) {
        console.error('Error loading venues for owner:', err);
        setVenues([]);
      }
    };
    loadVenues();
  }, [owner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!owner?.id) return;

    const pincode = String(formData.pincode || '').trim();
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return;
    }

    const payload = {
      ownerId: owner.id,
      name: formData.name,
      // Map UI type to backend enum
      type: formData.type === 'event_ground' ? 'EVENT_GROUND' : 'THEATRE',
      location: formData.location,
      address: formData.address,
      pincode,
      country: formData.country,
      capacity: parseInt(formData.capacity, 10),
      amenities: JSON.stringify(formData.amenities || []),
    };

    try {
      const token = localStorage.getItem('token');
      const isEditing = Boolean(editingVenueId);
      const url = isEditing
        ? `http://localhost:8080/api/venues/${editingVenueId}`
        : 'http://localhost:8080/api/venues';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        const errHeader = res.headers.get('X-Error');
        throw new Error(errHeader || errText || 'Failed to create venue');
      }
      const saved = await res.json();
      if (isEditing) {
        setVenues((prev) =>
          prev.map((v) =>
            v.id === editingVenueId ? { ...saved, amenities: formData.amenities } : v
          )
        );
        toast.success('Venue updated');
      } else {
        setVenues((prev) => [
          ...prev,
          {
            ...saved,
            amenities: formData.amenities,
          },
        ]);
        toast.success('Venue created');
      }
      setFormData({
        name: '',
        location: '',
        address: '',
        pincode: '',
        country: 'India',
        capacity: '',
        amenities: [],
        type: 'theatre',
      });
      setEditingVenueId(null);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating venue:', err);
      toast.error(err?.message || 'Failed to create venue. Please try again.');
    }
  };

  const handleDelete = (venueId) => {
    setConfirmDeleteVenueId(venueId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteVenueId) return;
    setDeletingVenue(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/venues/${confirmDeleteVenueId}${owner?.id ? `?ownerId=${owner.id}` : ''}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        toast.error(text || 'Failed to delete venue');
        return;
      }

      setVenues((prev) => prev.filter((v) => v.id !== confirmDeleteVenueId));
      toast.success('Venue deleted');
      setConfirmDeleteVenueId(null);
    } catch (e) {
      console.error('Error deleting venue:', e);
      toast.error('Failed to delete venue. Please try again.');
    } finally {
      setDeletingVenue(false);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenueId(venue.id);
    setFormData({
      name: venue.name,
      location: venue.location,
      address: venue.address,
      pincode: venue.pincode,
      country: venue.country,
      capacity: venue.capacity.toString(),
      amenities: venue.amenities || [],
      // Map backend enum to UI value
      type:
        (venue.type || '').toString().toUpperCase() === 'EVENT_GROUND'
          ? 'event_ground'
          : 'theatre',
    });
    setShowAddModal(true);
  };

  // Filter venues
  const filteredVenues = venues.filter((venue) => {
    // Filter by type (backend uses THEATRE / EVENT_GROUND)
    if (filterType !== 'all') {
      const backendType = (venue.type || '').toString().toUpperCase();
      if (filterType === 'theatre' && backendType !== 'THEATRE') return false;
      if (filterType === 'event_ground' && backendType !== 'EVENT_GROUND') return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        venue.name.toLowerCase().includes(query) ||
        venue.location.toLowerCase().includes(query) ||
        venue.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">Venue Management</h2>
          <p className="text-sm sm:text-base text-slate-600">Manage your theatres and event venues</p>
        </div>
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
            setEditingVenueId(null);
            setShowAddModal(true);
          }}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Venue
        </button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, location, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Venues' },
                { value: 'theatre', label: 'Theatres' },
                { value: 'event_ground', label: 'Event Grounds' }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === type.value
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-slate-500">
            {filteredVenues.length} {filteredVenues.length === 1 ? 'venue' : 'venues'}
          </span>
        </div>
      </div>

      {/* Venue Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No venues found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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
              className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                  {editingVenueId ? 'Edit Venue' : 'Add New Venue'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData((prev) => ({ ...prev, pincode: digitsOnly }));
                      }}
                      required
                      inputMode="numeric"
                      maxLength={6}
                      pattern="\d{6}"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="theatre">Theatre</option>
                    <option value="event_ground">Event Ground</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AVAILABLE_AMENITIES.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${formData.amenities.includes(amenity)
                            ? 'bg-violet-100 border-violet-300 text-violet-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
                  >
                    {editingVenueId ? 'Update Venue' : 'Save Venue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDeleteVenueId != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDeleteVenueId(null)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">Delete venue?</h3>
                <p className="text-sm text-slate-600 mt-2">
                  This will remove the venue from your list. Are you sure you want to continue?
                </p>
              </div>
              <div className="px-5 pb-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteVenueId(null)}
                  disabled={deletingVenue}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deletingVenue}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
                >
                  {deletingVenue ? 'Deleting…' : 'Yes, delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VenueManagement;
