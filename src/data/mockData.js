// Mock data for Its Show Time booking system

export const MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    genre: ["Sci-Fi", "Adventure"],
    rating: 4.8,
    duration: "2h 46m",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Oppenheimer",
    genre: ["Biography", "Drama"],
    rating: 4.9,
    duration: "3h 0m",
    poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
  },
  {
    id: 3,
    title: "The Batman",
    genre: ["Action", "Crime"],
    rating: 4.7,
    duration: "2h 56m",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Avatar 3",
    genre: ["Sci-Fi", "Adventure"],
    rating: 4.6,
    duration: "3h 12m",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Inception Redux",
    genre: ["Thriller", "Sci-Fi"],
    rating: 4.9,
    duration: "2h 28m",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Interstellar",
    genre: ["Sci-Fi", "Drama"],
    rating: 4.8,
    duration: "2h 49m",
    poster: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop",
  },
];

export const DATES = [
  { id: 1, day: "Mon", date: 4 },
  { id: 2, day: "Tue", date: 5 },
  { id: 3, day: "Wed", date: 6 },
  { id: 4, day: "Thu", date: 7 },
  { id: 5, day: "Fri", date: 8 },
];

export const THEATRES = [
  {
    id: 1,
    name: "PVR ICON",
    location: "Downtown",
    times: ["09:30 AM", "12:45 PM", "03:30 PM", "05:00 PM", "08:15 PM"],
    price: 250
  },
  {
    id: 2,
    name: "INOX Laserplex",
    location: "North Side",
    times: ["10:00 AM", "01:00 PM", "04:15 PM", "07:30 PM", "10:00 PM"],
    price: 300
  },
  {
    id: 3,
    name: "Cinepolis VIP",
    location: "City Center",
    times: ["11:00 AM", "02:15 PM", "05:45 PM", "09:00 PM"],
    price: 350
  },
  {
    id: 4,
    name: "PVR Superplex",
    location: "Mall Road",
    times: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM", "09:30 PM"],
    price: 280
  },
];

// Seat configuration
export const SEAT_ROWS = [
  { id: 'A', type: 'standard', label: 'A' },
  { id: 'B', type: 'standard', label: 'B' },
  { id: 'C', type: 'standard', label: 'C' },
  { id: 'D', type: 'standard', label: 'D' },
  { id: 'E', type: 'standard', label: 'E' },
  { id: 'F', type: 'standard', label: 'F' },
  { id: 'G', type: 'standard', label: 'G' },
  { id: 'H', type: 'standard', label: 'H' },
  { id: 'I', type: 'standard', label: 'I' },
  { id: 'J', type: 'standard', label: 'J' },
  { id: 'K', type: 'standard', label: 'K' },
  { id: 'L', type: 'vip', label: 'L - VIP' },
  { id: 'M', type: 'vip', label: 'M - VIP' },
  { id: 'N', type: 'vip', label: 'N - VIP' },
];

// Generate seat map with some taken seats
export const generateSeats = () => {
  const seats = [];
  // More realistic taken seats across more rows
  const takenSeats = [
    'A3', 'A7', 'A12', 'B2', 'B5', 'B9', 'C1', 'C6', 'C11', 'C14',
    'D4', 'D8', 'D13', 'E2', 'E6', 'E10', 'F3', 'F7', 'F12',
    'G1', 'G5', 'G9', 'G14', 'H4', 'H8', 'H13', 'I2', 'I6', 'I11',
    'J3', 'J7', 'J12', 'K1', 'K5', 'K10', 'K14', 'L2', 'L6', 'L9',
    'M3', 'M7', 'M12'
  ];

  SEAT_ROWS.forEach(row => {
    const seatsInRow = row.type === 'vip' ? 12 : 14; // More seats per row
    for (let i = 1; i <= seatsInRow; i++) {
      const seatId = `${row.id}${i}`;
      seats.push({
        id: seatId,
        row: row.id,
        number: i,
        type: row.type,
        taken: takenSeats.includes(seatId),
      });
    }
  });

  return seats;
};

