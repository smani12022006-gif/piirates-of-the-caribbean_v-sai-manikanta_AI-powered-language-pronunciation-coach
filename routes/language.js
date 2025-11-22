import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { demoUsers } from './auth.js';

const router = express.Router();

// Available languages
const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
];

// Get available languages
router.get('/list', (req, res) => {
    res.json({
        success: true,
        languages: LANGUAGES
    });
});

// Select language
router.put('/select', authenticateToken, async (req, res) => {
    try {
        const { language } = req.body;

        if (!language) {
            return res.status(400).json({
                success: false,
                message: 'Language is required'
            });
        }

        const validLanguage = LANGUAGES.find(l => l.code === language);
        if (!validLanguage) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language code'
            });
        }

        const dbConnected = User.db && User.db.readyState === 1;

        if (dbConnected) {
            const user = await User.findById(req.user._id);
            user.selectedLanguage = language;
            await user.save();

            res.json({
                success: true,
                message: 'Language selected successfully',
                selectedLanguage: language
            });
        } else {
            // Demo mode
            const user = demoUsers.find(u => u.id === req.user.userId);
            if (user) {
                user.selectedLanguage = language;
            }

            res.json({
                success: true,
                message: 'Language selected successfully (Demo Mode)',
                selectedLanguage: language
            });
        }
    } catch (error) {
        console.error('Language selection error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to select language'
        });
    }
});

export default router;
