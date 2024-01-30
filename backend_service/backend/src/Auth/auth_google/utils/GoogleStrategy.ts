import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthGoogleService } from '../auth_google.service';
import {Response} from 'express';
import { LOG_TYPE } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
         private readonly authGoogleService: AuthGoogleService,
      ){
        super({
            clientID:
                process.env.GoogleClinetId,
            clientSecret:
                process.env.GoogleClientSecret,
            callbackURL:
                process.env.GoogleCallbackURL,
            scope: ['profile', 'email'],
        });
    }

    async authenticate(request: any, options?: any): Promise<any> {
        if (request.query && request.query.error === 'access_denied') {
          return request.res.redirect(process.env.FRONT_URL);
        }
        return super.authenticate(request, options);
      }

    async validate(accessToken: string, refreshToken : string, profile: Profile, res: Response)
    {
        const user = await  this.authGoogleService.validateUser({
                email: profile.emails[0].value,
                username: profile.emails[0].value.split('@')[0],
                 profilePic: "https://res.cloudinary.com/dapuvf8uk/image/upload/v1705590105/vrygj22tzhzpku2d14ez.svg",
        }, LOG_TYPE.googlelog);
        
        return (user);
    }
}