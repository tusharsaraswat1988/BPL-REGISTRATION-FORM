import express, { Express } from 'express';
import cors from 'cors';
import { publicRoutes } from './routes/publicRoutes';
import { uploadRoutes } from './routes/uploadRoutes';
import { draftRoutes } from './routes/draftRoutes';
import { registrationRoutes } from './routes/registrationRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { authRoutes } from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  // Security Headers & CORS
  app.use(cors({
    origin: true,
    credentials: true,
  }));

  // Body Parsing (Strict JSON, 10MB limit)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api', publicRoutes);
  app.use('/api', uploadRoutes);
  app.use('/api', draftRoutes);
  app.use('/api', registrationRoutes);
  app.use('/api', adminRoutes);
  app.use('/api', authRoutes);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}
