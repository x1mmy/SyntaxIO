// This is the Authentication logic
import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate a JWT token for a user
const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(
        { user: userId },
        secret,
        { expiresIn: '30d' }
    );
};

// @description     Register new user
// @route           POST /api/auth/register
// @access          Public
export const registerUser: RequestHandler<
    {},
    any,
    { email: string; password: string; username: string }
> = async (req, res): Promise<void> => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            email,
            password,
            username
        });

        const token = generateToken(user._id.toString());

        res.status(201).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error - registerUser' });
    }
};


// @description     Login user
// @route           POST /api/auth/login
// @access          Public
export const loginUser: RequestHandler<
    {},
    any,
    { email: string; password: string }
> = async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user._id.toString());
        res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @description     Get user profile
// @route           GET /api/auth/profile
// @access          Private
export const getUserProfile: RequestHandler = async (req, res): Promise<void> => {
    try {
        if (!req.user?._id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};