// Events mock data
export const EVENTS = [
  {
    id: 101,
    title: "Sunburn Arena 2024",
    type: "EVENT",
    poster: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop",
    venue: "Jio World Garden, Mumbai",
    address: "Bandra Kurla Complex, Mumbai",
    dates: [
      { id: 1, label: "Sat, 24 Dec | 5:00 PM" },
      { id: 2, label: "Sun, 25 Dec | 6:00 PM" },
      { id: 3, label: "Mon, 26 Dec | 7:00 PM" }
    ],
    zones: [
      {
        id: 'svvip',
        name: 'SVVIP Tables',
        color: 'border-purple-500',
        categories: [
          { type: 'Adult', price: 5000 },
          { type: 'Child', price: 2500 }
        ]
      },
      {
        id: 'vip',
        name: 'VIP Zone',
        color: 'border-pink-500',
        categories: [
          { type: 'Adult', price: 3000 },
          { type: 'Child', price: 1500 }
        ]
      },
      {
        id: 'gold',
        name: 'Gold Phase 1',
        color: 'border-yellow-500',
        categories: [
          { type: 'Adult', price: 1500 },
          { type: 'Child', price: 800 }
        ]
      },
      {
        id: 'silver',
        name: 'Silver Zone',
        color: 'border-blue-500',
        categories: [
          { type: 'Adult', price: 1200 },
          { type: 'Child', price: 600 }
        ]
      }
    ]
  },
  {
    id: 102,
    title: "Kevin Hart Live",
    type: "EVENT",
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    venue: "Indira Gandhi Indoor Stadium, Delhi",
    address: "Pragati Vihar, New Delhi",
    dates: [
      { id: 1, label: "Fri, 15 Jan | 8:00 PM" },
      { id: 2, label: "Sat, 16 Jan | 8:00 PM" }
    ],
    zones: [
      {
        id: 'premium',
        name: 'Premium Seating',
        color: 'border-purple-500',
        categories: [
          { type: 'Adult', price: 4000 },
          { type: 'Child', price: 2000 }
        ]
      },
      {
        id: 'standard',
        name: 'Standard',
        color: 'border-pink-500',
        categories: [
          { type: 'Adult', price: 2000 },
          { type: 'Child', price: 1000 }
        ]
      }
    ]
  },
  {
    id: 103,
    title: "EDM Night Festival",
    type: "EVENT",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop",
    venue: "D.Y. Patil Stadium, Navi Mumbai",
    address: "Sector 7, Nerul, Navi Mumbai",
    dates: [
      { id: 1, label: "Sat, 10 Feb | 6:00 PM" }
    ],
    zones: [
      {
        id: 'vip',
        name: 'VIP Lounge',
        color: 'border-purple-500',
        categories: [
          { type: 'Adult', price: 3500 },
          { type: 'Student', price: 2500 }
        ]
      },
      {
        id: 'gold',
        name: 'Gold Zone',
        color: 'border-yellow-500',
        categories: [
          { type: 'Adult', price: 1800 },
          { type: 'Student', price: 1200 }
        ]
      },
      {
        id: 'silver',
        name: 'Silver Zone',
        color: 'border-blue-500',
        categories: [
          { type: 'Adult', price: 1000 },
          { type: 'Student', price: 700 }
        ]
      }
    ]
  }
];

// Owner Dashboard Mock Data
export const OWNER_PROFILE = {
  name: "Nolan Enterprises",
  id: 1,
  email: "nolan@itsshowtime.com"
};

export const VENUE_LIST = [
  {
    id: 1,
    name: "Its Show Time Grand",
    location: "Downtown Plaza",
    address: "123 Main Street",
    pincode: "400001",
    country: "India",
    capacity: 500,
    amenities: ["Dolby Atmos", "Parking", "Food Court", "IMAX"],
    type: "theatre"
  },
  {
    id: 2,
    name: "Its Show Time Premium",
    location: "Mall Road",
    address: "456 Shopping District",
    pincode: "400002",
    country: "India",
    capacity: 350,
    amenities: ["4DX", "Parking", "Lounge"],
    type: "theatre"
  },
  {
    id: 3,
    name: "Event Grounds - Central Park",
    location: "City Center",
    address: "789 Park Avenue",
    pincode: "400003",
    country: "India",
    capacity: 5000,
    amenities: ["Parking", "Food Court", "VIP Lounge", "Sound System"],
    type: "event_ground"
  },
  {
    id: 4,
    name: "Its Show Time Classic",
    location: "Heritage Quarter",
    address: "321 Old Town",
    pincode: "400004",
    country: "India",
    capacity: 200,
    amenities: ["Parking", "Cafe"],
    type: "theatre"
  }
];

export const MOVIE_DATABASE = [
  ...MOVIES,
  {
    id: 7,
    title: "The Matrix Resurrections",
    genre: ["Sci-Fi", "Action"],
    rating: 4.5,
    duration: "2h 28m",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
  },
  {
    id: 8,
    title: "No Time to Die",
    genre: ["Action", "Thriller"],
    rating: 4.6,
    duration: "2h 43m",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
  },
  {
    id: 9,
    title: "Spider-Man: No Way Home",
    genre: ["Action", "Adventure"],
    rating: 4.8,
    duration: "2h 28m",
    poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
  },
  {
    id: 10,
    title: "Top Gun: Maverick",
    genre: ["Action", "Drama"],
    rating: 4.9,
    duration: "2h 11m",
    poster: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=600&fit=crop",
  }
];

// Dashboard Stats Mock Data
export const DASHBOARD_STATS = {
  totalRevenue: 245000,
  ticketsSold: 12450,
  occupancyPercent: 78,
  activeListings: 12
};

// Revenue Chart Data (Last 7 Days)
export const REVENUE_CHART_DATA = [
  { day: "Mon", revenue: 32000 },
  { day: "Tue", revenue: 28000 },
  { day: "Wed", revenue: 35000 },
  { day: "Thu", revenue: 42000 },
  { day: "Fri", revenue: 55000 },
  { day: "Sat", revenue: 68000 },
  { day: "Sun", revenue: 72000 }
];

// Available Amenities for Venue Creation
export const AVAILABLE_AMENITIES = [
  "Dolby Atmos",
  "IMAX",
  "4DX",
  "Parking",
  "Food Court",
  "Lounge",
  "VIP Lounge",
  "Cafe",
  "Sound System",
  "Wheelchair Accessible",
  "Online Booking",
  "Loyalty Program"
];
