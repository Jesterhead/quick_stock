import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/auth/user.entity';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthSeeding {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async seed() {
    const existingUser = await this.userRepository.findOne({ 
      where: { username: 'brent_seems_nice' } 
    });

    if (!existingUser) {
        const hashedPassword = await AuthUtils.hashPassword('hope_this_thing_works');
    
    console.log('Hashed password:', hashedPassword);
        await this.userRepository.save({
          username: 'brent_seems_nice',
          password: hashedPassword
        });
        console.log('✨ Test user created: brent_seems_nice / hope_this_thing_works');
      }
  }
}