import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGoogleService } from 'src/Auth/auth_google/auth_google.service';

@WebSocketGateway({cors : {origin : "http://localhost:3000", credentials: true}})
export class GameGateway implements  OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly gameService: GameService,private readonly jwtService: JwtService,
      @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService)  {}
  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.auth.token;
    try
    {
        const payload = await this.jwtService.verifyAsync(token, {
            secret : process.env.jwtSecretKey,
        });
        const user = await this.authGoogleService.findUserByEmail(payload.email);
        // console.log("--INFORMATIONS RECEIVED--- = " , user);
    }
    catch (error) {
      // console.log("This client has no token: " , client.id);
      //  client.disconnect(true);
    }
  }
  handleDisconnect(client: any) {
    // console.log("client disconnected : " , client.id);
  }
  // handle server down
  
}

