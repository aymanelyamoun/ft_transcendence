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
import { User } from '@prisma/client';
import { GameService } from 'src/Game/game.service';
import { UserService } from 'src/profile/user/user.service';

// export class ChatGateway implements OnModuleInit{
  // @WebSocketGateway()
  
@WebSocketGateway({namespace: "api/chat",cors : {origin : "http://localhost:3000", credentials: true}})
export class ChatGateway implements OnGatewayConnection {

  constructor(private readonly prismaChat:PrismaChatService, private readonly gatewayService:GatewayService, private readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService, private userService: UserService,
    private gameService : GameService) {}

  async getUserData (client : Socket) : Promise<User> {
    const cookies =  parse(client.handshake.headers.cookie);
    const payload = await this.jwtService.verifyAsync(cookies['access_token'], {
      secret : process.env.jwtSecretKey,
    });
    const user = await this.authGoogleService.findUserByEmail(payload.email);
    return user as User;
  } 
  @WebSocketServer()
  server: Server;
  async handleConnection(socket: Socket, ...args: any[]) {
    if (socket.handshake.headers.cookie !== typeof undefined) {
      try {
        socket["user"] = await this.getUserData(socket) as User;
        socket["inGame"] = false;
        socket["inQueue"] = false;
        socket["inChat"] = false;

        this.gatewayService.addConnectedSocketToMap({socket:socket, userId:socket['user'].id});
        console.log("emmiting status userId", socket['user'].id);
        this.server.emit('friendStatus', {userId: socket['user'].id, status: '1'});
        // this.gatewayService.addConnectedSocketToMap({socket:socket, userId:user.id});
        // console.log("emmiting status userId", user.id);
        // this.server.emit('friendStatus', {userId: user.id, status: '1'});
        // this.emitFriendsStatus(user.id);
      }
      catch(error){
        socket.emit('redirect', '/', 'Your session has expired');
        socket.disconnect(true);
      }
    }
    else 
    {
      if (socket['user'] !== undefined){
        if (!this.gatewayService.userIsConnected(socket['user'].id))
          this.server.emit('friendStatus', {userId: socket['user'].id, status: '0'});
      }
      socket.disconnect(true);
    }
    ;}
    
  // })
  // ;}
  
  async emitFriendsStatus(userId:string){
    const friends = await this.userService.allFriend(userId);
    friends.forEach((friend)=>{
      if (this.gatewayService.userIsConnected(friend.id))
      {
        const inGame = this.gameService.inGameCheckByID(friend.id);
        if (inGame){
          this.gatewayService.connectedSocketsMap.get(friend.id).forEach((socket)=>{
            socket.emit('friendStatus', {userId: userId, status: '2'});
          });
        }
        else{
          this.gatewayService.connectedSocketsMap.get(friend.id).forEach((socket)=>{
            socket.emit('friendStatus', {userId: userId, status: '1'});
          });
        }
      }
      else{
        this.gatewayService.connectedSocketsMap.get(friend.id).forEach((socket)=>{
          socket.emit('friendStatus', {userId: userId, status: '0'});
        });
      }
    });

  }

  
  handleDisconnect(socket: Socket) {
  if (socket['user'] === undefined || socket['user'] === null) // user has session but socket['user'] is undefined which means that socket['user'] doesnt exist in handlecdisconnect after innitializing it in handleconnection 
  {
    console.log("3ayt l ossama", socket.id);
    return ;
  }
  else if (socket['user'].username !== null && socket['user'].username !== undefined)
  {
    console.log(socket['user'].username ,' is disconnecting');
    if (socket['inGame'] == true)
    {
      console.log("user is still in game: ", socket['user'].username);
      this.gameService.stopGameEvent(socket)
    }
    else if (socket['inQueue'] == true)
    {
      this.gameService.removeFromQueue(socket) // remove from queue if in queues
      console.log("user disconnected: ", (socket['user'] ? socket['user'].username : socket.id));
    }
    // else{
        this.gatewayService.removeConnectedSocketFromMap({socket:socket, userId:socket['user'].id});
        if (this.gatewayService.userIsConnected(socket['user'].id)){

          if (this.gameService.inGameCheckByID(socket['user'].id))
            this.server.emit('friendStatus', {userId: socket['user'].id, status: '2'});
          else
          this.server.emit('friendStatus', {userId: socket['user'].id, status: '1'});
        }
        else
          this.server.emit('friendStatus', {userId: socket['user'].id, status: '0'});
    // }

  }
}

  // handleDisconnect(socket: Socket) {
  //   if (socket['user'] !== undefined)
  //   {
      

  //   }
  //   else
  //     console.log("user is now disconnected(need to emit): ", socket.id);
  //     socket.emit('redirect', '/', 'You are not logged in');
  // }
  
  @SubscribeMessage('joinMatch')
  async joinMatch(client: Socket, matchID: string) {
    
    client["user"] = await this.getUserData(client) as User;
    client['inGame'] = true;
    this.gameService.clearFinishedGames();
    const inGame = this.gameService.inGameCheck(client);
    if (inGame)
      return ;
    if (client['user'] === undefined || client['user'] === null)
      client.emit('redirect', '/', 'You are not logged in from line 84');
    if (matchID && client['user'] && client['user'].username)
      this.gameService.GameEvent(this.server, client,matchID);
  }


  @SubscribeMessage('matchmaking')
  async matchmaking(client: Socket) {
    client["user"] = await this.getUserData(client) as User;
    client['inQueue'] = true;
    client.on('CancelQueue', () => {
      this.gameService.removeFromQueue(client);
      client.disconnect(true);
      return ;
    });
    this.gameService.clearFinishedGames();
    if (this.gameService.inGameCheck(client))
    {
        client.emit('CancelQueue')
        client.disconnect(true);
        return ;
    }
    if (client['user'] === undefined || client['user'] === null)
    {
      client.emit('redirect', '/', 'You are not logged in from line 107');
      return ;
    }
    this.gameService.MatchMaking(this.server, client);
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
