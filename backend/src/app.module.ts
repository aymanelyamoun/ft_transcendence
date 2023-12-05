import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
// import { ChatModule } from '../chatapp/server_chatapp/chat/chat.module';
// import { ChatGateway } from '../chatapp/server_chatapp/chat/chat.gateway';
// import { PrismaModule } from '../chatapp/server_chatapp/prisma/prisma.module';
// import { TmpUserService } from '../chatapp/server_chatapp/prisma/tmpUserAdd.service';
// import { PrismaService } from '../chatapp/server_chatapp/prisma/prisma.service';
// import { TmpUserController } from '../chatapp/server_chatapp/prisma/tmpUser.controller';
// import { PrismaChatService } from '../chatapp/server_chatapp/prisma/chat/prisma.chat.service';
import { AuthGoogleModule } from './Auth/auth_google/auth_google.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './profile/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chatapp/chat/chat.module';
import { PrismaModule } from './chatapp/prisma/prisma.module';
import { TmpUserController } from './chatapp/prisma/tmpUser.controller';
import { TmpUserService } from './chatapp/prisma/tmpUserAdd.service';
import { PrismaService } from './chatapp/prisma/prisma.service';
import { PrismaChatService } from './chatapp/prisma/chat/prisma.chat.service';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule, PrismaModule, AuthGoogleModule, PassportModule.register({session : true}), UserModule ],
  controllers: [TmpUserController],
  providers: [AppService, TmpUserService, PrismaService, PrismaChatService, JwtModule],
})
export class AppModule {}
