import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Search,
    Ticket,
    CreditCard,
    MapPin,
    Calendar,
    User,
    Mail,
    Phone,
    ArrowLeft,
    MessageCircle,
    BookOpen,
    Shield,
    Check
} from 'lucide-react';

const HelpAndSupport = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('help');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Help topics with steps
    const helpTopics = [
        {
            id: 'booking',
            title: 'How to Book Tickets',
            icon: Ticket,
            steps: [
                'Search for your favorite movie or event on the home page',
                'Click on the movie/event card to view details',
                'Select your preferred theatre and show timing',
                'Choose your seats from the seat layout',
                'Review your booking and proceed to payment',
                'Complete payment to receive your booking confirmation'
            ]
        },
        {
            id: 'payment',
            title: 'Payment Options',
            icon: CreditCard,
            steps: [
                'We accept all major credit and debit cards',
                'UPI payments via Google Pay, PhonePe, Paytm',
                'Net Banking from all major banks',
                'Apply promo codes for instant discounts',
                'All transactions are secured with 256-bit encryption',
                'Refunds are processed within 5-7 business days'
            ]
        },
        {
            id: 'location',
            title: 'Selecting Your City',
            icon: MapPin,
            steps: [
                'Click on the location icon in the header',
                'Select your city from the dropdown menu',
                'The app will show theatres and events in your city',
                'You can change your city anytime',
                'Enable location services for auto-detection'
            ]
        },
        {
            id: 'cancellation',
            title: 'Cancellation & Refunds',
            icon: Calendar,
            steps: [
                'Go to "My Bookings" from the profile menu',
                'Select the booking you want to cancel',
                'Click on "Cancel Booking" button',
                'Confirm cancellation (if eligible)',
                'Refund will be processed to original payment method',
                'Cancellation allowed up to 2 hours before show time'
            ]
        },
        {
            id: 'account',
            title: 'Managing Your Account',
            icon: User,
            steps: [
                'Click on your profile icon in the header',
                'Go to "Settings" to update your profile',
                'Change name, email, or password',
                'View booking history in "My Bookings"',
                'Add movies to your Wishlist for later',
                'Manage notification preferences'
            ]
        }
    ];

    // FAQs
    const faqs = [
        {
            id: 1,
            question: 'How do I create an account?',
            answer: 'Click on "Get Started" on the landing page, then choose "Sign Up". Fill in your name, email, and create a password. You can also sign up with your Google account for quick registration.',
            category: 'Account'
        },
        {
            id: 2,
            question: 'Can I book tickets for multiple people?',
            answer: 'Yes! When selecting seats, you can choose multiple seats for friends and family. The total price will be calculated based on the number of seats selected. Each seat can have different pricing based on the zone (Premium, Regular, Economy).',
            category: 'Booking'
        },
        {
            id: 3,
            question: 'What if I forget my password?',
            answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we will send you a password reset link. The link is valid for 24 hours.',
            category: 'Account'
        },
        {
            id: 4,
            question: 'How can I cancel my booking?',
            answer: 'Go to "My Bookings" from your profile dropdown. Find the booking you want to cancel and click "Cancel Booking". Cancellation is available up to 2 hours before the show time. Refunds are processed within 5-7 business days.',
            category: 'Booking'
        },
        {
            id: 5,
            question: 'Are my payment details secure?',
            answer: 'Absolutely! We use industry-standard 256-bit SSL encryption for all transactions. We never store your complete card details on our servers. All payments are processed through secure, PCI-DSS compliant payment gateways.',
            category: 'Payment'
        },
        {
            id: 6,
            question: 'How do I apply a promo code?',
            answer: 'On the payment page, you will see an "Apply Coupon" section. Enter your promo code and click "Apply". If the code is valid, the discount will be automatically applied to your total amount.',
            category: 'Payment'
        },
        {
            id: 7,
            question: 'Can I change my seat after booking?',
            answer: 'Once a booking is confirmed, seats cannot be changed. However, you can cancel the booking (if eligible) and make a new booking with your preferred seats.',
            category: 'Booking'
        },
        {
            id: 8,
            question: 'How do I get my e-ticket?',
            answer: 'After successful payment, your e-ticket with QR code will be displayed on the confirmation page. It is also sent to your registered email. You can also access it from "My Bookings" section anytime.',
            category: 'Booking'
        },
        {
            id: 9,
            question: 'What is the Wishlist feature?',
            answer: 'Wishlist allows you to save movies you are interested in for later. Click the heart icon on any movie card to add it to your Wishlist. Access your saved movies from the profile dropdown.',
            category: 'Features'
        },
        {
            id: 10,
            question: 'How do I contact customer support?',
            answer: 'You can reach us via email at support@showtime.com or call our helpline at 1800-123-4567 (toll-free). Our support team is available 24/7 to assist you with any queries.',
            category: 'Support'
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
                >
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors mb-8"
                        >
                            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-400 group-hover:bg-slate-50 transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="font-bold tracking-tight">Back to Dashboard</span>
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Help & Support<span className="text-indigo-500">.</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 text-lg">
                            Everything you need to know about using ShowTime.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-slate-50 p-1.5 rounded-2xl flex border border-slate-200">
                        <button
                            onClick={() => setActiveTab('help')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'help'
                                ? 'bg-white text-slate-900 shadow-lg ring-1 ring-black/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            User Guide
                        </button>
                        <button
                            onClick={() => setActiveTab('faqs')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'faqs'
                                ? 'bg-white text-slate-900 shadow-lg ring-1 ring-black/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            FAQs
                        </button>
                    </div>
                </motion.div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'help' ? (
                        <motion.div
                            key="help"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {helpTopics.map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <topic.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                            {topic.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-4 relative">
                                        {/* Connecting Line */}
                                        <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-slate-100"></div>

                                        {topic.steps.map((step, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                <div className="flex-shrink-0 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center z-10 text-[10px] font-bold text-slate-400 mt-0.5 group-hover:border-indigo-200 group-hover:text-indigo-500 transition-colors">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 leading-relaxed group-hover:text-slate-600">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="faqs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-3xl mx-auto"
                        >
                            {/* Modern Search */}
                            <div className="relative mb-12">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-6 py-6 bg-slate-50 rounded-2xl border-none font-semibold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                {filteredFaqs.map((faq) => (
                                    <motion.div
                                        key={faq.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`rounded-2xl border transition-all duration-300 ${expandedFaq === faq.id
                                                ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-500/5'
                                                : 'bg-white border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                            className="w-full flex items-start text-left gap-4 p-6"
                                        >
                                            <div className={`mt-0.5 p-2 rounded-lg transition-colors ${expandedFaq === faq.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                                <HelpCircle className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className={`font-bold text-lg ${expandedFaq === faq.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {faq.question}
                                                    </h4>
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{faq.category}</span>
                                            </div>
                                            {expandedFaq === faq.id ? (
                                                <ChevronUp className="w-5 h-5 text-indigo-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {expandedFaq === faq.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 pt-0 ml-[3.25rem]">
                                                        <p className="text-slate-600 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredFaqs.length === 0 && (
                                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">No results found</h3>
                                    <p className="text-slate-500">We couldn't find any FAQs matching "{searchQuery}"</p>
                                </div>
                            )}

                            {/* Support Card */}
                            <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none -mr-32 -mt-32"></div>

                                <div className="relative z-10 max-w-md">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                        <Shield className="w-6 h-6 text-indigo-400" />
                                        <h3 className="text-2xl font-black">Still need help?</h3>
                                    </div>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        Our dedicated support team is available 24/7 to solve your problems. Don't hesitate to reach out.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
                                    <a href="mailto:support@showtime.com" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                                        <Mail className="w-5 h-5" /> Email Us
                                    </a>
                                    <a href="tel:18001234567" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                                        <Phone className="w-5 h-5" /> Call Support
                                    </a>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HelpAndSupport;
