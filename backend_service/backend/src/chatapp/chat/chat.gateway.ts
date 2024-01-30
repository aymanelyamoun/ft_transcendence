import { UnauthorizedException } from '@nestjs/common';
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
  
@WebSocketGateway({namespace: "api/chat",cors : {origin : process.env.FRONT_URL, credentials: true}})
export class ChatGateway implements OnGatewayConnection {

  constructor(private readonly prismaChat:PrismaChatService, private readonly gatewayService:GatewayService, private readonly jwtService: JwtService,
     private readonly authGoogleService: AuthGoogleService, private userService: UserService,
    private gameService : GameService) {}

  async getUserData (client : Socket) : Promise<User> {
    if (client.handshake.headers.cookie === typeof undefined){
      console.log("AN EXEPTION HAS BEEN THROWN");
      throw new UnauthorizedException("You are not logged in");
    }
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
        
        // console.log("------- ADDING CONNECTED SOCKET TO MAP --------")
        this.gatewayService.addConnectedSocketToMap({socket:socket, userId:socket['user'].id});

        const connectedSocket = this.gatewayService.addConnectedSocket({socket:socket, userId:socket['user'].id});
        this.gatewayService.joinRooms(connectedSocket);

        // console.log("emmiting status userId", socket['user'].id);
        if (this.gameService.inGameCheckByID(socket['user'].id))
          this.server.emit('friendStatus', {userId: socket['user'].id, status: '2'});
        else
          this.server.emit('friendStatus', {userId: socket['user'].id, status: '1'});

        await this.emitFriendsStatus(socket['user'].id);
      }
      catch(error){
        socket.emit('redirect', '/', 'Your session has expired');
        // socket.disconnect(true);
      }
    }
    else 
    {
      // if (socket['user'] !== undefined){
      //   if (!this.gatewayService.userIsConnected(socket['user'].id))
      //     this.server.emit('friendStatus', {userId: socket['user'].id, status: '0'});
      // }
      // socket.disconnect(true);
    }
    }
    

    @SubscribeMessage("getFriendStatus")
    async getFriendStatus(client: Socket)
    {
      const user = await this.getUserData(client) as User;
      await this.emitFriendsStatus(user.id);
    }

  // })
  // ;}
  
  async emitFriendsStatus(userId:string){
    // console.log("emmiting status userId", userId);
    const friends = await this.userService.allFriend(userId);
    friends.forEach((friend)=>{
      if (this.gatewayService.userIsConnected(friend.id))
      {
        this.gameService.clearFinishedGames();
        const inGame = this.gameService.inGameCheckByID(friend.id);
        if (inGame){
          // console.log("______emmiting status userId is in game: ", userId);
          this.gatewayService.connectedSocketsMap.get(userId).forEach((socket)=>{
            socket.emit('friendStatus', {userId: friend.id, status: '2'});
          });
        }
        else{
          // console.log("emmiting status userId is logged: ", userId);
          this.gatewayService.connectedSocketsMap.get(userId).forEach((socket)=>{
            socket.emit('friendStatus', {userId: friend.id, status: '1'});
          });
        }
      }
      else{
        // console.log("emmiting status userId is not logged: ", userId);
        this.gatewayService.connectedSocketsMap.get(userId).forEach((socket)=>{
          socket.emit('friendStatus', {userId: friend.id, status: '0'});
        });
      }
    });

  }

  
  handleDisconnect(socket: Socket) {
    // console.log(socket['user'].id)
  if (socket['user'] === undefined || socket['user'] === null) // user has session but socket['user'] is undefined which means that socket['user'] doesnt exist in handlecdisconnect after innitializing it in handleconnection 
    return ;
  else if (socket['user'].username !== null && socket['user'].username !== undefined)
  {
    // console.log(socket['user'].username ,' is disconnecting');
    if (socket['inGame'] == true)
      this.gameService.stopGameEvent(socket)
    else if (socket['inQueue'] == true)
      this.gameService.removeFromQueueID(socket.id) // remove from queue if in queues
      // console.log("------- REMOVING CONNECTED SOCKET TO MAP --------")
    this.gatewayService.removeConnectedSocketFromMap({socket:socket, userId:socket['user'].id});
    if (this.gatewayService.userIsConnected(socket['user'].id)){

      if (this.gameService.inGameCheckByID(socket['user'].id))
        this.server.emit('friendStatus', {userId: socket['user'].id, status: '2'});
      else
      this.server.emit('friendStatus', {userId: socket['user'].id, status: '1'});
    }
    else
      this.server.emit('friendStatus', {userId: socket['user'].id, status: '0'});
    this.gameService.clearFinishedGames();
    if (this.gameService.inGameCheckByID(socket['user'].id))
      this.gameService.stopGameEvent(socket);
  }
}

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
      this.gameService.clearFinishedGames();
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

  // @SubscribeMessage('userData')
  // subscribeUserData(client: Socket, data: userDataDto) {
  //   console.log('got user data: ', data);
  // }

  @SubscribeMessage('messageTo')
  async sendMessageTo(client: Socket, msg: messageDto) {

    if (await this.prismaChat.userIsInConversation(client['user'].id, msg.conversationId)){
      if ((await this.prismaChat.userIsMutedFromConversation(client['user'].id , msg.conversationId)) === false)
      {
        if ((await this.prismaChat.isInBlock(client['user'].id, msg.conversationId)) === false){
          const newMessage = await this.prismaChat.addMessageToDM(msg);
          client.broadcast.to(msg.conversationId).emit("rcvMessage", newMessage);
        }
      }
    }
  }

  @SubscribeMessage('inviteGame')
  async inviteGame(sender: Socket, data: {id: string}) {
    // if (socket id already inviterd id then dont send invite)
    const user = await this.getUserData(sender) as User;
    sender["user"] = user;
    if (!this.gatewayService.userIsConnected(data.id)|| this.gatewayService.userInvitedBySocket(sender, data.id)
      || data.id === user.id)
      return ; // if the invited user is not connected or already invited by this socket then dont send invite
    setTimeout(()=>{
      this.gatewayService.removeInviteSocketFromMap(sender, data.id);
    }, 10000); 
    this.gatewayService.addInviteSocketToMap(sender, data.id);
    this.gatewayService.connectedSocketsMap.get(data.id).forEach((socket)=>{
      socket.emit('gameInvite', {id: user.id, username: user.username});
    });
  }

  @SubscribeMessage('acceptGameInvite')
  async acceptGameInvite(receiver: Socket, data: {senderId: string}) {
    // if user sent multiple requests to same user
    // loop map of inviteMAp if user.id is in it then delete it 
    const user = await this.getUserData(receiver) as User;
    if (this.gatewayService.userIsInvitedBy(user.id, data.senderId))
    {
      this.gatewayService.removeInviteSocketFromMap(receiver, data.senderId);
      const sender = this.gatewayService.getSocketByUserId(data.senderId);
      if (sender){
        if (this.gameService.inGameCheckByID(user.id) || this.gameService.inGameCheckByID(sender.id) ||
          !this.gatewayService.userIsConnected(data.senderId))
          return; 
        const matchID : string = sender['user'].username + 
            receiver['user'].username + Math.random().toString();
       sender.emit('gameInviteAccepted', {id: user.id, username: user.username});
       receiver.emit('gameInviteAccepted', {id: data.senderId, username: sender['user'].username});
        if (sender['user'] === undefined || sender['user'] === null || sender.connected === false)
          return ;
       sender.emit('redirect', '/game/match?matchID=' + matchID);
        receiver.emit('redirect', '/game/match?matchID=' + matchID);
      }
    }
  }



}
