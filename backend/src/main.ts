import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthSeeding } from './auth/auth.seeding';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });

  const seeding = app.get(AuthSeeding);
  await seeding.seed();

  await app.listen(3000);
}
bootstrap();