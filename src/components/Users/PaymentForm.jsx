import { motion } from 'framer-motion';
import { useState } from 'react';
import { CreditCard, Lock, Smartphone, Building2, Wallet, Tag, CheckCircle, XCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';

const PaymentForm = ({ bookingDetails, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'wallet'
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('processing'); // 'processing', 'completed', 'failed'

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
    selectedBank: '',
    selectedWallet: '',
    selectedUpiApp: ''
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Available coupons
  const availableCoupons = [
    { code: 'FIRST50', discount: 50, type: 'percentage', maxDiscount: 100, description: '50% off up to ₹100' },
    { code: 'FLAT20', discount: 20, type: 'flat', description: 'Flat ₹20 off' },
    { code: 'SHOW10', discount: 10, type: 'percentage', maxDiscount: 50, description: '10% off up to ₹50' },
    { code: 'WEEKEND25', discount: 25, type: 'percentage', maxDiscount: 75, description: '25% off up to ₹75' },
  ];

  // Calculate final price
  const originalPrice = bookingDetails.totalPrice || 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  // Apply coupon handler
  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());

    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (originalPrice * coupon.discount) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discount;
    }

    setDiscountAmount(discount);
    setAppliedCoupon(coupon);
    setCouponCode('');
  };

  // Remove coupon handler
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate based on payment method
    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv)) {
      return;
    }
    if (paymentMethod === 'upi' && !formData.selectedUpiApp && !formData.upiId) {
      return;
    }
    if (paymentMethod === 'netbanking' && !formData.selectedBank) {
      return;
    }
    if (paymentMethod === 'wallet' && !formData.selectedWallet) {
      return;
    }

    // Show processing modal
    setShowModal(true);
    setModalStatus('processing');

    // Simulate payment processing (longer for UPI to show confirmation message)
    const processingTime = paymentMethod === 'upi' ? 3000 : 2500;

    setTimeout(() => {
      setModalStatus('completed');
      // After completion, proceed to ticket
      setTimeout(() => {
        setShowModal(false);
        onPaymentComplete({ ...formData, paymentMethod });
      }, 2000);
    }, processingTime);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
    { id: 'wallet', label: 'Wallets', icon: Wallet }
  ];

  const upiApps = [
    {
      name: 'Google Pay',
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12">
          <path fill="#e64a19" d="M42.858,11.975c-4.546-2.624-10.359-1.065-12.985,3.481L23.25,26.927	c-1.916,3.312,0.551,4.47,3.301,6.119l6.372,3.678c2.158,1.245,4.914,0.506,6.158-1.649l6.807-11.789	C48.176,19.325,46.819,14.262,42.858,11.975z"></path><path fill="#fbc02d" d="M35.365,16.723l-6.372-3.678c-3.517-1.953-5.509-2.082-6.954,0.214l-9.398,16.275	c-2.624,4.543-1.062,10.353,3.481,12.971c3.961,2.287,9.024,0.93,11.311-3.031l9.578-16.59	C38.261,20.727,37.523,17.968,35.365,16.723z"></path><path fill="#43a047" d="M36.591,8.356l-4.476-2.585c-4.95-2.857-11.28-1.163-14.137,3.787L9.457,24.317	c-1.259,2.177-0.511,4.964,1.666,6.22l5.012,2.894c2.475,1.43,5.639,0.582,7.069-1.894l9.735-16.86	c2.017-3.492,6.481-4.689,9.974-2.672L36.591,8.356z"></path><path fill="#1e88e5" d="M19.189,13.781l-4.838-2.787c-2.158-1.242-4.914-0.506-6.158,1.646l-5.804,10.03	c-2.857,4.936-1.163,11.252,3.787,14.101l3.683,2.121l4.467,2.573l1.939,1.115c-3.442-2.304-4.535-6.92-2.43-10.555l1.503-2.596	l5.504-9.51C22.083,17.774,21.344,15.023,19.189,13.781z"></path>
        </svg>
      )
    },
    {
      name: 'PhonePe',
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12">
          <path fill="#4527a0" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"></path><path fill="#fff" d="M32.267,20.171c0-0.681-0.584-1.264-1.264-1.264h-2.334l-5.35-6.25	c-0.486-0.584-1.264-0.778-2.043-0.584l-1.848,0.584c-0.292,0.097-0.389,0.486-0.195,0.681l5.836,5.666h-8.851	c-0.292,0-0.486,0.195-0.486,0.486v0.973c0,0.681,0.584,1.506,1.264,1.506h1.972v4.305c0,3.502,1.611,5.544,4.723,5.544	c0.973,0,1.378-0.097,2.35-0.486v3.112c0,0.875,0.681,1.556,1.556,1.556h0.786c0.292,0,0.584-0.292,0.584-0.584V21.969h2.812	c0.292,0,0.486-0.195,0.486-0.486V20.171z M26.043,28.413c-0.584,0.292-1.362,0.389-1.945,0.389c-1.556,0-2.097-0.778-2.097-2.529	v-4.305h4.043V28.413z"></path>
        </svg>
      )
    },
    {
      name: 'BHIM',
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12">
          <polygon fill="#388e3c" points="29,4 18,45 40,24"></polygon><polygon fill="#f57c00" points="21,3 10,44 32,23"></polygon>
        </svg>
      )
    },
    {
      name: 'Paytm',
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12">
          <path fill="#0d47a1" d="M5.446 18.01H.548c-.277 0-.502.167-.503.502L0 30.519c-.001.3.196.45.465.45.735 0 1.335 0 2.07 0C2.79 30.969 3 30.844 3 30.594 3 29.483 3 28.111 3 27l2.126.009c1.399-.092 2.335-.742 2.725-2.052.117-.393.14-.733.14-1.137l.11-2.862C7.999 18.946 6.949 18.181 5.446 18.01zM4.995 23.465C4.995 23.759 4.754 24 4.461 24H3v-3h1.461c.293 0 .534.24.534.535V23.465zM13.938 18h-3.423c-.26 0-.483.08-.483.351 0 .706 0 1.495 0 2.201C10.06 20.846 10.263 21 10.552 21h2.855c.594 0 .532.972 0 1H11.84C10.101 22 9 23.562 9 25.137c0 .42.005 1.406 0 1.863-.008.651-.014 1.311.112 1.899C9.336 29.939 10.235 31 11.597 31h4.228c.541 0 1.173-.474 1.173-1.101v-8.274C17.026 19.443 15.942 18.117 13.938 18zM14 27.55c0 .248-.202.45-.448.45h-1.105C12.201 28 12 27.798 12 27.55v-2.101C12 25.202 12.201 25 12.447 25h1.105C13.798 25 14 25.202 14 25.449V27.55zM18 18.594v5.608c.124 1.6 1.608 2.798 3.171 2.798h1.414c.597 0 .561.969 0 .969H19.49c-.339 0-.462.177-.462.476v2.152c0 .226.183.396.422.396h2.959c2.416 0 3.592-1.159 3.591-3.757v-8.84c0-.276-.175-.383-.342-.383h-2.302c-.224 0-.355.243-.355.422v5.218c0 .199-.111.316-.29.316H21.41c-.264 0-.409-.143-.409-.396v-5.058C21 18.218 20.88 18 20.552 18c-.778 0-1.442 0-2.22 0C18.067 18 18 18.263 18 18.594L18 18.594z"></path><path fill="#00adee" d="M27.038 20.569v-2.138c0-.237.194-.431.43-.431H28c1.368-.285 1.851-.62 2.688-1.522.514-.557.966-.704 1.298-.113L32 18h1.569C33.807 18 34 18.194 34 18.431v2.138C34 20.805 33.806 21 33.569 21H32v9.569C32 30.807 31.806 31 31.57 31h-2.14C29.193 31 29 30.807 29 30.569V21h-1.531C27.234 21 27.038 20.806 27.038 20.569L27.038 20.569zM42.991 30.465c0 .294-.244.535-.539.535h-1.91c-.297 0-.54-.241-.54-.535v-6.623-1.871c0-1.284-2.002-1.284-2.002 0v8.494C38 30.759 37.758 31 37.461 31H35.54C35.243 31 35 30.759 35 30.465V18.537C35 18.241 35.243 18 35.54 18h1.976c.297 0 .539.241.539.537v.292c1.32-1.266 3.302-.973 4.416.228 2.097-2.405 5.69-.262 5.523 2.375 0 2.916-.026 6.093-.026 9.033 0 .294-.244.535-.538.535h-1.891C45.242 31 45 30.759 45 30.465c0-2.786 0-5.701 0-8.44 0-1.307-2-1.37-2 0v8.44H42.991z"></path>
        </svg>
      )
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank'
  ];

  const wallets = [
    { name: 'Paytm Wallet', logo: 'PT' },
    { name: 'Amazon Pay', logo: 'AP' },
    { name: 'MobiKwik', logo: 'MK' },
    { name: 'Freecharge', logo: 'FC' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 border border-slate-200 shadow-md"
      >
        <h3 className="text-slate-900 font-bold uppercase tracking-wider mb-4">Order Summary</h3>
        <div className="space-y-3">
          {bookingDetails.bookingType === 'MOVIE' ? (
            <>
              <div className="flex justify-between text-slate-600">
                <span>Theatre</span>
                <span className="text-slate-900">{bookingDetails.selectedShow?.theatreName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date</span>
                <span className="text-slate-900">
                  {bookingDetails.selectedShow?.date?.day}, {bookingDetails.selectedShow?.date?.date}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Show Time</span>
                <span className="text-slate-900">{bookingDetails.selectedShow?.time}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Seats</span>
                <span className="text-slate-900">{bookingDetails.selectedSeats?.join(', ')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-3 border-t border-slate-200">
                <span>Total Seats</span>
                <span className="text-slate-900">{bookingDetails.selectedSeats?.length}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-slate-600">
                <span>Venue</span>
                <span className="text-slate-900">{bookingDetails.selectedDate?.venue}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date & Time</span>
                <span className="text-slate-900">{bookingDetails.selectedDate?.dateLabel}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Zones & Passes</span>
                <span className="text-slate-900">
                  {Object.entries(bookingDetails.selectedZones || {}).map(([zoneId, categories]) => {
                    const zone = bookingDetails.selectedEvent?.zones.find(z => z.id === zoneId);
                    const total = Object.values(categories).reduce((sum, qty) => sum + qty, 0);
                    return `${zone?.name}: ${total}`;
                  }).join(', ')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 pt-3 border-t border-slate-200">
                <span>Total Passes</span>
                <span className="text-slate-900">
                  {Object.values(bookingDetails.selectedZones || {}).reduce((sum, cats) =>
                    sum + Object.values(cats).reduce((s, q) => s + q, 0), 0
                  )}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
            <span>Subtotal</span>
            <span className="text-slate-900">
              ₹{originalPrice}
            </span>
          </div>

          {/* Coupon Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Apply Coupon</span>
            </div>

            {!appliedCoupon ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm
                             focus:outline-none focus:border-blue-500 transition-colors uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${couponCode.trim()
                      ? bookingDetails.bookingType === 'MOVIE'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                    <XCircle className="w-4 h-4" />
                    {couponError}
                  </div>
                )}
                <div className="mt-3 text-xs text-slate-500">
                  Try: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">FIRST50</span>,
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded ml-1">FLAT20</span>,
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded ml-1">SHOW10</span>
                </div>
              </>
            ) : (
              <div className={`flex items-center justify-between p-3 rounded-lg ${bookingDetails.bookingType === 'MOVIE' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
                }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-5 h-5 ${bookingDetails.bookingType === 'MOVIE' ? 'text-blue-600' : 'text-purple-600'}`} />
                  <div>
                    <span className={`font-bold text-sm ${bookingDetails.bookingType === 'MOVIE' ? 'text-blue-700' : 'text-purple-700'}`}>
                      {appliedCoupon.code}
                    </span>
                    <span className="text-slate-600 text-xs ml-2">{appliedCoupon.description}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-slate-500 hover:text-red-500 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Discount Display */}
          {appliedCoupon && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount ({appliedCoupon.code})</span>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Final Amount */}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
            <span className="text-slate-900">Total Amount</span>
            <div className="text-right">
              {appliedCoupon && (
                <span className="text-slate-400 line-through text-sm mr-2">
                  ₹{originalPrice}
                </span>
              )}
              <span className={bookingDetails.bookingType === 'MOVIE' ? 'text-blue-600' : 'text-purple-600'}>
                ₹{finalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-6 border border-slate-200 shadow-md"
      >
        <h3 className="text-slate-900 font-bold uppercase tracking-wider mb-4">Select Payment Method</h3>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isActive = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${isActive
                  ? bookingDetails.bookingType === 'MOVIE'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-purple-600 bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive
                  ? bookingDetails.bookingType === 'MOVIE'
                    ? 'text-blue-600'
                    : 'text-purple-600'
                  : 'text-slate-400'
                  }`} />
                <div className={`text-xs font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                  {method.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Credit/Debit Card */}
          {paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-slate-600 text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                           focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-sm mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Name "
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                           focus:outline-none focus:border-purple-600 transition-colors uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                             focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                             focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* UPI */}
          {paymentMethod === 'upi' && (
            <>
              <div>
                <label className="block text-slate-600 text-sm mb-3">Select UPI App</label>
                <div className="grid grid-cols-4 gap-4">
                  {upiApps.map((app) => {
                    const isSelected = formData.selectedUpiApp === app.name;
                    return (
                      <button
                        key={app.name}
                        type="button"
                        className={`bg-white p-6 rounded-2xl hover:scale-105 transition-all flex flex-col items-center justify-center aspect-square shadow-lg border-2 ${isSelected ? 'border-purple-500 ring-2 ring-purple-200 scale-105' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, selectedUpiApp: app.name, upiId: '' }));
                        }}
                      >
                        <div className="mb-2">{app.logo}</div>
                        <div className="text-xs text-center leading-tight font-semibold text-slate-700">{app.name}</div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-1"
                          >
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!formData.selectedUpiApp && (
                <>
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">OR</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-slate-600 text-sm mb-2">Enter UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="yourname@upi"
                      required={paymentMethod === 'upi' && !formData.selectedUpiApp}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                               focus:outline-none focus:border-purple-600 transition-colors"
                    />
                    <p className="text-xs text-slate-500 mt-1">e.g., yourname@paytm, yourname@ybl, yourname@phonepe</p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Net Banking */}
          {paymentMethod === 'netbanking' && (
            <div>
              <label className="block text-slate-600 text-sm mb-2">Select Bank</label>
              <select
                name="selectedBank"
                value={formData.selectedBank}
                onChange={handleChange}
                required={paymentMethod === 'netbanking'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                         focus:outline-none focus:border-purple-600 transition-colors"
              >
                <option value="">Choose your bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">You will be redirected to your bank's secure portal</p>
            </div>
          )}

          {/* Wallets */}
          {paymentMethod === 'wallet' && (
            <div>
              <label className="block text-slate-600 text-sm mb-3">Select Wallet</label>
              <div className="grid grid-cols-2 gap-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, selectedWallet: wallet.name }))}
                    className={`p-4 rounded-lg border-2 transition-all ${formData.selectedWallet === wallet.name
                      ? bookingDetails.bookingType === 'MOVIE'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${formData.selectedWallet === wallet.name
                        ? bookingDetails.bookingType === 'MOVIE'
                          ? 'text-blue-600'
                          : 'text-purple-600'
                        : 'text-slate-900'
                        }`}>{wallet.logo}</div>
                      <div className="text-xs text-slate-600">{wallet.name}</div>
                    </div>
                  </button>
                ))}
              </div>
              {formData.selectedWallet && (
                <p className="text-xs text-slate-500 mt-2">Selected: {formData.selectedWallet}</p>
              )}
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center gap-2 text-slate-600 text-sm pt-2">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full mt-6 px-6 py-4 text-white rounded-lg font-semibold uppercase tracking-wider transition-all shadow-lg ${bookingDetails.bookingType === 'MOVIE'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
          >
            Pay ₹{finalPrice.toFixed(2)}
          </button>
        </form>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showModal}
        status={modalStatus}
        bookingType={bookingDetails.bookingType}
        paymentMethod={paymentMethod}
        selectedUpiApp={formData.selectedUpiApp}
        onClose={() => {
          if (modalStatus === 'completed') {
            setShowModal(false);
          }
        }}
      />
    </div>
  );
};

export default PaymentForm;

