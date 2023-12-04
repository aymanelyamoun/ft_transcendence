import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtGuard } from "src/auth_google/utils/jwt.guard";
import { AuthGoogleService } from "src/auth_google/auth_google.service";
import { AuthGoogleController } from "src/auth_google/auth_google.controller";
import { IntraStrategy } from "src/auth_google/utils/IntraStrategy";
import { GoogleStrategy } from "src/auth_google/utils/GoogleStrategy";

@Module({
    providers: [ PrismaService,JwtService, UserService, GoogleStrategy,
        // SessionSerializer, AuthGoogleService, 
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthGoogleService,
        } ,PrismaService, 
      //  JwtService,
        IntraStrategy,
    UserService],

    controllers: [UserController, AuthGoogleController,
    ],
})

export class UserModule {}