import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthSeeding } from './auth/auth.seeding';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const nodeEnv = process.env.NODE_ENV || 'development';
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-vercel-frontend.vercel.app'
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