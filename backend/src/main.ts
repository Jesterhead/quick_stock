import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthSeeding } from './auth/auth.seeding';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const nodeEnv = process.env.NODE_ENV || 'development';
  
  app.enableCors({
    origin: nodeEnv === 'production' 
      ? process.env.FRONTEND_URL || 'https://your-frontend.vercel.app'
      : 'http://localhost:4200',
    credentials: true,
  });

  const seeding = app.get(AuthSeeding);
  await seeding.seed();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port} in ${nodeEnv} mode`);
}
bootstrap();