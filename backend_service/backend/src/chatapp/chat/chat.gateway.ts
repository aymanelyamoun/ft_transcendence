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
import { fa } from '@faker-js/faker';

// export class ChatGateway implements OnModuleInit{
  // @WebSocketGateway()
  
@WebSocketGateway({namespace: "api/chat",cors : {origin : process.env.FRONT_URL, credentials: true}})
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
        
        console.log("------- ADDING CONNECTED SOCKET TO MAP --------")
        this.gatewayService.addConnectedSocketToMap({socket:socket, userId:socket['user'].id});

        const connectedSocket = this.gatewayService.addConnectedSocket({socket:socket, userId:socket['user'].id});
        this.gatewayService.joinRooms(connectedSocket);

        // console.log("emmiting status userId", socket['user'].id);
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
          console.log("emmiting status userId is in game: ", userId);
          this.gatewayService.connectedSocketsMap.get(userId).forEach((socket)=>{
            socket.emit('friendStatus', {userId: friend.id, status: '2'});
          });
        }
        else{
          console.log("emmiting status userId is logged: ", userId);
          this.gatewayService.connectedSocketsMap.get(userId).forEach((socket)=>{
            socket.emit('friendStatus', {userId: friend.id, status: '1'});
          });
        }
      }
      else{
        console.log("emmiting status userId is not logged: ", userId);
        this.gatewayService.connectedSocketsMap.get(userId).forEach((socket)=>{
          socket.emit('friendStatus', {userId: friend.id, status: '0'});
        });
      }
    });

  }

  
  handleDisconnect(socket: Socket) {
    // console.log(socket['user'].id)
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
      this.gameService.removeFromQueueID(socket.id) // remove from queue if in queues
      console.log("user disconnected: ", (socket['user'] ? socket['user'].username : socket.id));
    }
    // else{
      console.log("------- REMOVING CONNECTED SOCKET TO MAP --------")
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
      console.log('Got event CancelQueue from client: ', client['user'].username)
      this.gameService.removeFromQueue(client);
      this.gameService.clearFinishedGames();
      client.disconnect(true);
      return ;
    });
    this.gameService.clearFinishedGames();
    if (this.gameService.inGameCheck(client))
    {
        console.log("canceling queue cause user is still in game: ", client['user'].username);
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
      if (await this.prismaChat.userIsMutedFromConversation(client['user'].id , msg.conversationId) === false)
      {
        console.log("from inside, uSER IS MUted:", await this.prismaChat.userIsMutedFromConversation(client['user'].id , msg.conversationId))
          const newMessage = await this.prismaChat.addMessageToDM(msg);
          client.broadcast.to(msg.conversationId).emit("rcvMessage", newMessage);
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
      console.log("removing invite socket from map after 10sec.")
      this.gatewayService.removeInviteSocketFromMap(sender, data.id);
    }, 10000); 
    this.gatewayService.addInviteSocketToMap(sender, data.id);
    console.log("sending invite to: ", data.id)
    // loop throught connected socket map and find the socket with id = data.id

    // could be changed to only send on room of the user
    this.gatewayService.connectedSocketsMap.get(data.id).forEach((socket)=>{
      socket.emit('gameInvite', {id: user.id, username: user.username});
    });
    
    // protect user is friend and inviting him to game
    
  }

  @SubscribeMessage('acceptGameInvite')
  async acceptGameInvite(receiver: Socket, data: {senderId: string}) {
    // if user sent multiple requests to same user
    // loop map of inviteMAp if user.id is in it then delete it 
    const user = await this.getUserData(receiver) as User;
    if (this.gatewayService.userIsInvitedBy(user.id, data.senderId))
    {
      this.gatewayService.removeInviteSocketFromMap(receiver, data.senderId);
      console.log('GAME INVITE ACCEPTED BETWEEN ', user.id, ' and ', data.senderId);
      const sender = this.gatewayService.getSocketByUserId(data.senderId);
      if (sender){
        if (this.gameService.inGameCheckByID(user.id) || this.gameService.inGameCheckByID(sender.id))
          return; 
        const matchID : string = sender['user'].username + 
            receiver['user'].username + Math.random().toString();
       sender.emit('gameInviteAccepted', {id: user.id, username: user.username});
       receiver.emit('gameInviteAccepted', {id: data.senderId, username: sender['user'].username});
       sender.emit('redirect', '/game/match?matchID=' + matchID);
        receiver.emit('redirect', '/game/match?matchID=' + matchID);
      }
    }
    else
      console.log('Sir akhoya lay sma7lk');
  }



}
