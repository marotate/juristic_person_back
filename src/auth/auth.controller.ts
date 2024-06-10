import { Body, Controller, HttpException, HttpStatus, Post ,Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('users')
  async getAllUsers(): Promise<User[]> {
    return await this.authService.findAllUsers(); // Call service method
  }
  
    @Get('hash')
    async hashPassword(): Promise<string> {
        const hashedPassword = await bcrypt.hash('salad', 10);
        console.log('Hashed Password:', hashedPassword);
        return hashedPassword;
    }

    /*@Post('login')
    async login(@Body() body: { username: string; password: string }) {
        try {
            const token = await this.authService.login(body.username, body.password);
            return { token };
        } catch (error) {
            // Handle unauthorized access
            throw new HttpException('Invalid username or password (controller)', HttpStatus.UNAUTHORIZED);
        }
    }*/

        @Post('login')
        async login(@Body() body: { username: string, password: string }): Promise<any> {
            console.log('Received request body:', body);
            const user = await this.authService.findByUsername(body.username);
            console.log('Found user2:', user);
    
            if (!user) {
                // Username not found
                console.log(body.username);
                return { statusCode: 401, message: 'Invalid username' };

            }
    
            // Compare the provided password with the hashed password stored in the database
            const isPasswordMatch = await this.authService.validatePassword(body.password, user.password);
    
            if (!isPasswordMatch) {
                // Passwords don't match
                return { statusCode: 401, message: 'Invalid password' };
            }
    
            // Authentication successful, return some user data or token
            return { statusCode: 200, message: 'Authentication successful', user };
        }

}
