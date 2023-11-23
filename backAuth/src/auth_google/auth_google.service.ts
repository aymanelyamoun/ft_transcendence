import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { use } from "passport";
import { PrismaService } from "src/prisma.service";
import { UserDtetails } from "src/utils/types";
import { Response, Request } from 'express';
import { UserService } from "src/user/user.service";
import { LoginDto } from "src/user/dto/auth.dto";
import * as bcrypt from 'bcrypt';
const speakeasy = require('speakeasy');

@Injectable()
export class AuthGoogleService {

    constructor (private readonly prisma: PrismaService,
                private readonly jwtService: JwtService,
                private readonly userService: UserService){}
//   async  validateUser(details: UserDtetails)
//     {
//         console.log('AuthService');
//         console.log(details); 
//         const user = await this.prisma.user.findUnique({
//             where : {
//                 email : details.email,
//             },
//         })
//         console.log()
//         if (user)
//             return user;
//             // if (user)
//             // throw new ConflictException('email duplicated');
//         console.log('user not found.')
//         const newUser = await this.prisma.user.create({
//             data:{
//                 ...user,
//             }
//         })
//         return (newUser);
//     }



async login(dto:LoginDto)
{
    //npm i @nestjs/jwt
    const user = await this.validateUserlogin(dto);
    const payload = {
        username: user.email,
        sub: user.displayName,
    };
    const backendTokens = await this.generateJwt(payload)
    return {
        user, 
        backendTokens
    }

}

async validateUserlogin(dto:LoginDto)
{
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await bcrypt.compare(dto.password, user.password)))
    {
        const { password, ...result} = user;
        return result;
    }
    throw new UnauthorizedException();
}






async validateUser(details: UserDtetails) {
    console.log('AuthService');
    console.log(details);
  
    const user = await this.prisma.user.findUnique({
      where: {
        email: details.email,
      },
    });
  
    if (user) {
      // If a user is found, return only necessary information in the JWT payload
      // const payload = {
      //   sub: user.id,
      //   email: user.email,
      //   displayName: user.displayName, // Include any other necessary fields
      // };
  
      // return {
      //   user,
      //   backendTokens: {
      //     accessToken: await this.jwtService.signAsync(payload, {
      //       expiresIn: '1h',
      //       secret: process.env.jwtSecretKey,
      //     }),
      //     refreshToken: await this.jwtService.signAsync(payload, {
      //       expiresIn: '7d',
      //       secret: process.env.jwtRefreshToken,
      //     }),
      //   },
      // };
      return user;
    }
    console.log('User not found.');
  
    // If the user is not found, create a new user
    const tempSecret =  speakeasy.generateSecret()
    console.log("------FAC");
    console.log(tempSecret);
    const newUser = await this.prisma.user.create({
      data: {
        email: details.email,
        displayName: details.displayName,
        password : 'snouaeishere',
        TwoFactSecret : tempSecret.base32
      },
      
    });
    // const payload = {
    //   sub: newUser.id,
    //   email: newUser.email,
    //   displayName: newUser.displayName,
    //   TwoFactSecret: newUser.TwoFactSecret,
    // };
  //   backendTokens: {
  //     accessToken: await this.jwtService.signAsync(payload, {
  //         expiresIn: '1h',
  //         secret: process.env.jwtSecretKey ,
  //     }),
  // };
    return newUser;
  
  // return {
  //   newUser, backendTokens: {
  //       accessToken: await this.jwtService.signAsync(payload, {
  //           expiresIn: '1h',
  //           secret: process.env.jwtSecretKey ,
  //       }),
  //       refreshToken: await this.jwtService.signAsync(payload, {
  //           expiresIn: '7d',
  //           secret: process.env.jwtRefreshToken ,
  //       }),
  //   }
//}
  }
    async findUser(id: number)
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
        }
      
  }
}


 extractTokenFromHeader(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  console.log(token);
  return token ;
}

async check_token(req: Request)
{
  let payload
  try {
      const token = this.extractTokenFromHeader(req);
       payload = await this.jwtService.verifyAsync(token, {
        secret : process.env.jwtSecretKey,
    });
  } catch {
       return null
    }
   const  user = await this.findUserByEmail(payload.email);
    if (!user)
      return null;
    return (user);
}

}

