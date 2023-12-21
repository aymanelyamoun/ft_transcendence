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
import { JwtService } from "@nestjs/jwt";
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
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
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
      (req.user as any).isConfirmed2Fa = false;
      // console.log(req.user);
      const jwtResult = await this.authGoogleService.generateJwt(req.user);
      res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly : false });
      res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly : false });
      const user = await this.userService.findByEmail(jwtResult.backendTokens.payload.email);
      if (user.isTwoFactorEnabled)
        return res.redirect('http://localhost:3000/confirmauth')
     else if (user.hash != '') {
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
      try{
      (req.user as any).isConfirmed2Fa = false;
      const jwtResult = await this.authGoogleService.generateJwt(req.user);
      res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly : false });
      res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly : false });
      const user = await this.userService.findByEmail(jwtResult.backendTokens.payload.email);
      if (user.isTwoFactorEnabled)
        return res.redirect('http://localhost:3000/confirmauth')
      else if (user.hash != '') {
        return res.redirect('http://localhost:3000/profile/dashboard')
      }
      return res.redirect('http://localhost:3000/confirm')
    } catch (error)
    {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ message: 'Error finding user' });
  }
}

@Get('logout')
@UseGuards(JwtGuard)
async logout(@Req() req: Request, @Res() res: Response)
{
  res.cookie('access_token', '', {expires: new Date()})
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logout successful' });
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
    } catch (error)
    {
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
      return res.status(401).json({message : 'Two-factor authentication code is incorrect!'});
    }
    try
    {
      user.isTwoFactorEnabled = true;
      await this.userService.updateUser(user.id, { isTwoFactorEnabled: true });
      (user as any).isConfirmed2Fa = true;
      const accessToken = await this.jwtService.signAsync(user, {
        expiresIn: '1h',
        secret: process.env.jwtSecretKey,
      });
      res.cookie('access_token', accessToken, { httpOnly : false });
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
      (user as any).isConfirmed2Fa = false;
      const accessToken = await this.jwtService.signAsync(user, {
        expiresIn: '1h',
        secret: process.env.jwtSecretKey,
      });
      res.cookie('access_token', accessToken, { httpOnly: false });
      return res.status(200).json({message : '2FA disabled successfully'});
    }
    catch (error)
    {
      return res.status(500).json({message : 'Error disabling 2FA'});
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
    (user as any).isConfirmed2Fa = true;
    const accessToken = await this.jwtService.signAsync(user, {
      expiresIn: '1h',
      secret: process.env.jwtSecretKey,
    });
    res.cookie('access_token', accessToken, { httpOnly : false });
    return res.status(200).json('User validate');
  }


    @Post('register')
    async registerUser(@Body() dto:CreateUserDto, @Res() res: Response)
    {
      // try {
        const data = await this.userService.create(dto);
        return res.status(200).send(data);
      // } catch (error)
      // {
      //   console.error('Error in login:', error);
      //   res.status(500).json({ error: 'Internal Server Error' });
      // }
    }

    @Post('login')
    async login(@Body() dto:LoginDto,@Req() req: Request, @Res() res: Response)
    {
      // try
      // {
        const data = await this.authGoogleService.login(dto);
        res.cookie('access_token', data.backendTokens.backendTokens.accessToken, { httpOnly : false });
        res.cookie('refresh_token', data.backendTokens.backendTokens.refreshToken, { httpOnly : false });
        return res.status(200).send(data); 
        //res.json(data.user);
      // }
      // catch (error)
      // {
      //   console.error('Error in login:', error);
      //   res.status(500).json({ error: 'Internal Server Error' });
      // }
    }

}