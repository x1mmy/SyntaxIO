// This is the main entry point for the application

// Import required packages
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
dotenv.config();

// Initialize express app - creates a new Express application instance
const app: Express = express()



// Middleware setup:
// cors() enables Cross-Origin Resource Sharing - allows requests from different domains
app.use(cors());

// express.json() parses incoming JSON payloads in request body
app.use(express.json());

// express.urlencoded parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Error handling middleware - catches any errors thrown in routes/middleware
// The 4 parameters tell Express this is error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// ## Routes
// Basic health check endpoint - useful for monitoring if service is running
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);


// Server configuration
// Use environment variable PORT if available, otherwise default to 3000
const PORT = process.env.PORT || 3000;


// Connect to database before starting server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});

// Export app for testing or importing in other files
export default app;

