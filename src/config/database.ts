// # This is the MongoDB connection

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URL from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/syntaxio';

// Connection options to handle deprecation warnings and ensure proper configuration
const options = {
    // Use new URL parser instead of legacy one
    useNewUrlParser: true,
    // Use new Server Discover and Monitoring engine
    useUnifiedTopology: true,
} as mongoose.ConnectOptions;

export const connectDB = async (): Promise<void> => {
    try {
        // Attempt to connect to MongoDB
        const connection = await mongoose.connect(MONGODB_URI, options);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        // Log any connection errors
        console.error('Error connecting to MongoDB:', error);
        // Exit process with failure
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
