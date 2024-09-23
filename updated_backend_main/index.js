import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cloudinary from './config/cloudinary.js'; // Import cloudinary correctly
import petReportRoutes from './Router/petReport.js'; // Ensure the correct path
import donationRoutes from './Router/Donation.js'; // Ensure the correct path
import { router as createUserRouter } from './Router/CreateUser.js'; // Ensure the correct path
import path from 'path';
import morgan from 'morgan';
import dbConnection from './dbConfig/index.js'; // Ensure the correct path
import errorMiddleware from './middleware/errorMiddleware.js'; // Ensure the correct path
import router from './routes/index.js'; // Ensure the correct path

// Load environment variables
dotenv.config({ path: './config.env' });

// Get the current directory name (decodeURIComponent to handle spaces and special characters)
const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));

// Create an Express app
const app = express();

// Set the port
const port = process.env.PORT || 4000;

// Connect to the database
dbConnection(); // Assuming this is the correct function for DB connection

// Set up middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust origin as needed
}));
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(helmet()); // Add security headers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Set static folder
app.use(express.static(path.join(__dirname, 'views/build')));

// Use the main router
app.use(router);

// Use error middleware
app.use(errorMiddleware);

// Set up routes
app.use('/api', createUserRouter);
app.use('/api', petReportRoutes); // Ensure these routes are correctly set up
app.use('/api', donationRoutes); // Ensure these routes are correctly set up

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Initialize database connection and start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});


