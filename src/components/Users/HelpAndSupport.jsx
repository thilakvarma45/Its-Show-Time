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
    Shield
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
            color: 'from-violet-500 to-purple-500',
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
            color: 'from-emerald-500 to-teal-500',
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
            color: 'from-rose-500 to-pink-500',
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
            color: 'from-amber-500 to-orange-500',
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
            color: 'from-blue-500 to-cyan-500',
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
            answer: 'You can reach us via email at support@itsshowtime.com or call our helpline at 1800-123-4567 (toll-free). Our support team is available 24/7 to assist you with any queries.',
            category: 'Support'
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Help & Support</h1>
                            <p className="text-sm text-slate-500">Find answers and get help</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveTab('help')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'help'
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        How to Use
                    </button>
                    <button
                        onClick={() => setActiveTab('faqs')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'faqs'
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        FAQs
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'help' ? (
                        <motion.div
                            key="help"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Help Topics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {helpTopics.map((topic) => (
                                    <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Topic Header */}
                                        <div className={`bg-gradient-to-r ${topic.color} p-4`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <topic.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                                            </div>
                                        </div>

                                        {/* Steps */}
                                        <div className="p-4">
                                            <ol className="space-y-3">
                                                {topic.steps.map((step, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="faqs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Search */}
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search FAQs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                                />
                            </div>

                            {/* FAQ List */}
                            <div className="space-y-3">
                                {filteredFaqs.map((faq) => (
                                    <motion.div
                                        key={faq.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                                    >
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3 flex-1">
                                                <HelpCircle className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-xs font-medium text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                                                        {faq.category}
                                                    </span>
                                                    <p className="font-semibold text-slate-800 mt-1">{faq.question}</p>
                                                </div>
                                            </div>
                                            {expandedFaq === faq.id ? (
                                                <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        <AnimatePresence>
                                            {expandedFaq === faq.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 pl-12">
                                                        <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredFaqs.length === 0 && (
                                <div className="text-center py-12">
                                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">No FAQs found matching your search.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Contact Support Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5" />
                                <h3 className="text-lg font-bold">Still need help?</h3>
                            </div>
                            <p className="text-violet-100 text-sm">
                                Our support team is available 24/7 to assist you.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="mailto:kotamadhukar17@gmail.com"
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">Email Us</span>
                            </a>
                            <a
                                href="tel:1234567890"
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">1234567890</span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpAndSupport;
