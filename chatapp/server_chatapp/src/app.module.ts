import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { TmpUserService } from './prisma/tmpUserAdd.service';
import { PrismaService } from './prisma/prisma.service';
import { TmpUserController } from './prisma/tmpUser.controller';
import { PrismaChatService } from './prisma/chat/prisma.chat.service';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule, PrismaModule],
  controllers: [TmpUserController],
  providers: [AppService, TmpUserService, PrismaService, PrismaChatService],
})
export class AppModule {}
