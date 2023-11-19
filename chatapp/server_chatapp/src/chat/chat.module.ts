import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PrismaChatService } from 'src/prisma/chat/prisma.chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [ChatGateway, PrismaChatService]
})
export class ChatModule {}
