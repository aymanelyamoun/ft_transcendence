import { Body, Controller, Get, HttpStatus, Inject, Post, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from "./auth_google.service";
import { JwtGuard } from "./utils/jwt.guard";

import * as qrcode from 'qrcode';
import { use } from "passport";
import { UserService } from "../../profile/user/user.service";
import { CreateUserDto } from "../../profile/user/dto/user.dto";
import { LoginDto } from "../../profile/user/dto/auth.dto";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/redis/redis.service";
const speakeasy = require('speakeasy');



@Controller('auth')
export class AuthGoogleController
{
    constructor(
       private readonly authGoogleService: AuthGoogleService,
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private redisService: RedisService
    ){}
    
    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    handleLogin()
    {
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async handleRedirect(@Req() req: Request, @Res() res: Response)
    {
      try {
        (req.user as any).isConfirmed2Fa = false;
        const jwtResult = await this.authGoogleService.generateJwt(req.user);
        res.cookie('access_token', jwtResult.backendTokens.accessToken, {
          httpOnly: false,
          expires: new Date(Date.now() + 86400000), // 24 hours in milliseconds
        });
        
        const user = await this.userService.findByEmail(jwtResult.backendTokens.payload.email);
        if (user.isTwoFactorEnabled)
          return res.redirect(process.env.FRONT_URL+'/confirmauth')
        else if (user.hash != '') {
          return res.redirect(process.env.FRONT_URL+'/profile')
        }
        return res.redirect(process.env.FRONT_URL+'/confirm')
      }
      catch (error)
      {
        throw new UnauthorizedException();
      }
    }
    
    @Get('42/login')
    @UseGuards(AuthGuard('42'))
    handleLogin42()
    {
    }
    
    @Get('google/redirect42')
    @UseGuards(AuthGuard('42'))
    async handleRedirect42(@Req() req: Request, @Res() res: Response)
    {
      try
      {
        (req.user as any).isConfirmed2Fa = false;
        const jwtResult = await this.authGoogleService.generateJwt(req.user);
        res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly : false, expires: new Date(Date.now() + 86400000), });
        const user = await this.userService.findByEmail(jwtResult.backendTokens.payload.email);
        if (user.isTwoFactorEnabled)
          return res.redirect(process.env.FRONT_URL+'/confirmauth')
        else if (user.hash != '') {
          return res.redirect(process.env.FRONT_URL+'/profile')
        }
        return res.redirect(process.env.FRONT_URL+'/confirm')
      }
      catch (error)
      {
        throw new UnauthorizedException();
      }
  }


@Get('check')
@UseGuards(JwtGuard)
async check(@Req() req: Request, @Res() res: Response)
{
  try {
    const isConfirmed2Fa =  req['isConfirmed2Fa'] 
    const user = req['user'] as User;
    (user as any).isConfirmed2Fa = isConfirmed2Fa;
    if (!user) {
      throw new UnauthorizedException();
    }
    res.status(200).send(user);
  } catch (error)
  {
    throw new UnauthorizedException();
  }
}

@Get('checkAuth')
@UseGuards(JwtGuard)
async check_auth(@Req() req: Request, @Res() res: Response)
{
  try {
    const isConfirmed2Fa =  req['isConfirmed2Fa'] 
    const user = req['user'] as User;
    (user as any).isConfirmed2Fa = isConfirmed2Fa;
    if (!user) {
      throw new UnauthorizedException();
    }
    res.status(200).send(user);
  } catch (error)
  {
    throw new UnauthorizedException();
  }
}

@Get('2FA/generate')
@UseGuards(JwtGuard)
async generateTwoFactorAuth(@Req() req: Request, @Res() res: Response) {
  
    const user = req['user'] as User;
    var secret : string;
    if (user.TwoFactSecret)
      secret = user.TwoFactSecret
    else
      secret = this.authGoogleService.generateTwoFactorAuthenticationSecret(user.username);
      const Url = speakeasy.otpauthURL({
      label: 'Ft_Transcendence',
      secret: secret,
    });
    try
    {
      const qrCode = await qrcode.toDataURL(Url);
      await this.userService.updateUser(user.id, { TwoFactSecret: secret });
      return res.status(200).json(qrCode);
    }
    catch (error)
    {
      throw new UnauthorizedException();
    }
  }
  
  @Post('2FA/enable')
  @UseGuards(JwtGuard)
  async enableTwoFactorAuth(@Req() req, @Body() body, @Res() res)
  {
    const user = req['user'] as User;
    const { token } = body;
    if  (user.isTwoFactorEnabled)
      return res.status(401).json({message : 'Two-factor is already enabled'});
    const isValidToken = this.authGoogleService.validateTwoFactorAuthenticationToken(
      token,
      user.TwoFactSecret,
      );
      if (!isValidToken) {
        return res.status(401).json({message : 'Two-factor authentication code is incorrect!'});
      }
      try
      {
        user.isTwoFactorEnabled = true;
        await this.userService.updateUser(user.id, { isTwoFactorEnabled: true });
        (user as any).isConfirmed2Fa = true;
        const accessToken = await this.jwtService.signAsync(user, {
          expiresIn: '1d',
          secret: process.env.jwtSecretKey,
        });
        res.cookie('access_token', accessToken, { httpOnly : false, expires: new Date(Date.now() + 86400000), });
        return res.status(200).json('2FA enabled successfully');
      }
      catch (error)
      {
        await this.userService.updateUser(user.id, { isTwoFactorEnabled: false });
        throw new UnauthorizedException();
    }
  }
  
  @Post('2FA/disable')
  @UseGuards(JwtGuard)
  async disableTwoFactorAuth(@Req() req, @Body() body, @Res() res)
  {
    const user = req['user'] as User;
    try
    {
      await this.userService.updateUser(user.id, { isTwoFactorEnabled: false, TwoFactSecret: null });
      (user as any).isConfirmed2Fa = false;
      const accessToken = await this.jwtService.signAsync(user, {
        expiresIn: '1d',
        secret: process.env.jwtSecretKey,
      });
      res.cookie('access_token', accessToken, { httpOnly: false, expires: new Date(Date.now() + 86400000), });
      return res.status(200).json({message : '2FA disabled successfully'});
    }
    catch (error)
    {
      throw new UnauthorizedException();
    }
  }
  
  @Post('2FA/validate')
  @UseGuards(JwtGuard)
  async validateTwoFactorAuth(@Req() req, @Body() body, @Res() res)
  {
    try
    {
      const user = req['user'] as User;
      if (!user.isTwoFactorEnabled) {
        return res.status(400).json('2FA is not enabled for this user!');
      }
      const { token } = body;
      const isValidToken = this.authGoogleService.validateTwoFactorAuthenticationToken(
        token,
        user.TwoFactSecret
        );
        if (!isValidToken) {
          return res.status(401).json('Invalid 2FA token');
        }
        (user as any).isConfirmed2Fa = true;
        const accessToken = await this.jwtService.signAsync(user, {
          expiresIn: '1d',
          secret: process.env.jwtSecretKey,
      });
      res.cookie('access_token', accessToken, { httpOnly : false, expires: new Date(Date.now() + 86400000), });
       return res.status(200).json('User validate');
    }
    catch(error)
    {
      throw new UnauthorizedException();
    }
  }

  @Post('register')
  async registerUser(@Body() dto:CreateUserDto, @Res() res: Response)
  {
      const data = await this.userService.create(dto);
      return res.status(200).send(data);
  }
      
  @Post('login')
  async login(@Body() dto:LoginDto,@Req() req: Request, @Res() res: Response)
  {

      const data = await this.authGoogleService.login(dto);
      res.cookie('access_token', data.backendTokens.backendTokens.accessToken, { httpOnly : false, expires: new Date(Date.now() + 86400000), });
      return res.status(200).send(data.user);
  }
        
  @Get('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: Request, @Res() res: Response)
  {
    try {
      const jwt_payload = req['jwt_payload'];
      const token = req['Token'];
      await this.redisService.addTokenBlackList(`blacklist:${token}`, token, jwt_payload.exp - jwt_payload.iat)
      res.clearCookie('access_token');
      return res.redirect(process.env.FRONT_URL)
    }catch(error)
    {
      throw new UnauthorizedException();
    }
  }
}