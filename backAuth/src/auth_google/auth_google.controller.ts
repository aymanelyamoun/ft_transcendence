import { Body, Controller, Get, HttpStatus, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { GoogleAuthGuard } from "./utils/Guards";
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from "./auth_google.service";
import { JwtGuard } from "./utils/jwt.guard";
import { IntraAuthGuard } from "./utils/IntraGuard";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/user.dto";
import { LoginDto } from "src/user/dto/auth.dto";
import * as qrcode from 'qrcode';
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
        //we have to rederict the user to google here
        return {msg : 'hello man'};
    }

    @Get('42/login')
    @UseGuards(IntraAuthGuard)
    handleLogin42()
    {
      return {msg: "42 Login"}
    }


    // const user = authenticationResult.user || authenticationResult.newUser || null;
        // if (user) {
        //     const { accessToken, refreshToken } = authenticationResult.backendTokens;
        //     // res.cookie('access_token', accessToken, {httpOnly: true});
        //     // res.cookie('refresh_token', refreshToken, {httpOnly:  true });
        //     res.setHeader('access_token', accessToken);
        //     res.setHeader('refresh_token', refreshToken);
        //     console.log('access_token:');
        //     console.log(accessToken);
        //     console.log('refresh token :')
        //     console.log(refreshToken);
        //   }
    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleRedirect(@Req() req: Request, @Res() res: Response)
    {
        //we have to rederict the user to google here
        // accessToken: await this.jwtService.signAsync(payload, {
        //   expiresIn: '1h',
        //   secret: process.env.jwtSecretKey,
        // })
        console.log("------------")
        console.log(req.user);
        const jwtResult = await this.authGoogleService.generateJwt(req.user);
        console.log("------------")

        console.log("the access token :")
        console.log(jwtResult.backendTokens.accessToken);

        // Redirect with JWT in cookies or query parameters
        res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly: true });
        res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly: true });
        // res.setHeader('access_token', jwtResult.backendTokens.accessToken);
        // res.setHeader('refresh_token', jwtResult.backendTokens.accessToken);
        console.log("the access token :6456456456456564564566645646")
        return res.status(HttpStatus.OK).json(req.user);
    }





    @Get('protected')
  protectedRoute(@Req() request) {
    const accessToken = this.authGoogleService.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException('Access token not provided');
    }
    console.log('Access token:', accessToken);
    return { message: 'Protected route accessed' };
  }

    // const authorizationHeader = request.headers.authorization;
    // if (!authorizationHeader) {
    //   return null;
    // }
    // const [type, token] = authorizationHeader.split(' ');
    // if (type === 'Bearer' && token) {
    //   return token;
    // }
    // return null;
  //}



    @Get('generate/twofac')
    // @UseGuards(JwtGuard)
    async RegisterFac(@Req() req: Request, @Res() res: Response)
    {
      try {
        const user = await this.authGoogleService.check_token(req);
        const {code} = req.body
      
        if (!user || user.TwoFactSecret === null) {
          throw new UnauthorizedException();
        }
      
        const secret  = user.TwoFactSecret;
        // const token = this.authGoogleService.extractTokenFromHeader(req);
        console.log(secret);

        console.log(code);
        const verified = speakeasy.totp.verify({
          secret,
          encoding: 'base32',
          token: code,
        });
      
        if (verified) {
          res.json({ verified: true });
        } else {
          res.json({ verified: false });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error finding user' });
      }

    }
    // @Post('/verify')
    // async VerifyFac(@Req() req: Request, @Res() res: Response)
    // {
    //   const {token, userId} = req.body
    //   try
    //   {
    //     const path =`/user/${userId}`
    //     comst user = db.getData(path)
    //     const {base32:}
    //   }      
    // }


    @Get('google/redirect42')
    @UseGuards(IntraAuthGuard)
    async handleRedirect42(@Req() req: Request, @Res() res: Response)
    {
        console.log("------------")
        console.log(req.user);
        const jwtResult = await this.authGoogleService.generateJwt(req.user);
        console.log("------------")
        console.log("the access token :")
        console.log(jwtResult.backendTokens.accessToken);
        res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly: true });
        res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly: true });
        console.log("the access token :6456456456456564564566645646")
        return res.status(HttpStatus.OK).json(req.user);
    }

    @UseGuards(JwtGuard)
    @Get('google/test')
    getTestData() {
      return { message: 'This is a protected route for testing JWT authentication.' };
    }

    @Get('google/status')
    user(@Req() request: Request) {
      // console.log(request.user);
      // if (request.user) {
      //   return { msg: 'Authenticated' };
      // } else {
      //   return { msg: 'Not Authenticated' };
      // }
      // // const[type, token] = request.headers.authorization.split(' ') ?? [];
      //     console.log(token);
    
    return { msg: 'Authenticated', user: request.user };
    }


    @Get('generate')
async generateTwoFactorAuthQR(@Req() req, @Res() res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already enabled!' });
    }

    const secret = user.TwoFactSecret; // Retrieve the stored secret from the user object

    // Construct the OTP authentication URL using the stored secret
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret,
      label: `YourApp:${user.username}`,
      issuer: 'YourApp',
    });

    // Generate a QR code from the OTP authentication URL
    const qrCodeDataURL = await qrcode.toDataURL(otpAuthUrl);

    return res.status(200).json({ qrCode: qrCodeDataURL });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({ message: 'Error generating QR code' });
  }
}



    @Post('register')
    async registerUser(@Body() dto:CreateUserDto)
    {
        return await this.userService.create(dto);
    }

    @Post('login')
    async login(@Body() dto:LoginDto )
    {
        return await this.authGoogleService.login(dto);
    }
}