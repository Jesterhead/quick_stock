import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
});