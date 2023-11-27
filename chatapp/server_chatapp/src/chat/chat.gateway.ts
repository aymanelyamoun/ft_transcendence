import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { messageDto, userDataDto } from './DTOs/dto';
import { ConnectedSocketInfo } from './types/connected_socket_info';
import { Message } from './types/message';
import { PrismaChatService } from 'src/prisma/chat/prisma.chat.service';
import { TmpUserService } from 'src/prisma/tmpUserAdd.service';
import { Messages, Prisma } from '@prisma/client';



@WebSocketGateway()
export class ChatGateway implements OnModuleInit{

  constructor(private readonly prismaChat:PrismaChatService, private readonly tmpUserAddService:TmpUserService) {}

  connectedSockets = new Set<ConnectedSocketInfo>();
  // socketHoler: Socket;

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log('connected', socket.id);
    })
  }

  @SubscribeMessage('userData')
  subscribeUserData(client: Socket, data: userDataDto) {
    console.log(data);
    this.connectedSockets.add({socket: client, userId: data.userId})
  }

  @SubscribeMessage('messageTo')
  async sendMessageTo(client: Socket, msg: messageDto) {
    
    // check if there is aconversation between the two users
    // if not create a new conversation
    // next add messages to database 

    const requestedSocket = this.getRequestedSocket(msg.messageTo);
    const user1 = await this.tmpUserAddService.getTmpUser({where: {id: msg.messageFrom}});
    const user2 = await this.tmpUserAddService.getTmpUser({where: {id:msg.messageTo}});

    console.log(user2);

    const DM = await this.prismaChat.createNewDM(msg.messageFrom, {
      sender:user1.id, receiver:user2.id, 
      usersMessages: {
        create: [
          { user: { connect: { id: user1.id } } },
          { user: { connect: { id: user2.id } } }
        ]
      }
    })

    await this.prismaChat.addMessageToDM({messageSenderId:user1.id, messageRecieverId:user2.id, message:msg.message, DmMessage:{connect:DM}});
    // this.prismaChat.createNewDM(msg.messageFrom, {toUserId:msg.messageTo});
    console.log("sending message to", msg.messageTo);
    requestedSocket.emit('onMessage', msg.message);
  }

  private getRequestedSocket(userId: string) {
    for (const element of this.connectedSockets) {
      if (element.userId === userId) {
        return element.socket;
      }
    }
  }
}
