import { motion } from 'framer-motion';
import { MapPin, Users, Building2 } from 'lucide-react';

const VenueCard = ({ venue, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">{venue.name}</h3>
            <p className="text-xs sm:text-sm text-slate-500 capitalize font-medium">{venue.type.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onEdit(venue)}
            className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(venue.id)}
            className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>{venue.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="font-medium">Capacity: {venue.capacity.toLocaleString()}</span>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 break-words">
          {venue.address}, {venue.pincode}, {venue.country}
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2">
        {venue.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-slate-100 rounded text-slate-600"
          >
            {amenity}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default VenueCard;
