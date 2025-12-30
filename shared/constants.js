// Shared Constants for Rentro Platform

// User Roles
export const ROLES = {
    TENANT: 'tenant',
    OWNER: 'owner',
    ADMIN: 'admin'
};

// Property Types
export const PROPERTY_TYPES = {
    APARTMENT: 'apartment',
    HOUSE: 'house',
    ROOM: 'room',
    VILLA: 'villa',
    STUDIO: 'studio'
};

// Property Status
export const PROPERTY_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
    DELISTED: 'delisted'
};

// Verification Status
export const VERIFICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Support Ticket Status
export const TICKET_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    CLOSED: 'closed'
};

// Priority Levels
export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

// Amenities List
export const AMENITIES = [
    'WiFi',
    'Air Conditioning',
    'Heating',
    'Parking',
    'Elevator',
    'Security',
    'Swimming Pool',
    'Gym',
    'Garden',
    'Balcony',
    'Furnished',
    'Pet Friendly',
    'Washing Machine',
    'Dishwasher',
    'Refrigerator',
    'Microwave',
    'TV',
    'Power Backup'
];

// BHK Options
export const BHK_OPTIONS = [
    { label: '1 RK', value: 0.5 },
    { label: '1 BHK', value: 1 },
    { label: '2 BHK', value: 2 },
    { label: '3 BHK', value: 3 },
    { label: '4 BHK', value: 4 },
    { label: '5+ BHK', value: 5 }
];

// Trust Score Thresholds
export const TRUST_SCORE = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80
};

// AI Score Thresholds
export const AI_THRESHOLDS = {
    SPAM_LOW: 30,
    SPAM_MEDIUM: 60,
    SPAM_HIGH: 80,
    FACE_MATCH_MIN: 70,
    IMAGE_MATCH_MIN: 65
};

// API Endpoints (Backend)
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    ANALYZE_LISTING: `${API_BASE_URL}/analyze-listing`,
    ANALYZE_IMAGES: `${API_BASE_URL}/analyze-images`,
    VERIFY_FACE: `${API_BASE_URL}/verify-face`,
    CHAT_BOT: `${API_BASE_URL}/chat-bot`
};

// Price Ranges (for filtering)
export const PRICE_RANGES = [
    { label: 'Under ₹5,000', min: 0, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹15,000', min: 10000, max: 15000 },
    { label: '₹15,000 - ₹25,000', min: 15000, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: 999999 }
];

// Cities (Popular Indian cities for rental)
export const CITIES = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Kochi',
    'Indore',
    'Nagpur',
    'Gurgaon',
    'Noida'
];

// Firebase Collection Names
export const COLLECTIONS = {
    USERS: 'users',
    PROPERTIES: 'properties',
    VERIFICATIONS: 'verifications',
    CHATS: 'chats',
    MESSAGES: 'messages',
    SUPPORT: 'support',
    REVIEWS: 'reviews',
    BOOKINGS: 'bookings'
};

// Image Upload Limits
export const IMAGE_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_COUNT: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
};
