import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for demo mode
let demoUsers = [];

// Register
router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body);
    try {
        const { firstName, lastName, userId, phone, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !userId || !phone || !email || !password) {
            console.log('Missing fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if database is connected
        const dbConnected = User.db && User.db.readyState === 1;
        console.log('DB Connected:', dbConnected);

        const jwtSecret = process.env.JWT_SECRET || 'demo_secret_key_123';

        if (dbConnected) {
            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or user ID already exists'
                });
            }

            // Create new user
            const user = new User({
                firstName,
                lastName,
                userId,
                phone,
                email,
                password
            });

            await user.save();

            // Generate token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userId: user.userId,
                    email: user.email,
                    selectedLanguage: user.selectedLanguage
                }
            });
        } else {
            // Demo mode - in-memory storage
            console.log('Running in demo mode');
            const existingUser = demoUsers.find(u => u.email === email || u.userId === userId);
            if (existingUser) {
                console.log('User already exists in demo mode');
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or user ID already exists'
                });
            }

            const newUser = {
                id: Date.now().toString(),
                firstName,
                lastName,
                userId,
                phone,
                email,
                password, // In demo mode, not hashed
                selectedLanguage: null,
                progress: {},
                practiceHistory: []
            };

            demoUsers.push(newUser);
            console.log('New user added to demoUsers:', newUser);

            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully (Demo Mode)',
                token,
                user: {
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    userId: newUser.userId,
                    email: newUser.email,
                    selectedLanguage: newUser.selectedLanguage
                }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const dbConnected = User.db && User.db.readyState === 1;
        const jwtSecret = process.env.JWT_SECRET || 'demo_secret_key_123';

        if (dbConnected) {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userId: user.userId,
                    email: user.email,
                    selectedLanguage: user.selectedLanguage
                }
            });
        } else {
            // Demo mode
            const user = demoUsers.find(u => u.email === email && u.password === password);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful (Demo Mode)',
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userId: user.userId,
                    email: user.email,
                    selectedLanguage: user.selectedLanguage
                }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const dbConnected = User.db && User.db.readyState === 1;

        if (dbConnected) {
            res.json({
                success: true,
                user: req.user
            });
        } else {
            // Demo mode
            const user = demoUsers.find(u => u.id === req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const { password, ...userWithoutPassword } = user;
            res.json({
                success: true,
                user: userWithoutPassword
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

export default router;
export { demoUsers };
