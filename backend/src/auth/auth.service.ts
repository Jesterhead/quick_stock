import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(username: string, password: string) {
    // TODO: Add real authentication
    if (username === 'demo' && password === 'demo') {
      return { token: 'fake-jwt-token' };
    }
    throw new Error('Invalid credentials');
  }
}