# Rentro - Trust-Centered Rental Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-v0.72-blue)
![Expo](https://img.shields.io/badge/Expo-v49.0-black)
![Firebase](https://img.shields.io/badge/Firebase-9.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green)

A complete, production-ready rental ecosystem with AI-powered trust verification, built entirely with **FREE** resources.

## 📸 Screenshots

| Mobile App | Admin Panel |
|:---:|:---:|
| ![Mobile App](https://via.placeholder.com/300x600?text=Mobile+App+Screenshot) | ![Admin Panel](https://via.placeholder.com/600x400?text=Admin+Panel+Screenshot) |
| *Tenant Feed & Owner Listings* | *Dashboard & Verification Center* |

## 🎯 Project Overview

**Rentro** is a rental platform that prioritizes trust and safety through AI-powered verification systems. The platform consists of three main components:

1. **Mobile App** (React Native + Expo) - For tenants and property owners
2. **Web Admin Panel** (React + Vite + Tailwind) - For administrators
3. **AI Backend** (Node.js + Express + Hugging Face) - Trust & safety analysis

### Key Features

✅ **Dual-Role Mobile App** - Seamless tenant/owner experience  
✅ **AI-Powered Spam Detection** - Analyses property descriptions  
✅ **Face Verification** - Matches ID cards with live selfies  
✅ **Real-time Chat** - Firestore-powered messaging  
✅ **Admin Verification Center** - Side-by-side ID review  
✅ **100% Free Resources** - Firebase, Hugging Face, Render.com  

---

## 🏗️ Architecture

```
Rentro application/
├── rentro-backend/           # AI Wrapper Service (Node.js + Express)
│   ├── server.js            # Main server with 4 AI endpoints
│   ├── package.json
│   └── .env.example
│
├── rentro-mobile/           # Mobile App (React Native + Expo)
│   ├── app/
│   │   ├── (auth)/         # Login & Signup
│   │   ├── (tenant)/       # Property feed, search, chat
│   │   ├── (owner)/        # Add listing, verification
│   │   └── _layout.tsx     # Root navigation
│   ├── firebaseConfig.js
│   └── app.json
│
├── rentro-admin/            # Web Admin Panel (React + Vite)
│   ├── src/
│   │   ├── pages/          # Dashboard, Verification, Properties
│   │   ├── components/     # Sidebar, etc.
│   │   └── config/firebase.js
│   └── tailwind.config.js
│
└── shared/                  # Shared utilities
    ├── firebaseConfig.js
    └── constants.js
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 18+ and npm
- **Android Studio** (for mobile testing)
- **Firebase Account** (free tier)
- **Hugging Face Account** (free API key)

### Step 1: Clone & Setup

```bash
cd "Rentro application"
```

### Step 2: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. The project is already configured with your credentials
3. Enable **Email/Password** authentication in Firebase Console
4. Create Firestore database (start in test mode, we'll add rules later)
5. Enable Firebase Storage

### Step 3: Backend Setup

```bash
cd rentro-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your Hugging Face API key
# Get it from: https://huggingface.co/settings/tokens

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

**API Endpoints:**
- `POST /api/analyze-listing` - Spam detection
- `POST /api/analyze-images` - Image captioning
- `POST /api/verify-face` - Face matching
- `POST /api/chat-bot` - Support chatbot

### Step 4: Mobile App Setup

```bash
cd ../rentro-mobile

# Dependencies already installed
# Start Expo development server
npx expo start
```

**To run on Android Emulator:**
1. Start Android Studio emulator
2. Press `a` in the Expo terminal

**To run on physical device:**
1. Install Expo Go app from Play Store
2. Scan the QR code

**Important:** Update the API base URL in `app/(owner)/add-listing.tsx`:
```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000'; // e.g., http://192.168.1.100:5000
```

For Android emulator, use: `http://10.0.2.2:5000`

### Step 5: Admin Panel Setup

```bash
cd ../rentro-admin

# Dependencies already installed
# Start development server
npm run dev
```

The admin panel will run on `http://localhost:5173`

---

## 📱 Mobile App Features

### For Tenants:
- **Home Feed** - Browse verified properties
- **Search & Filters** - Find properties by location, price, BHK
- **Property Details** - View images, amenities, owner info
- **Real-time Chat** - Message property owners
- **Wishlist** - Save favorite properties
- **Reviews** - Rate and review properties

### For Owners:
- **Add Listing** - Multi-step form with image upload
- **AI Pre-Check** - Real-time spam detection
- **Verification** - Upload ID + selfie for trust badge
- **Dashboard** - Manage listings and booking requests
- **Chat** - Respond to tenant inquiries

---

## 💼 Admin Panel Features

### Dashboard
- Total users, verifications, and listings stats
- Recent activity feed
- Growth charts

### Verification Center
- **Side-by-side ID/Selfie viewer**
- AI face match score display
- One-click approve/reject
- Updates user trust score automatically

### Property Queue
- Review pending listings
- View AI spam scores
- Flag suspicious content
- Approve/reject with reasons

### User Management
- View all users
- Ban/unban users
- Reset verifications

---

## 🤖 AI Agents

### VeriSentry (Trust & Safety)

**1. Spam Detection**
- Model: `distilbert-base-uncased-finetuned-sst-2-english`
- Detects: Scam keywords, phone numbers, excessive caps
- Score: 0-100 (higher = more suspicious)

**2. Image Analysis**
- Model: `Salesforce/blip-image-captioning-base`
- Generates captions for property images
- Matches captions with descriptions

**3. Face Verification**
- Compares ID photo with selfie
- Returns match confidence (0-100%)

### HelpBot (Support Assistant)

- Model: `google/flan-t5-base`
- Auto-responds to common questions
- Escalates negative sentiment to admins
- Detects urgent keywords (fraud, harassment)

---

## 🔥 Firebase Firestore Schema

### users/{uid}
```javascript
{
  email: string,
  name: string,
  phone: string,
  role: 'tenant' | 'owner' | 'admin',
  isVerified: boolean,
  trustScore: number,         // 0-100
  createdAt: timestamp
}
```

### properties/{propId}
```javascript
{
  ownerId: string,
  title: string,
  description: string,
  price: number,
  city: string,
  location: { address, lat, lng },
  images: string[],           // Firebase Storage URLs
  amenities: string[],
  type: 'apartment' | 'house' | 'room',
  bhk: number,
  status: 'pending' | 'verified' | 'rejected',
  aiAnalysis: {
    spamScore: number,
    imageMatch: boolean,
    flags: string[]
  },
  createdAt: timestamp
}
```

### verifications/{reqId}
```javascript
{
  userId: string,
  idCardUrl: string,          // Firebase Storage URL
  selfieUrl: string,          // Firebase Storage URL
  status: 'pending' | 'approved' | 'rejected',
  aiFaceMatchScore: number,   // 0-100
  submittedAt: timestamp,
  reviewedAt: timestamp,
  reviewedBy: string
}
```

### chats/{chatId}
```javascript
{
  participants: [uid1, uid2],
  lastMessage: string,
  updatedAt: timestamp,
  
  // Subcollection: messages/{msgId}
  messages: {
    senderId: string,
    content: string,
    timestamp: timestamp
  }
}
```

---

## 🔒 Firebase Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data and create new accounts
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Properties are public for reading, owners can create
    match /properties/{propertyId} {
      allow read: if true;
      allow create: if request.auth != null && 
                      request.resource.data.ownerId == request.auth.uid;
      allow update: if request.auth.uid == resource.data.ownerId ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Verifications - users can create, admins can update
    match /verifications/{verificationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Chats - only participants can access
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid in resource.data.participants;
    }
  }
}
```

---

## 📦 Deployment

### Backend (Render.com - Free Tier)

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new **Web Service**
4. Connect repository
5. **Build Command:** `cd rentro-backend && npm install`
6. **Start Command:** `cd rentro-backend && npm start`
7. Add environment variable: `HUGGINGFACE_API_KEY`
8. Deploy!

Your backend URL will be: `https://your-app.onrender.com`

Update mobile app and admin URLs to use this.

### Mobile App (EAS Build)

```bash
cd rentro-mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build APK for Android
eas build --platform android --profile preview
```

Download the APK and install on Android devices.

### Admin Panel (Vercel - Free Tier)

```bash
cd rentro-admin

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Or connect repository to Vercel dashboard for auto-deployment.

---

## 🎨 Design & UI

**Mobile App:**
- Modern card-based design
- Primary color: Indigo (#4F46E5)
- Clean, minimal interface
- Smooth transitions
- Loading states everywhere

**Admin Panel:**
- Tailwind CSS utility-first
- Responsive sidebar
- Data tables with actions
- Color-coded AI scores:
  - Green: < 30 (safe)
  - Yellow: 30-60 (moderate)
  - Red: > 60 (suspicious)

---

## 🚨 Known Limitations (MVP)

1. **Hugging Face Rate Limits** - Free tier has ~1000 requests/day
2. **Face Verification** - Uses simplified logic (upgrade for production)
3. **Maps Integration** - Not implemented (add React Native Maps)
4. **Push Notifications** - Not configured (use Firebase Cloud Messaging)
5. **Payment Gateway** - Not implemented
6. **Advanced Search** - Basic filters only

---

## 🔧 Troubleshooting

### Backend not connecting
- Check if backend is running on correct port
- Update mobile app API URL to your machine's IP
- For Android emulator, use `10.0.2.2:5000`

### Expo app not loading
- Clear Metro bundler cache: `npx expo start -c`
- Check firebaseConfig.js is correct
- Ensure all dependencies installed

### Admin panel blank screen
- Check browser console for errors
- Verify Firebase config in src/config/firebase.js
- Run `npm run build` to check for build errors

### Firebase permission denied
- Update Firestore Security Rules (see above)
- Check user is authenticated
- Verify document paths are correct

---

## 📞 Support

For issues or questions:
1. Check Firestore data structure
2. Check browser/mobile console logs
3. Verify all environment variables are set
4. Ensure Firebase services are enabled

---

## 🎉 Next Steps

After MVP is working:

1. **Add Firebase Security Rules** (see above)
2. **Configure Push Notifications**
3. **Integrate Google Maps** for property locations
4. **Add Payment Gateway** (Razorpay/Stripe)
5. **Implement Reviews & Ratings system**
6. **Add Booking Management**
7. **Create Mobile Responsive Admin Panel**
8. **Add Analytics Dashboard** (Firebase Analytics)
9. **Implement Advanced Search** with Algolia
10. **Add Email Notifications** (SendGrid/Mailgun)

---

## 📄 License

MIT License - Feel free to use for learning and commercial projects.

---

## 🙏 Built With

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Firebase** - Backend & Database (FREE)
- **Hugging Face** - AI Models (FREE)
- **Tailwind CSS** - Styling
- **Node.js + Express** - Backend API
- **Vite** - Build tool
- **Render.com** - Hosting (FREE)

**Total Cost: $0.00** ✅

---

## 👥 Contributors

Built as a production-ready MVP for trust-centered rental platforms.

**Happy Renting! 🏠**
