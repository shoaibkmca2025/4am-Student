
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import userAssessmentRoutes from './routes/userAssessmentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://students.4amglobalmedia.com',
  'https://4am-student.vercel.app'
];
const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global rate limiter
app.use('/api', apiLimiter);

// Database Connection
connectDB();

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));
app.use('/api/assessments', assessmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/user-assessments', userAssessmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

// API 404 handler
app.all(/^\/api(?:\/.*)?$/, (req, res) => {
  return res.status(404).json({ message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = Number.isInteger(err?.status) ? err.status : 500;
  let message = err?.message || 'Server error';
  let details;

  // Mongoose cast errors (for example invalid ObjectId) should be client errors.
  if (err?.name === 'CastError') {
    status = 400;
    message = 'Invalid request data';
  } else if (err?.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([key, value]) => [key, value?.message || 'Invalid value'])
    );
  } else if (err?.code === 11000) {
    status = 409;
    message = 'Duplicate value already exists';
  }

  if (status >= 500) {
    console.error(err.stack || err);
  }

  return res.status(status).json({
    message,
    details,
    ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {})
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
