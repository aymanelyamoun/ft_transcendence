import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtGuard } from "../../Auth/auth_google/utils/jwt.guard";
import { AuthGoogleService } from "../../Auth/auth_google/auth_google.service";
import { AuthGoogleController } from "../../Auth/auth_google/auth_google.controller";
import { IntraStrategy } from "../../Auth/auth_google/utils/IntraStrategy";
import { GoogleStrategy } from "../../Auth/auth_google/utils/GoogleStrategy";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
import { RedisService } from "src/redis/redis.service";

@Module({
    providers: [ PrismaService,JwtService, UserService, GoogleStrategy,
        AuthGoogleService,
        PrismaService, 
        IntraStrategy, RedisService,
    UserService],

    controllers: [UserController, AuthGoogleController,
    ],
})

export class UserModule {}