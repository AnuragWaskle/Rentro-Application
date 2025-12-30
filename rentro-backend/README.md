# Rentro AI Backend

AI-powered backend service for the Rentro rental platform. Provides spam detection, image analysis, face verification, and chatbot support using Hugging Face models.

## Features

### VeriSentry Agent (Trust & Safety)
- **Spam Detection**: Analyzes property descriptions for scam keywords and suspicious patterns
- **Image Analysis**: Generates captions for property images and matches with descriptions
- **Face Verification**: Compares ID photos with selfies for owner verification

### HelpBot Agent (Support)
- **AI Chatbot**: Automated responses for common questions
- **Smart Escalation**: Detects negative sentiment and escalates to human support

## Setup

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure Environment**:
```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face API key:
```env
HUGGINGFACE_API_KEY=your_actual_key_here
```

Get your API key from: https://huggingface.co/settings/tokens (Free tier available)

3. **Run Development Server**:
```bash
npm run dev
```

4. **Run Production Server**:
```bash
npm start
```

## API Endpoints

### POST /api/analyze-listing
Analyzes property description for spam/scam content.

**Request**:
```json
{
  "title": "Beautiful 2BHK Apartment",
  "description": "Spacious apartment with modern amenities",
  "price": 15000
}
```

**Response**:
```json
{
  "success": true,
  "spamScore": 15,
  "isSuspicious": false,
  "trustLevel": "high",
  "flags": [],
  "patterns": {...},
  "recommendation": "Listing appears legitimate"
}
```

### POST /api/analyze-images
Generates captions for images and matches with description.

**Request**:
```json
{
  "imageUrls": ["https://...", "https://..."],
  "description": "Kitchen with modern appliances"
}
```

**Response**:
```json
{
  "success": true,
  "captions": [...],
  "imageMatch": true,
  "matchDetails": [...]
}
```

### POST /api/verify-face
Compares ID photo with selfie.

**Request**:
```json
{
  "idCardUrl": "https://...",
  "selfieUrl": "https://..."
}
```

**Response**:
```json
{
  "success": true,
  "matchScore": 87,
  "isMatch": true,
  "confidence": "high",
  "recommendation": "Face match verified"
}
```

### POST /api/chat-bot
AI support chatbot.

**Request**:
```json
{
  "message": "How do I upload photos?",
  "context": "user_support"
}
```

**Response**:
```json
{
  "success": true,
  "reply": "To upload property images...",
  "shouldEscalate": false
}
```

## Deployment

### Render.com (Free Tier)

1. Create account on Render.com
2. Create new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variable: `HUGGINGFACE_API_KEY`
7. Deploy!

### Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

## Free Tier Limitations

- **Hugging Face**: ~1000 requests/day on free tier
- **Render.com**: 750 hours/month, sleeps after 15min inactivity
- Consider implementing caching for repeated queries

## Tech Stack

- Node.js + Express
- Hugging Face Inference API
- Rate limiting with express-rate-limit
- CORS enabled for mobile/web clients

## Models Used

1. `distilbert-base-uncased-finetuned-sst-2-english` - Sentiment analysis
2. `Salesforce/blip-image-captioning-base` - Image captioning
3. `google/flan-t5-base` - Conversational AI

All models are available on Hugging Face free tier.
