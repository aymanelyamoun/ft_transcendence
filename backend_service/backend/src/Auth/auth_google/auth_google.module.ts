import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth_google.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthGoogleService } from './auth_google.service';
import { JwtService } from '@nestjs/jwt';
import { IntraStrategy } from './utils/IntraStrategy';
import { UserService } from '../../profile/user/user.service';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';




//Middleware Usage:
//when a request is made to a route protected by the GoogleStrategy (e.g., AuthGoogleController),
// Nest.js middleware, provided by Passport.js, intercepts the request.
@Module({
    controllers: [AuthGoogleController],
    providers: [GoogleStrategy,
            {
                provide: 'AUTH_SERVICE',
                useClass: AuthGoogleService,
            } ,PrismaService, 
            JwtService,
            IntraStrategy,
        UserService, RedisService  ],
})
export class AuthGoogleModule {}
