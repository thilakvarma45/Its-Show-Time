import { motion } from 'framer-motion';
import { MapPin, Users, Building2, Edit2, Trash2, Map } from 'lucide-react';

const VenueCard = ({ venue, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(venue)}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(venue.id)}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex-shrink-0">
          {venue.type === 'THEATRE' ? (
            <Building2 className="w-6 h-6 text-violet-600" />
          ) : (
            <Map className="w-6 h-6 text-indigo-600" />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-12">
          <h3 className="text-lg font-bold text-slate-900 truncate">{venue.name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {venue.type === 'EVENT_GROUND' ? 'Event Ground' : 'Theatre'}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {venue.address}, {venue.location}
            <span className="block text-slate-400 text-xs font-normal mt-0.5">
              {venue.pincode}, {venue.country}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">
            {venue.capacity.toLocaleString()} <span className="text-slate-400 font-normal">Capacity</span>
          </span>
        </div>
        {venue.amenities && venue.amenities.length > 0 && (
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
            {venue.amenities.length} Amenities
          </span>
        )}
      </div>

      {venue.amenities && venue.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 opacity-60">
          {venue.amenities.slice(0, 3).map((a, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-50 rounded text-slate-500 border border-slate-100">
              {a}
            </span>
          ))}
          {venue.amenities.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-slate-400">+{venue.amenities.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VenueCard;
