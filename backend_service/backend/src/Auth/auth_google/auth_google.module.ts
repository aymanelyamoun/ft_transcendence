import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth_google.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthGoogleService } from './auth_google.service';
import { JwtService } from '@nestjs/jwt';
import { IntraStrategy } from './utils/IntraStrategy';
import { UserService } from '../../profile/user/user.service';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
    controllers: [AuthGoogleController],
    providers: [GoogleStrategy,

                 AuthGoogleService,
            PrismaService, 
            JwtService,
            IntraStrategy,
        UserService, RedisService  ],
})
export class AuthGoogleModule {}
