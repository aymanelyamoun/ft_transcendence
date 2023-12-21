import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { use } from "passport";
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from "../../profile/user/user.service";
import { LoginDto } from "../../profile/user/dto/auth.dto";
import { UserDtetails } from "src/types/types";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
import { LOG_TYPE, NOTIF_TYPE } from "@prisma/client";
const speakeasy = require('speakeasy');

@Injectable()
export class AuthGoogleService {

    constructor (private readonly prisma: PrismaService,
                private readonly jwtService: JwtService,
                private readonly userService: UserService){}


async login(dto:LoginDto)
{
  try {
    const user = await this.validateUserlogin(dto);
    const payload = {
      id: user.id,
      email: user.email,
      sub: user.username,
      isConfirmed2Fa: false,
    };
    const backendTokens = await this.generateJwt(payload)
    return {
      user,
      backendTokens
    }
  } catch (error)
  {
    throw new UnauthorizedException({message : "the email or password is incorrect"});
  }
}

async validateUserlogin(dto:LoginDto)
{
  try {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await bcrypt.compare(dto.hash, user.hash))) {
      const { hash, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  } catch (error)
  {
    throw new UnauthorizedException(error);
  }
}
  
async validateUser(details: UserDtetails, typ: LOG_TYPE)
  {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: details.email,
        },
      });

      if (user) {
        const updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { isFirstLog: false },
        });
        return user;
      }
      const tmpUsername = details.username
      const Username = await this.prisma.user.findUnique({ where: { username: details.username } });
      if (Username)
        details.username = await this.userService.generateUsername(tmpUsername);
      const newUser = await this.prisma.user.create({
        data: {
          email: details.email,
          username: details.username,
          hash: '',
          title: 'snouae rfa3 ta7di',
          wallet: 10,
          profilePic: details.profilePic.toString(),
          typeLog: typ,
          isFirstLog: true
        },
      });
      return newUser
    } catch (error)
    {
       throw new UnauthorizedException(error);
    }
  }

  async findUser(id: string)
  {
      const user = await  this.prisma.user.findUnique({
          where : {
              id : id,
          },
      })
      return (user);
  }

  async findUserByEmail(email: string)
  {
      const user = await  this.prisma.user.findUnique({
          where : {
              email : email,
          },
      })
      if (!user)
        return null;
      return (user);
  }

  async generateJwt(payload) {
      return {
        backendTokens: {
           accessToken: await this.jwtService.signAsync(payload, {
               expiresIn: '1h',
               secret: process.env.jwtSecretKey ,
           }),
           refreshToken: await this.jwtService.signAsync(payload, {
               expiresIn: '7d',
               secret: process.env.jwtRefreshToken ,
           }),
           payload
        }
  }
}

//  extractTokenFromHeader(req: Request) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['access_token'];
//   }
//   return token ;
// }
  

//   async check_token(req: Request) {
//   let payload;
//   try {
//     const token = this.extractTokenFromHeader(req);
//     payload = await this.jwtService.verifyAsync(token, {
//       secret: process.env.jwtSecretKey,
//     });
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     return null;
//   }

//   if (!payload || !payload.email) {
//     console.error('Invalid payload structure');
//     return null;
//   }
    
//   const user = await this.findUserByEmail(payload.email);
//   if (!user) {
//     console.error('User not found for email:', payload.email);
//     return null;
//     }
//     return user;
//   }

  generateTwoFactorAuthenticationSecret(username : string) {
    const secret = speakeasy.generateSecret({
      name: 'snouae',
      issuer: 'snouae',
    });
    return secret.base32;
  }

  generateTwoFactorAuthenticationToken(secret : string) {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
    });
  }

  validateTwoFactorAuthenticationToken(token : string, secret : string) {
    const isValid = speakeasy.totp.verify({
      secret, 
      token,
    });
    return isValid;
  }

}

