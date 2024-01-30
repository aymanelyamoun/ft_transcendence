import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { AuthGoogleModule } from './Auth/auth_google/auth_google.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './profile/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatModule } from './chatapp/chat/chat.module';
import { PrismaModule } from './chatapp/prisma/prisma.module';
import { PrismaService } from './chatapp/prisma/prisma.service';
import { PrismaChatService } from './chatapp/prisma/chat/prisma.chat.service';
import { AuthGoogleService } from './Auth/auth_google/auth_google.service';
import { UserService } from './profile/user/user.service';
import { GameModule } from './Game/game.module';
import { GameService } from './Game/game.service';
import { RequestModule } from './profile/request/request.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule, PrismaModule, AuthGoogleModule, PassportModule.register({session : true}), UserModule, GameModule , RequestModule, RedisModule],
  controllers: [],
  providers: [AppService, PrismaService, PrismaChatService, UserService, JwtService, GameService, RedisService,
AuthGoogleService],
})
export class AppModule {}
