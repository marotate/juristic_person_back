import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '54.151.169.51',
      port: 25432,
      username: 'trainee',
      password: 'trainee',
      database: 'juristic_person',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,

  ],
})
export class AppModule {}
