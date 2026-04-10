import * as crypto from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = crypto as any;
}

import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthSeeding } from './auth/auth.seeding';
import type { Response } from 'express';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const nodeEnv = process.env.NODE_ENV || 'development';
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://triumphant-alignment-production-2609.up.railway.app'
      : 'http://localhost:4200',
    credentials: true,
  });

  if (nodeEnv === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/dist/frontend');
    console.log('Serving frontend from:', frontendPath);
    
    app.use(express.static(frontendPath));
    
    app.use((req, res: Response, next) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
      } else {
        next();
      }
    });
  }

  const seeding = app.get(AuthSeeding);
  await seeding.seed();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port} in ${nodeEnv} mode`);
}
bootstrap();