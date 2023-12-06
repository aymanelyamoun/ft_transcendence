import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
import { UserService } from "../user/user.service";
import { AuthGoogleService } from "src/Auth/auth_google/auth_google.service";
import { RequestController } from "./request.controller";

@Module({
    providers: [PrismaService, JwtService, UserService,
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthGoogleService,
        }, 
    ],
    controllers: [RequestController],
})

export class RequestModule{}