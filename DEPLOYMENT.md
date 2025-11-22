# Deployment Guide

## Quick Deploy to Another System

### Option 1: Using Git (Recommended)

1. **Initialize Git repository** (on current system):
```bash
cd C:\Users\Vikas\.gemini\antigravity\scratch\pronunciation-coach
git init
git add .
git commit -m "Initial commit - AI Pronunciation Coach"
```

2. **Push to GitHub/GitLab**:
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/pronunciation-coach.git
git branch -M main
git push -u origin main
```

3. **Clone on new system**:
```bash
git clone https://github.com/yourusername/pronunciation-coach.git
cd pronunciation-coach
```

4. **Follow setup steps** from SETUP.md

### Option 2: Manual Transfer

1. **Copy the entire folder** to a USB drive or cloud storage
2. **Transfer to new system**
3. **Follow setup steps** from SETUP.md

### Option 3: Create ZIP Archive

1. **Compress the folder**:
   - Right-click on `pronunciation-coach` folder
   - Select "Send to" → "Compressed (zipped) folder"

2. **Share the ZIP file** via:
   - Email
   - Cloud storage (Google Drive, Dropbox, OneDrive)
   - USB drive

3. **Extract on new system** and follow SETUP.md

## Cloud Deployment

### Deploy Backend to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
cd backend
railway login
railway init
railway up
```

3. Add environment variables in Railway dashboard

### Deploy Frontend to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow prompts to complete deployment

### Deploy Backend to Heroku

1. Install Heroku CLI
2. Create Heroku app:
```bash
cd backend
heroku create your-app-name
git push heroku main
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
```

## Database Setup

### MongoDB Atlas (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` with connection string

## Important Notes

- ✅ Both backend and frontend must be running
- ✅ Backend must start before frontend for API calls to work
- ✅ Use Chrome/Edge for best speech recognition support
- ✅ App works in demo mode without MongoDB
- ✅ Microphone permissions required for voice features

## Files to Share

Include these files when sharing:
- ✅ All source code files
- ✅ package.json files (both backend and frontend)
- ✅ .env.example (NOT .env with secrets)
- ✅ README.md
- ✅ SETUP.md
- ✅ This DEPLOYMENT.md

Do NOT share:
- ❌ node_modules folders
- ❌ .env file (contains secrets)
- ❌ dist/build folders
