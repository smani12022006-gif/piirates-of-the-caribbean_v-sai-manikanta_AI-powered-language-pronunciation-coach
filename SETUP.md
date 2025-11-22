# Setup Guide - AI-Powered Language Pronunciation Coach

This guide will help you set up and run the application on any system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (optional - app works in demo mode without it) - [Download here](https://www.mongodb.com/try/download/community)
- **Modern web browser** (Chrome or Edge recommended for speech recognition)

## Installation Steps

### 1. Clone or Copy the Repository

Copy the entire `pronunciation-coach` folder to your system.

### 2. Backend Setup

Open a terminal/command prompt and navigate to the backend folder:

```bash
cd pronunciation-coach/backend
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
# Copy the example env file
cp .env.example .env

# Or on Windows:
copy .env.example .env
```

Edit the `.env` file if needed (default values work for demo mode):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pronunciation-coach
JWT_SECRET=pronunciation-coach-secret-key-2025
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

Or if MongoDB is not installed:
```
⚠️  Running in demo mode without database
🚀 Server running on http://localhost:5000
```

### 3. Frontend Setup

Open a **new** terminal/command prompt and navigate to the frontend folder:

```bash
cd pronunciation-coach/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

You should see:
```
VITE ready in XXXms
➜  Local:   http://localhost:3000/
```

### 4. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Usage

1. **Register**: Create a new account with your details
2. **Select Language**: Choose from 10+ available languages
3. **Choose Mode**: 
   - **Learn with AI**: Get instant pronunciation feedback
   - **Practice Mode**: Practice at your own pace
4. **Start Practicing**: Click the microphone and speak!

## Browser Compatibility

- ✅ **Chrome** (Recommended)
- ✅ **Edge** (Recommended)
- ✅ **Safari**
- ❌ **Firefox** (Speech recognition not supported)

## Troubleshooting

### Backend won't start

**Error: Port 5000 already in use**
- Change the `PORT` in `.env` file to another port (e.g., 5001)
- Update the proxy in `frontend/vite.config.js` to match

**MongoDB connection error**
- The app will automatically run in demo mode
- Or install MongoDB and ensure it's running on port 27017

### Frontend won't start

**Error: Port 3000 already in use**
- The Vite server will automatically try the next available port
- Or stop the process using port 3000

**Dependencies installation failed**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Microphone not working

- **Grant microphone permissions** in your browser
- **Use HTTPS or localhost** (required for Web Speech API)
- **Try Chrome/Edge** (best support for speech recognition)

## Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy Backend

1. Set up MongoDB database (MongoDB Atlas recommended)
2. Update `.env` with production values:
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-secure-secret-key
   ```
3. Deploy to your hosting service (Heroku, Railway, DigitalOcean, etc.)

### Deploy Frontend

Upload the `dist` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Update the API base URL in `frontend/src/services/api.js` to point to your production backend.

## Project Structure

```
pronunciation-coach/
├── backend/              # Express.js server
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Helper functions
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env             # Environment variables
│
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React context
│   │   ├── services/   # API services
│   │   └── index.css   # Global styles
│   ├── index.html      # HTML template
│   ├── vite.config.js  # Vite configuration
│   └── package.json    # Frontend dependencies
│
├── README.md           # Project documentation
└── SETUP.md           # This file
```

## Features

- ✅ User registration and authentication
- ✅ 10+ language support
- ✅ AI-powered pronunciation scoring
- ✅ Voice recognition using Web Speech API
- ✅ Practice mode with progress tracking
- ✅ Modern, responsive UI
- ✅ Demo mode (works without database)

## Support

For issues or questions, refer to:
- [README.md](README.md) - Project overview
- [Backend API Documentation](README.md#api-endpoints)
- Web Speech API documentation

## License

MIT License - Feel free to use and modify as needed.
