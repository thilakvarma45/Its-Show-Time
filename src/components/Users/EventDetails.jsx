import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Ticket,
    Loader2,
    ChevronRight,
    Clock,
    Users
} from 'lucide-react';

const EventDetails = ({ onBookNow }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherEvents, setOtherEvents] = useState([]);

    // Scroll to top when component mounts or event ID changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Fetch event details
    useEffect(() => {
        const loadEvent = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:8080/api/events/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to load event details');
                }
                const full = await res.json();

                let parsedConfig = {};
                try {
                    parsedConfig = full.eventConfig ? JSON.parse(full.eventConfig) : {};
                } catch (e) {
                    console.error('Failed to parse eventConfig', e);
                    parsedConfig = {};
                }

                const normalizedEvent = {
                    id: full.id,
                    title: full.title,
                    description: full.description || 'An exciting live event awaits you!',
                    poster: full.posterUrl,
                    venue: full.venue?.name || 'Event Venue',
                    address: full.address || 'Location details will be provided',
                    dates: parsedConfig.dates || [],
                    zones: parsedConfig.zones || [],
                };

                setEvent(normalizedEvent);
            } catch (err) {
                console.error('Error loading event:', err);
                setError('Failed to load event details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadEvent();
        }
    }, [id]);

    // Fetch other events for recommendations
    useEffect(() => {
        const loadOtherEvents = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/events');
                if (!res.ok) {
                    throw new Error('Failed to load events');
                }
                const data = await res.json();
                // Filter out current event and take up to 6
                const filtered = data
                    .filter(e => e.id !== parseInt(id))
                    .slice(0, 6)
                    .map(e => ({
                        id: e.id,
                        title: e.title,
                        poster: e.posterUrl,
                        venue: e.venue?.name || e.address || 'Event venue',
                    }));
                setOtherEvents(filtered);
            } catch (err) {
                console.error('Error loading other events:', err);
                setOtherEvents([]);
            }
        };

        loadOtherEvents();
    }, [id]);

    const handleBookNow = () => {
        if (event && onBookNow) {
            onBookNow(event);
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-slate-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎭</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h2>
                    <p className="text-slate-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative mx-2.5 rounded-xl overflow-hidden">
                {/* Background with gradient */}
                <div
                    className="relative h-[50vh] min-h-[400px] bg-cover bg-center"
                    style={{
                        backgroundImage: event.poster
                            ? `url(${event.poster})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/home')}
                        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>

                    {/* Event Badge */}
                    <div className="absolute top-6 right-6 z-20 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full uppercase tracking-wide">
                        Live Event
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    {event.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <MapPin className="w-5 h-5" />
                                        <span>{event.venue}</span>
                                    </div>
                                    {event.dates.length > 0 && (
                                        <div className="flex items-center gap-2 text-white/90">
                                            <Calendar className="w-5 h-5" />
                                            <span>{event.dates.length} date{event.dates.length > 1 ? 's' : ''} available</span>
                                        </div>
                                    )}
                                    {event.zones.length > 0 && (
                                        <div className="flex items-center gap-2 text-white/90">
                                            <Users className="w-5 h-5" />
                                            <span>{event.zones.length} zone{event.zones.length > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={handleBookNow}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/30 hover:scale-105 flex items-center gap-2"
                                >
                                    <Ticket className="w-5 h-5" />
                                    Book Tickets
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Event</h2>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                {event.description}
                            </p>
                        </motion.section>

                        {/* Available Dates */}
                        {event.dates.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-6 h-6" />
                                    Available Dates
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {event.dates.map((date, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 font-medium flex items-center gap-2"
                                        >
                                            <Clock className="w-4 h-4" />
                                            {date.date} {date.time && `at ${date.time}`}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Zone Information */}
                        {event.zones.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Ticket className="w-6 h-6" />
                                    Ticket Zones
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {event.zones.map((zone, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                                        >
                                            <h3 className="font-semibold text-slate-900 mb-1">{zone.name}</h3>
                                            <p className="text-purple-600 font-bold text-lg">₹{zone.price}</p>
                                            {zone.capacity && (
                                                <p className="text-slate-500 text-sm mt-1">{zone.capacity} seats available</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-50 rounded-xl p-6 space-y-6 sticky top-24"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Event Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Venue</p>
                                        <p className="font-semibold text-slate-900">{event.venue}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Address</p>
                                        <p className="font-semibold text-slate-900">{event.address}</p>
                                    </div>
                                    {event.dates.length > 0 && (
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Dates Available</p>
                                            <p className="font-semibold text-slate-900">{event.dates.length} date{event.dates.length > 1 ? 's' : ''}</p>
                                        </div>
                                    )}
                                    {event.zones.length > 0 && (
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Starting From</p>
                                            <p className="font-semibold text-purple-600 text-xl">
                                                ₹{Math.min(...event.zones.map(z => z.price || 0))}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleBookNow}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
                            >
                                Book Tickets Now
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Recommendations Section - Other Events */}
                {otherEvents.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Ticket className="w-6 h-6" />
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {otherEvents.map((evt) => (
                                <div
                                    key={evt.id}
                                    onClick={() => handleEventClick(evt.id)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden rounded-lg bg-slate-200 shadow-md hover:shadow-xl transition-all">
                                        {evt.poster ? (
                                            <img
                                                src={evt.poster}
                                                alt={evt.title}
                                                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                <Ticket className="w-12 h-12 text-white/70" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                                            Event
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                            <p className="text-white text-sm font-medium">{evt.venue}</p>
                                        </div>
                                    </div>
                                    <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                        {evt.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{evt.venue}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
