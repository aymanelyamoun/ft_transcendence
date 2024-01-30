import { Inject, Injectable } from '@nestjs/common';
import { ExecutionContext} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthGoogleService } from '../auth_google.service';
import {Response} from 'express';
import { UnauthorizedException } from "@nestjs/common";

import { LOG_TYPE } from '@prisma/client';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
    constructor(
         private readonly authGoogleService: AuthGoogleService,
      ){
        super({
            clientID:
                process.env.IntraClinetId,
            clientSecret:
                process.env.IntraClientSecret,
            callbackURL:
                process.env.IntraCallbackURL,
        });
    }

    async authenticate(request: any, options?: any): Promise<any>
    {
        if (request.query && request.query.error === 'access_denied') {
          return request.res.redirect(process.env.FRONT_URL);
        }
        return super.authenticate(request, options);
    }
    

    async validate(accessToken: string, refreshToken : string, profile: Profile, res: Response)
    {
      var pic : String;
      if (profile._json.image.link)
           pic  = profile._json.image.link;
      else 
          pic = "https://res.cloudinary.com/dapuvf8uk/image/upload/v1705590105/vrygj22tzhzpku2d14ez.svg";
      const user = await  this.authGoogleService.validateUser({
        email: profile.emails[0].value,
          username: profile._json.login,
            profilePic: pic,
        }, LOG_TYPE.intralog);
         return (user);
    }
}