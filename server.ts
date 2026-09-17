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
    console.warn('===============================================================');
    console.warn('[CONFIG NOTICE] Missing production environment variables:');
    for (const missing of validation.missingRequired) {
      console.warn(`  - ${missing}`);
    }
    console.warn('[Notice] The server is starting with graceful fallbacks. Configure these variables in the Settings menu for live third-party integrations.');
    console.warn('===============================================================');
  }

  if (validation.warnings.length > 0) {
    for (const warning of validation.warnings) {
      console.warn(`[Config Notice] ${warning}`);
    }
  }

  // 2. Initialize Database Schema on Neon PostgreSQL
  try {
    const initialized = await initDatabase();
    if (!initialized && config.databaseUrl) {
      console.warn('[Server Startup Warning] Database initialization incomplete despite DATABASE_URL being configured.');
    }
  } catch (err: any) {
    console.warn('[Server Startup Warning] Database initialization encountered an error:', err.message);
    console.warn('[Server Notice] Continuing server startup with graceful in-memory storage fallback.');
  }

  if (config.nodeEnv !== 'production') {
    app.use(express.static(path.join(process.cwd(), 'public')));
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
