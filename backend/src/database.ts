import { DataSource } from 'typeorm';
import { User } from './entities/auth/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});