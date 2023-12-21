import { Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
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
    
    @Post('send/:recieverId')
    @UseGuards(JwtGuard)
    async sendRequest(@Req() req: Request, @Param('recieverId') recieverid: string,  @Res() res: Response)
    {
      // console.log(recieverid);
      const user = req['user'] as User
      const Notif = await this.requestService.handleSendRequest(user.id, recieverid, "login sent you friend request", NOTIF_TYPE.friendReq);
      return res.status(200).send(Notif);
    }


    @Post('accept/:notificationid')
    @UseGuards(JwtGuard)
    async acceptRequest(@Req() req: Request, @Res() res: Response, @Param('notificationid') notificationId: number)
    {
      const result = await this.requestService.handleAcceptRequest(req, notificationId);

      if (result === undefined)
        return res.status(200).send([]);

      return res.status(200).send(result);
    }


    @Post('refuse/:notificationid')
    @UseGuards(JwtGuard)
    async refuse(@Param('notificationid') notificationId: number, @Res() res: Response)
    {
       const result = await this.requestService.handleRefuseRequest(notificationId);

      if (result === undefined)
          return res.status(200).send([]);
  
       return res.status(200).send(result);
    }

    @Delete('block/:userIdB')
    @UseGuards(JwtGuard)
    async blockUser(@Req() req: Request, @Param('userIdB') userIdB: string,  @Res() res: Response)
    {
      const user = req['user'] as User
      const result = await this.requestService.BlockUser(user.id, userIdB);
      return res.status(200).send(result);
    }


    @Post('deblock/:userIdB')
    @UseGuards(JwtGuard)
    async deblockUser(@Req() req: Request, @Param('userIdB') userIdB: string,  @Res() res: Response)
    {
      const user = req['user'] as User
      const result = await this.requestService.DeBlockUser(user.id, userIdB);
      return res.status(200).send(result);
    }


    @Get('blockList')
    @UseGuards(JwtGuard)
    async blockList(@Req() req: Request, @Res() res: Response)
    {
      const user = req['user'] as User
      const list = await this.requestService.BlockList(user.id)
      // console.log(list);
      return res.status(200).send(list);
    }
}