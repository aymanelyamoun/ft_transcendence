import { Body, Controller, Delete, Get, Inject, Param, Patch, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../Auth/auth_google/utils/jwt.guard";
import { UserService } from "./user.service";
import { ConfirmUserDto } from "./dto/confirm.dto";
import { AuthGoogleService } from "../../Auth/auth_google/auth_google.service";
import { asyncScheduler } from "rxjs";
import { profile } from "console";
import { Request, Response, NextFunction } from 'express';
import { User } from "@prisma/client";

@Controller('user')
export class UserController {
    constructor(private userService: UserService,
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
    ) { }

  @Patch('confirm')
  @UseGuards(JwtGuard)
  async confirm(@Req() req: Request, @Res() res: Response, @Body() dto: ConfirmUserDto) {
    try {
      const user = req['user'] as User;
      if (!user) {
        throw new UnauthorizedException();
      }
      const confirm = await this.userService.confirm(user.email, dto);
      res.status(200).json({ message: 'User confirmed successfully', result: confirm });
    } catch (error) {
      res.status(500).json({ message: 'Error finding user' });
    }
  }
    
  @Get('profile')
  @UseGuards(JwtGuard)
  async check(@Req() req: Request, @Res() res: Response)
  {
    console.log("heeeeeeere");
    try {
      const user = await this.authGoogleService.check_token(req);
      console.log("user   ==>", user);
      if (!user) {
        throw new UnauthorizedException();
      }
      res.status(200).send(user);
    } catch (error)
    {
          res.status(500).json({ message: 'Error finding user' });
    }
  }


  @Get('all')
  @UseGuards(JwtGuard)
  async all(@Req() req: Request, @Res() res: Response)
  {
    console.log("heeeeeeere");
    const users = await this.userService.allUsers();
    res.status(200).send(users);
    // return users
  }
  
  @Get('friends')
  @UseGuards(JwtGuard)
  async allfriend(@Req() req: Request, @Res() res: Response)
  {
    const user = req['user'] as User;
    const friends = await this.userService.allFriend(user.id);
    res.status(200).send(friends);
  }


  @Delete('remove/:friendid')
  @UseGuards(JwtGuard)
  async Removefriend(@Param('friendid') friendid, @Req() req: Request, @Res() res: Response)
  {
    const user = req['user'] as User;
    const result = await this.userService.removeFriend(user.id, friendid)
    res.status(200).send(result);
  }


  @Get('search/:username')
  @UseGuards(JwtGuard)
  async SearchUser(@Param('username') username, @Res() res: Response, @Req() req: Request)
  {
    const users = await this.userService.Searchuser(username, req);
    res.status(200).send(users);
  }
}
