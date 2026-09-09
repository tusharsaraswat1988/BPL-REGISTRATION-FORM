import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createApp } from './src/server/app';
import { config, validateEnv } from './src/server/config/env';
import { initDatabase } from './src/server/db';

const app = createApp();

async function startServer() {
  // 1. Authoritative Environment Configuration Validation
  const validation = validateEnv();
  if (!validation.valid) {
    console.error('===============================================================');
    console.error('[FATAL CONFIG ERROR] Missing REQUIRED production environment variables:');
    for (const missing of validation.missingRequired) {
      console.error(`  ✗ ${missing}`);
    }
    console.error('===============================================================');
    if (config.nodeEnv === 'production') {
      console.error('[Server Startup FATAL] Refusing to start production server with missing critical variables.');
      process.exit(1);
    }
  }

  if (validation.warnings.length > 0 && config.nodeEnv !== 'production') {
    for (const warning of validation.warnings) {
      console.warn(`[Config Notice] ${warning}`);
    }
  }

  // 2. Initialize Database Schema on Neon PostgreSQL
  try {
    const initialized = await initDatabase();
    if (!initialized && config.databaseUrl) {
      throw new Error('Database initialization failed to complete despite DATABASE_URL being configured.');
    }
  } catch (err: any) {
    console.error('[Server Startup Warning] Database initialization failed:', err.message);
    if (config.nodeEnv === 'production') {
      console.error('[Server Startup FATAL] Refusing to start production server with unverified database schema.');
      process.exit(1);
    } else {
      console.warn('[Server Dev Mode] Starting development server. Update DATABASE_URL in .env to enable full PostgreSQL persistence.');
    }
  }

  if (config.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[BPL Kids Server] BidWar Premier League portal running at http://0.0.0.0:${config.port}`);
  });
}

startServer();
