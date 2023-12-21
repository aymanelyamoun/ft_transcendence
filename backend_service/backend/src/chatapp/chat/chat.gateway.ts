import { Inject, OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { messageDto, userDataDto } from './DTOs/dto';
import { ConnectedSocketInfo } from './types/connected_socket_info';
import { MessageInfo } from './types/message';
// import { PrismaChatService } from 'chatapp/server_chatapp/prisma/chat/prisma.chat.service';
// import { TmpUserService } from 'chatapp/server_chatapp/prisma/tmpUserAdd.service';
import { GatewayService } from './chat.gateway.service';
import { PrismaChatService } from '../prisma/chat/prisma.chat.service';
import { parse } from "cookie";
import { AuthGoogleService } from 'src/Auth/auth_google/auth_google.service';
import { JwtService } from '@nestjs/jwt';

// export class ChatGateway implements OnModuleInit{
  // @WebSocketGateway()
@WebSocketGateway({namespace: "api/chat",cors : {origin : "http://localhost:3000", credentials: true}})
export class ChatGateway implements OnModuleInit, OnGatewayConnection {

  constructor(private readonly prismaChat:PrismaChatService, private readonly gatewayService:GatewayService, private readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService) {}

  // socketHoler: Socket;

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      // const cookies = socket.handshake.headers.cookie;
    //   const cookies = parse(socket.handshake.headers.cookie);
    //   console.log("cookies: ", cookies['access_token']);
    //   try {
    //     const payload = this.jwtService.verify(cookies['access_token'], {
    //         secret : process.env.jwtSecretKey,
    //     });
    //     const user = this.authGoogleService.findUserByEmail(payload.email);
    //     console.log("--INFORMATIONS RECEIVED--- = " , user);
    //   }
    //   catch(error){
    //     socket.disconnect(true);
    //     console.log("error: ", error);
    //   }// console.log("socket: ", socket.handshake.headers.cookie);
    //   console.log('a socket has connected from chat gateway, Id: ', socket.id);
    // this.server.on('disconnect', (socket: Socket) => {
    //   console.log('a socket has disconnected from chat gateway, Id: ', socket.id);
    // }
    // );
    });
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    // console.log('chat server id = ', this.server)
    let cookies;
    // const cookies = socket.handshake.headers.cookie;
    if (typeof socket.handshake.headers.cookie === 'string') {
      const cookies = parse(socket.handshake.headers.cookie!);
      // rest of your code
    } else {
      console.log('No cookies present');
    }
    if (socket.handshake.headers.cookie) {
      cookies =  parse(socket.handshake.headers.cookie);
      try {
        const payload = await this.jwtService.verifyAsync(cookies['access_token'], {
            secret : process.env.jwtSecretKey,
        });
        const user = await this.authGoogleService.findUserByEmail(payload.email);
        console.log("payload: ", payload);
        console.log("--INFORMATIONS RECEIVED--- = " , user);
      }
      catch(error){
        socket.disconnect(true);
        console.log("error: ", error);
      }
    }
    // console.log("cookies: ", cookies['access_token']);
   // console.log("socket: ", socket.handshake.headers.cookie);
    console.log('a socket has connected from chat gateway, Id: ', socket.id);
  this.server.on('disconnect', (socket: Socket) => {
    console.log('a socket has disconnected from chat gateway, Id: ', socket.id);
  }
  );

    // console.log("a socket has connected from chat gateway, client: ", client.id);
  }

  @SubscribeMessage('userData')
  subscribeUserData(client: Socket, data: userDataDto) {
    console.log('got user data: ', data);
    const connectedSocket = this.gatewayService.addConnectedSocket({socket:client, userId:data.userId});
    // this.connectedSockets.add({socket: client, userId: data.userId})

    this.gatewayService.joinRooms(connectedSocket);
  }

  @SubscribeMessage('messageTo')
  async sendMessageTo(client: Socket, msg: messageDto) {

    // client.emit('privateMessage', msg.message, msg.conversationId);
    console.log("sending message: ", msg.conversationId);
    // this.server.emit("rcvMessage", msg.message);
    const newMessage = await this.prismaChat.addMessageToDM(msg);
    client.broadcast.to(msg.conversationId).emit("rcvMessage", newMessage);
    // check if there is aconversation between the two users
    // if not create a new conversation
    // next add messages to database 

    // const requestedSocket = this.getRequestedSocket(msg.);

    // console.log("sending message to", msg.messageTo);
    // requestedSocket.emit('onMessage', msg.message);
  }



}
