import { Body, Controller, Get, HttpStatus, Inject, Post, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { GoogleAuthGuard } from "./utils/Guards";
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from "./auth_google.service";
import { JwtGuard } from "./utils/jwt.guard";
import { IntraAuthGuard } from "./utils/IntraGuard";

import * as qrcode from 'qrcode';
import { use } from "passport";
import { UserService } from "../../profile/user/user.service";
import { CreateUserDto } from "../../profile/user/dto/user.dto";
import { LoginDto } from "../../profile/user/dto/auth.dto";
import { User } from "@prisma/client";
const speakeasy = require('speakeasy');



@Controller('auth')
export class AuthGoogleController
{
    //npm i @nestjs/passport passport passport-google-oauth20
    // @nestjs/passport provides decorators and utilities to simplify the integration of Passport.js with Nest.js and it's a module
    //This is the core Passport.js library. Passport is a middleware that simplifies the process of implementing authentication in a Node.js application.
    // It supports various authentication strategies, such as local username/password, OAuth, and others.
    //passport-google-oauth20: This is a Passport.js strategy for authenticating with Google using the OAuth 2.0 protocol. 
    //It allows you to enable Google as an authentication provider in your application,
    //letting users log in with their Google credentials.
    //npm i -D @types/passport-google-oauth20
    // it provides TypeScript type definitions for the passport-google-oauth20 package.
    // TypeScript type definitions are used to provide static type information about the structure of the JavaScript code in a package, 
    //enabling better development tools support, such as autocompletion and type checking.
    constructor(
      @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
      private readonly userService: UserService
    ){}
    @Get('google/login')
     @UseGuards(GoogleAuthGuard)
    handleLogin()
    {
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleRedirect(@Req() req: Request, @Res() res: Response)
    {
      const jwtResult = await this.authGoogleService.generateJwt(req.user);
      res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly: false });
      res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly: false });
      const user = await this.userService.findByEmail(jwtResult.backendTokens.payload.email);
      if (user.hash != '') {
        return res.redirect('http://localhost:3000/profile/dashboard')
      }
      return res.redirect('http://localhost:3000/confirm')
    }
    
    @Get('42/login')
    @UseGuards(IntraAuthGuard)
    handleLogin42()
    {
      
      return {msg: "42 Login"}
    }
    
        @Get('google/redirect42')
        @UseGuards(IntraAuthGuard)
        async handleRedirect42(@Req() req: Request, @Res() res: Response)
        {
          const jwtResult = await this.authGoogleService.generateJwt(req.user);
          res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly: false });
          res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly: false });
               const user = await this.userService.findByEmail(jwtResult.backendTokens.payload.email);
          if (user.hash != '') {
            return res.redirect('http://localhost:3000/profile/dashboard')
          }
          return res.redirect('http://localhost:3000/confirm')
        }




    @Get('protected')
  protectedRoute(@Req() request) {
    const accessToken = this.authGoogleService.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException('Access token not provided');
    }
    return { message: 'Protected route accessed' };
  }

@Get('check')
@UseGuards(JwtGuard)
async check(@Req() req: Request, @Res() res: Response)
{
  try {
    const user = req['user'] as User;
    if (!user) {
      throw new UnauthorizedException();
    }
    res.status(200).send(user);
  } catch (error)
  {
        res.status(500).json({ message: 'Error finding user' });
  }
}
  
  @Get('2FA/generate')
  @UseGuards(JwtGuard)
  async generateTwoFactorAuth(@Req() req: Request, @Res() res: Response) {

    const user = req['user'] as User;
    const secret = this.authGoogleService.generateTwoFactorAuthenticationSecret(user.username);
    const Url = speakeasy.otpauthURL({
      label: 'Ft_Transcendence',
      secret: secret,
    });
    try {
    const qrCode = await qrcode.toDataURL(Url);
      await this.userService.updateUser(user.id, { TwoFactSecret: secret });
      return res.status(200).json(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return res.status(500).json({ message: 'Error generating QR code' });
    }
  }

  @Post('2FA/enable')
  @UseGuards(JwtGuard)
  async enableTwoFactorAuth(@Req() req, @Body() body, @Res() res)
  {
    const user = req['user'] as User;
    const { token } = body;
    const isValidToken = this.authGoogleService.validateTwoFactorAuthenticationToken(
      token,
      user.TwoFactSecret,
      );
    await this.userService.updateUser(user.id, { isTwoFactorEnabled: false });
    if (!isValidToken) {
      return res.status(401).json('Invalid 2FA token');
    }
    try
    {
      user.isTwoFactorEnabled = true;
      await this.userService.updateUser(user.id, { isTwoFactorEnabled: true });
      return res.status(200).json('2FA enabled successfully');
    }
    catch (error)
    {
      await this.userService.updateUser(user.id, { isTwoFactorEnabled: false });
      return res.status(500).json('Error updating user');
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
      return res.status(200).json('2FA disabled successfully');
    }
    catch (error)
    {
      return res.status(500).json('Error disabling 2FA');
    }
  }

  @Post('2FA/validate')
  @UseGuards(JwtGuard)
  async validateTwoFactorAuth(@Req() req, @Body() body, @Res() res)
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
    return res.status(200).json('User validate');
  }

  @UseGuards(JwtGuard)
  @Get('google/test')
  getTestData() {
    return { message: 'This is a protected route for testing JWT authentication.' };
  }


    @Post('register')
    async registerUser(@Body() dto:CreateUserDto, @Res() res: Response)
    {
      try {
        const data = await this.userService.create(dto);
        return res.status(200).send(data);
      } catch (error)
      {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    @Post('login')
    async login(@Body() dto:LoginDto,@Req() req: Request, @Res() res: Response)
    {
      try
      {
        const data = await this.authGoogleService.login(dto);
        res.cookie('access_token', data.backendTokens.backendTokens.accessToken, { httpOnly: false });
        res.cookie('refresh_token', data.backendTokens.backendTokens.refreshToken, { httpOnly: false });
        res.json(data);
      }
      catch (error)
      {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}