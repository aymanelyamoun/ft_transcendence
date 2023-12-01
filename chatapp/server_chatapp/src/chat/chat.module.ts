import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PrismaChatService } from 'src/prisma/chat/prisma.chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChannelController } from './chat.channel.controller';
import { GatewayService } from './chat.gateway.service';

@Module({
  imports:[PrismaModule],
  controllers:[ChannelController],
  providers: [ChatGateway, PrismaChatService, GatewayService]
})
export class ChatModule {}
