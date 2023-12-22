import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
// import { PrismaChatService } from 'chatapp/server_chatapp/prisma/chat/prisma.chat.service';
// import { PrismaModule } from 'chatapp/server_chatapp/prisma/prisma.module';
import { ChannelController } from './chat.channel.controller';
import { GatewayService } from './chat.gateway.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaChatService } from '../prisma/chat/prisma.chat.service';
import { AuthGoogleService } from 'src/Auth/auth_google/auth_google.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/profile/user/user.service';
import { GameService } from 'src/Game/game.service';

@Module({
  imports:[PrismaModule],
  controllers:[ChannelController],
  providers: [ChatGateway,PrismaService,UserService, PrismaChatService, GatewayService, JwtService, GameService,  {
    provide: 'AUTH_SERVICE',
    useClass: AuthGoogleService,
  }]
})

export class ChatModule {}
