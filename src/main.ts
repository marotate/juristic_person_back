import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000/login', // Replace with your Next.js origin
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  const authService = app.get(AuthService); // Get an instance of AuthService
  const isConnected = await authService.testConnection();

  if (isConnected) {
    console.log('Database connection successful!');
  } else {
    console.error('Error connecting to database!');
    process.exit(1); // Exit the application with an error code if connection fails
  }
  
  await app.listen(3001);
}
bootstrap();
