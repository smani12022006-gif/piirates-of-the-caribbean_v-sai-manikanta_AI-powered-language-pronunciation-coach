import express from 'express';
import User from '../models/User.js';
import Practice from '../models/Practice.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateScore, getFeedback } from '../utils/speechScoring.js';
import { demoUsers } from './auth.js';

const router = express.Router();

// Practice content by language
const PRACTICE_CONTENT = {
    en: [
        { word: 'Hello', pronunciation: 'heh-loh', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Beautiful', pronunciation: 'byoo-tuh-fuhl', difficulty: 'medium', category: 'pronunciation' },
        { word: 'Pronunciation', pronunciation: 'pruh-nuhn-see-ay-shuhn', difficulty: 'hard', category: 'pronunciation' },
        { word: 'Wednesday', pronunciation: 'wenz-day', difficulty: 'medium', category: 'spelling' },
        { word: 'Necessary', pronunciation: 'nes-uh-ser-ee', difficulty: 'medium', category: 'spelling' },
        { word: 'Rhythm', pronunciation: 'rith-uhm', difficulty: 'hard', category: 'spelling' },
        { word: 'Thank you', pronunciation: 'thangk yoo', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Excellent', pronunciation: 'ek-suh-luhnt', difficulty: 'medium', category: 'pronunciation' }
    ],
    es: [
        { word: 'Hola', pronunciation: 'oh-lah', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Gracias', pronunciation: 'grah-see-ahs', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Hermoso', pronunciation: 'er-moh-soh', difficulty: 'medium', category: 'pronunciation' },
        { word: 'Pronunciación', pronunciation: 'proh-noon-see-ah-see-ohn', difficulty: 'hard', category: 'pronunciation' }
    ],
    fr: [
        { word: 'Bonjour', pronunciation: 'bon-zhoor', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Merci', pronunciation: 'mehr-see', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Magnifique', pronunciation: 'mah-nyee-feek', difficulty: 'medium', category: 'pronunciation' }
    ],
    de: [
        { word: 'Hallo', pronunciation: 'hah-loh', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Danke', pronunciation: 'dahn-kuh', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Wunderbar', pronunciation: 'voon-der-bar', difficulty: 'medium', category: 'pronunciation' }
    ],
    hi: [
        { word: 'Namaste', pronunciation: 'nuh-muh-stay', difficulty: 'easy', category: 'pronunciation' },
        { word: 'Dhanyavaad', pronunciation: 'dhuhn-yuh-vaad', difficulty: 'medium', category: 'pronunciation' },
        { word: 'Sundar', pronunciation: 'soon-dur', difficulty: 'easy', category: 'pronunciation' }
    ]
};

// Get practice content
router.get('/content', authenticateToken, async (req, res) => {
    try {
        const { language, category } = req.query;

        if (!language) {
            return res.status(400).json({
                success: false,
                message: 'Language is required'
            });
        }

        let content = PRACTICE_CONTENT[language] || PRACTICE_CONTENT['en'];

        // Filter by category if provided
        if (category) {
            content = content.filter(item => item.category === category);
        }

        // Get random item
        const randomItem = content[Math.floor(Math.random() * content.length)];

        res.json({
            success: true,
            content: randomItem
        });
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get practice content'
        });
    }
});

// Submit pronunciation and get score
router.post('/score', authenticateToken, async (req, res) => {
    try {
        let { expectedText, spokenText } = req.body;

        if (!spokenText) {
            return res.status(400).json({
                success: false,
                message: 'Spoken text is required'
            });
        }

        let score;
        let grammarFeedback = [];
        let sentenceFeedback = [];
        let correctedSentence = '';

        // Simulate AI Analysis
        if (!expectedText) {
            // Free Speech Mode Analysis

            // 1. Basic cleanup for corrected sentence
            correctedSentence = spokenText.trim();
            correctedSentence = correctedSentence.charAt(0).toUpperCase() + correctedSentence.slice(1);
            if (!/[.!?]$/.test(correctedSentence)) {
                correctedSentence += '.';
            }

            // 2. Simulate Grammar Analysis
            const words = spokenText.toLowerCase().split(' ');
            if (words.includes('aint')) {
                grammarFeedback.push("Avoid using 'aint', use 'is not' or 'are not'.");
            }
            if (words.length < 3) {
                grammarFeedback.push("Try to form complete sentences.");
            }
            if (grammarFeedback.length === 0) {
                grammarFeedback.push("Grammar looks good!");
            }

            // 3. Simulate Sentence Formation Analysis
            if (words.length > 15) {
                sentenceFeedback.push("The sentence is quite long. Consider breaking it down.");
            } else if (words.length >= 3) {
                sentenceFeedback.push("Good sentence structure.");
            } else {
                sentenceFeedback.push("Sentence is too short to analyze structure.");
            }

            // 4. Calculate Score (Simulated)
            // Base score on length and "complexity" (simulated)
            const baseScore = Math.min(100, Math.max(60, words.length * 10));
            const randomVariation = Math.floor(Math.random() * 10);
            score = Math.min(100, baseScore + randomVariation);

            // Use the corrected sentence as the "expected" text for display purposes
            expectedText = correctedSentence;

        } else {
            // Guided Mode (Standard scoring)
            score = calculateScore(expectedText, spokenText);
            correctedSentence = expectedText;
            grammarFeedback.push("Followed the guided text.");
            sentenceFeedback.push("Matched the target sentence.");
        }

        const feedback = getFeedback(score);

        // Save to practice history
        const dbConnected = User.db && User.db.readyState === 1;

        if (dbConnected) {
            const user = await User.findById(req.user._id);
            user.practiceHistory.push({
                word: expectedText,
                score,
                date: new Date()
            });
            await user.save();
        } else {
            // Demo mode
            const user = demoUsers.find(u => u.id === req.user.userId);
            if (user) {
                if (!user.practiceHistory) {
                    user.practiceHistory = [];
                }
                user.practiceHistory.push({
                    word: expectedText,
                    score,
                    date: new Date()
                });
            }
        }

        res.json({
            success: true,
            score,
            feedback,
            expectedText,
            spokenText,
            analysis: {
                grammar: grammarFeedback,
                sentenceFormation: sentenceFeedback,
                correctedSentence: correctedSentence
            }
        });
    } catch (error) {
        console.error('Score calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate score'
        });
    }
});

// Get practice history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const dbConnected = User.db && User.db.readyState === 1;

        if (dbConnected) {
            const user = await User.findById(req.user._id);
            res.json({
                success: true,
                history: user.practiceHistory || []
            });
        } else {
            // Demo mode
            const user = demoUsers.find(u => u.id === req.user.userId);
            res.json({
                success: true,
                history: user?.practiceHistory || []
            });
        }
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get practice history'
        });
    }
});

export default router;
