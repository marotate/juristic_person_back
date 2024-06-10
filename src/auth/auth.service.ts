import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'; // Ensure that the entity name is capitalized
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Change variable name for consistency
    private jwtService: JwtService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) { // Compare hashed password correctly
      const { password: userPassword, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid username or password555');
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(username, password);
    const payload = { username: user.username, id: user.id, role: user.role };
    console.log('Executing query:', this.userRepository.createQueryBuilder('user').getQuery());
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    console.log('Searching for username:', username);
    const user = await this.userRepository.findOne({ where: { username } });
    console.log('Found user1:', user);
    console.log('userRepository:', this.userRepository)
    console.log('Retrieved users (structure):', user)
    console.log('Executing query:', this.userRepository.createQueryBuilder('user').getQuery());
    return user;
}
async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.userRepository.createQueryBuilder('user').getOne();
      return true;
    } catch (error) {
      console.error('Error connecting to database:', error);
      return false;
    }
  }
}
