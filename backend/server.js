import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

// Import local configurations and utilities
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// Use helmet for setting various HTTP headers for security
app.use(helmet());

// Use morgan for HTTP request logging based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Enable CORS (Cross-Origin Resource Sharing)
const allowedOrigins = [process.env.FRONTEND_URL, 'https://your-app.vercel.app', 'http://localhost:5174', 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse incoming JSON payloads and limit request size to 10kb
app.use(express.json({ limit: '10kb' }));

// Parse incoming URL-encoded data payloads
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against NoSQL query injection
// Custom wrapper for express-mongo-sanitize to support Express 5
// (avoids TypeError: Cannot set property query of # which has only a getter)
app.use((req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (req[key]) {
      mongoSanitize.sanitize(req[key]);
    }
  });
  next();
});

// Rate Limiting Configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: 'Too many auth attempts.',
});

// Apply general rate limit to all /api/ routes
app.use('/api/', generalLimiter);

// ==========================================
// Route Registration
// ==========================================


app.use('/api/auth/', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Add a simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// ==========================================
// Error Handling
// ==========================================

// Register the global errorHandler middleware LAST (after all other routes and middleware)
app.use(errorHandler);

// ==========================================
// Server Initialization
// ==========================================

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

// Environment validation
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

let server;

const startServer = async () => {
  // Validate environment before attempting database connection
  checkRequiredEnvVars();

  // Call connectDB to establish database connection
  await connectDB();
  
  // Start listening for incoming requests
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${MODE} mode`);
  });
};

// Start the server
startServer();

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Server shutting down gracefully');
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }

  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
