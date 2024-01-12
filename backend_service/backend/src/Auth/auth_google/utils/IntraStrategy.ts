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
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
      ){
        super({
            clientID:
                'u-s4t2ud-ae38f95888699e53a0d1e83d0112945b049d14a0d11d467ebb5d373db96cd2be',
            clientSecret:
                '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',
            callbackURL: 'http://localhost:3001/api/auth/google/redirect42',
        });
    }

    async authenticate(request: any, options?: any): Promise<any> {
        if (request.query && request.query.error === 'access_denied') {
          return request.res.redirect('http://localhost:3000');
        }
        return super.authenticate(request, options);
      }
    

    async validate(accessToken: string, refreshToken : string, profile: Profile, res: Response)
    {
      var pic : String;
      if (profile._json.image.link)
           pic  = profile._json.image.link;
      else 
          pic = "https://i.imgur.com/GJvG1b.png";
      const user = await  this.authGoogleService.validateUser({
        email: profile.emails[0].value,
          username: profile._json.login,
            profilePic: pic,
        }, LOG_TYPE.intralog);
         return (user);
    }
}