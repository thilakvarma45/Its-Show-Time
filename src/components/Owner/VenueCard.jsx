import { motion } from 'framer-motion';
import { MapPin, Users, Building2 } from 'lucide-react';

const VenueCard = ({ venue, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{venue.name}</h3>
            <p className="text-sm text-slate-400 capitalize">{venue.type.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(venue)}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(venue.id)}
            className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="w-4 h-4" />
          <span>{venue.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users className="w-4 h-4" />
          <span>Capacity: {venue.capacity.toLocaleString()}</span>
        </div>
        <div className="text-sm text-slate-500">
          {venue.address}, {venue.pincode}, {venue.country}
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2">
        {venue.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300"
          >
            {amenity}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default VenueCard;
