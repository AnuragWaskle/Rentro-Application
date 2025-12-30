# 🚀 Rentro Quick Start Guide

Get the Rentro platform running in 15 minutes!

## Prerequisites Check ✅

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Android Studio installed (for mobile testing)
- [ ] Firebase account created
- [ ] Hugging Face account created

---

## Step 1: Setup Backend (5 minutes)

```bash
cd "Rentro application/rentro-backend"

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Open .env and add your Hugging Face API key
# Get it from: https://huggingface.co/settings/tokens
# HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxx

# Start server
npm run dev
```

✅ **Verify:** Open http://localhost:5000 - you should see API info

---

## Step 2: Setup Firebase (3 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Your project "rentro-application" is already configured
3. **Enable Authentication:**
   - Click "Authentication" → "Get Started"
   - Enable "Email/Password"
4. **Create Firestore Database:**
   - Click "Firestore Database" → "Create Database"
   - Start in **test mode** (we'll add rules later)
   - Choose region closest to you
5. **Enable Storage:**
   - Click "Storage" → "Get Started"
   - Start in **test mode**

✅ **Verify:** All three services show as "enabled"

---

## Step 3: Run Mobile App (5 minutes)

```bash
cd ../rentro-mobile

# Already has dependencies installed
# Just start the dev server
npx expo start
```

### Option A: Android Emulator (Recommended)

1. Open Android Studio
2. Create/start an emulator (API 33+)
3. In Expo terminal, press `a`

### Option B: Physical Device

1. Install "Expo Go" from Play Store
2. Scan QR code from terminal

**IMPORTANT:** Update API URL in `app/(owner)/add-listing.tsx`:

For **Android Emulator:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:5000';
```

For **Physical Device:**
```javascript
const API_BASE_URL = 'http://YOUR_IP:5000'; // e.g., http://192.168.1.100:5000
```

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig` or `ip addr`

✅ **Verify:** App loads, you can see login screen

---

## Step 4: Run Admin Panel (2 minutes)

```bash
cd ../rentro-admin

# Already has dependencies installed
npm run dev
```

✅ **Verify:** Open http://localhost:5173 - you should see dashboard

---

## 🎯 Test the Complete Flow

### Test 1: User Registration & Login

1. **Mobile App:**
   - Click "Sign Up"
   - Enter: Name, Email, Password
   - Select role: "List a Property" (Owner)
   - Submit

2. **Verify:**
   - ✅ Account created
   - ✅ Firestore has new user document
   - ✅ Auto-logged in

### Test 2: Create a Property Listing

1. **Mobile App (Owner):**
   - Go to "Add Listing" (you may need to navigate manually)
   - Fill in property details
   - Click "🤖 AI Pre-Check"
   - See spam score (should be low for normal text)
   - Upload images
   - Submit

2. **Verify in Firestore:**
   - Open Firebase Console → Firestore
   - Check `properties` collection
   - See new document with status: "pending"

3. **Admin Panel:**
   - Refresh dashboard
   - See pending property in "Pending Listings" stat
   - Click "Properties" in sidebar
   - See your listing with AI score
   - Click "Approve"

4. **Mobile App (Tenant):**
   - Logout and sign up as tenant OR switch roles
   - Go to home feed
   - See your approved listing with "Verified" badge!

✅ **End-to-End Flow Working!**

### Test 3: Owner Verification

1. **Mobile App (Owner):**
   - Navigate to verification screen
   - Upload any ID image
   - Take/upload selfie
   - Submit

2. **Admin Panel:**
   - Click "Verifications" in sidebar
   - See verification card
   - Click "Review Details"
   - See side-by-side ID/Selfie
   - See AI match score
   - Click "Approve"

3. **Verify:**
   - Check Firestore: user `isVerified` = true
   - Trust score increased

---

## 🐛 Troubleshooting

### Backend not connecting
```bash
# Check if running
curl http://localhost:5000

# Restart server
cd rentro-backend
npm run dev
```

### Mobile app crashing
```bash
# Clear cache
cd rentro-mobile
npx expo start -c
```

### Firestore permission denied
```
Error: Missing or insufficient permissions
```

**Solution:** Update Firestore rules to test mode:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // TEMPORARY - for testing only
    }
  }
}
```

⚠️ **WARNING:** Remove this rule before production!

### Can't upload images
```
Error: Firebase Storage upload failed
```

**Solution:** Check Firebase Storage rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📱 Key Screens to Test

### Mobile App

**Authentication:**
- ✅ Login: `rentro-mobile/app/(auth)/login.tsx`
- ✅ Signup: `rentro-mobile/app/(auth)/signup.tsx`

**Tenant:**
- ✅ Home Feed: `rentro-mobile/app/(tenant)/index.tsx`
- ✅ Profile: `rentro-mobile/app/(tenant)/profile.tsx`

**Owner:**
- ✅ Add Listing: `rentro-mobile/app/(owner)/add-listing.tsx`
- ✅ Verification: `rentro-mobile/app/(owner)/verification.tsx`

### Admin Panel

- ✅ Dashboard: http://localhost:5173/
- ✅ Verifications: http://localhost:5173/verifications
- ✅ Properties: http://localhost:5173/properties

---

## 🎨 Sample Test Data

### Low Spam Property (Score ~10-20)
```
Title: Modern 2BHK Apartment in Andheri
Description: Spacious apartment with modern amenities including WiFi, AC, and parking. Located near metro station with easy access to markets and schools.
Price: 25000
City: Mumbai
```

### High Spam Property (Score ~80+)
```
Title: URGENT DEAL!!!
Description: Call me directly at 9876543210. Pay advance NOW! Limited time offer. 100% guaranteed!
Price: 5000
City: Mumbai
```

---

## 🚀 Next Steps

After everything is working:

1. **Add Firebase Security Rules** (see README.md)
2. **Deploy Backend** to Render.com
3. **Build Mobile APK** with `eas build`
4. **Deploy Admin** to Vercel
5. **Configure Production URLs**

---

## 📞 Need Help?

1. Check main [README.md](file:///home/anurag/Desktop/Rentro%20application/README.md) for detailed docs
2. Check [walkthrough.md](file:///home/anurag/.gemini/antigravity/brain/a9411be1-7cf4-4611-af53-ed0ec50bdadd/walkthrough.md) for architecture details
3. Review browser/mobile console for errors
4. Check Firestore data directly in Firebase Console

---

**Happy Renting! 🏠**
