# AI-Powered Language Pronunciation Coach

A full-stack web application that helps users improve their pronunciation through AI-powered speech recognition and real-time feedback.

## Features

- **User Registration & Authentication**: Secure user accounts with JWT tokens
- **Language Selection**: Choose from 10+ languages to practice
- **AI Learning Mode**: Get real-time pronunciation feedback with accuracy scoring
- **Practice Mode**: Practice with curated words and track your progress
- **Speech Recognition**: Browser-based Web Speech API for voice input
- **Progress Tracking**: View your practice history and average scores

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (optional - runs in demo mode without database)
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 18
- Vite
- React Router
- Axios
- Web Speech API
- Modern CSS with glassmorphism effects

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (optional)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## Usage

1. **Register**: Create a new account with your details
2. **Select Language**: Choose the language you want to practice
3. **Choose Mode**:
   - **Learn with AI**: Get instant feedback on your pronunciation
   - **Practice Mode**: Practice at your own pace with progress tracking
4. **Start Practicing**: Click the microphone button and speak the displayed word
5. **Get Feedback**: Receive an accuracy score and feedback on your pronunciation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Language
- `GET /api/language/list` - Get available languages
- `PUT /api/language/select` - Select user's language

### Practice
- `GET /api/practice/content` - Get practice content
- `POST /api/practice/score` - Submit pronunciation for scoring
- `GET /api/practice/history` - Get practice history

## Features in Detail

### Speech Recognition
Uses the Web Speech API for browser-based speech recognition. Supports real-time transcription of spoken words.

### Pronunciation Scoring
Implements Levenshtein distance algorithm to calculate similarity between expected and spoken text, providing accuracy scores from 0-100%.

### Demo Mode
The application can run without MongoDB, using in-memory storage for demonstration purposes.

## Browser Compatibility

The Web Speech API is supported in:
- Chrome/Edge (recommended)
- Safari
- Not supported in Firefox

## Future Enhancements

- Integration with advanced speech recognition APIs (Google Cloud, Azure)
- More languages and practice content
- Detailed pronunciation analytics
- Gamification features
- Mobile app version

## License

MIT

## Author

Built with ❤️ for language learners worldwide
