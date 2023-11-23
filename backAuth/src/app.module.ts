import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGoogleModule } from './auth_google/auth_google.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthGoogleModule, 
    ConfigModule.forRoot(),
    PassportModule.register({session : true}),
    // TypeOrmModule.forRoot({ 
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432, 
    //   username: 'postgres',
    //   password: 'pass123',
    //   database: 'postgres', 
    //   autoLoadEntities: true,
    //   //for load the etities that we have
    //   synchronize: true,
    //   /// when we the app run for sync the app with database just for deb env 
    // }),  
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtModule],
})
export class AppModule {}
