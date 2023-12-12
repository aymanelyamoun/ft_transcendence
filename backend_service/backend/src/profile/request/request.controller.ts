import { Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { get } from "http";
import { JwtGuard } from "src/Auth/auth_google/utils/jwt.guard";
import { RequestService } from "./request.service";
import { th } from "@faker-js/faker";
import { NOTIF_TYPE, User } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import { user } from "src/chatapp/chat/types/user";




@Controller('request')
export class RequestController {
    constructor(private readonly requestService : RequestService) { }
    
    //http://localhost:3001/api/request/send/:senderId
    @Post('send/:recieverId')
    @UseGuards(JwtGuard)
    async sendRequest(@Req() req: Request, @Param('recieverId') recieverid: string)
    {
      console.log('heeeere');
      const user = req['user'] as User
      return  this.requestService.handleSendRequest(user.id, recieverid, "login sent you friend request", NOTIF_TYPE.friendReq);
    }


    //http://localhost:3001/api/request/accept/:notificationid
    @Post('accept/:notificationid')
    @UseGuards(JwtGuard)
    async acceptRequest(@Req() req: Request, @Res() res: Response, @Param('notificationid') notificationId: number)
    {
      const result = this.requestService.handleAcceptRequest(req, notificationId);
      return res.status(200).send(result);
    }


    //http://localhost:3001/api/request/Refuse/:notificationid
    @Post('Refuse/:notificationid')
    @UseGuards(JwtGuard)
    async refuse(@Param('notificationid') notificationId: number)
    {
       return this.requestService.handleRefuseRequest(notificationId)
    }
}