import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthGoogleService } from '../auth_google.service';
import {Response} from 'express';
import { LOG_TYPE } from '@prisma/client';
// import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    //super() is calling the constructor of the superclass, which is PassportStrategy in this context
    constructor(
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
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
    /*validate Method:

The validate method is called by Passport.js after successful authentication to validate and process
 the user's profile information. 
This method is part of the strategy and is called automatically by Passport.js. */
    
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
    
    
//validate is executed by Passport.js middleware during the authentication flow.
/*
Strategy Initialization:

The GoogleStrategy is initialized during the application startup.
Strategy options, such as client ID, client secret, callback URL, etc., are configured in the constructor.
Authentication Request:

When a user initiates an authentication request (e.g., logs in with Google), Passport.js intercepts the request.
authenticate Method:

Passport.js middleware calls the authenticate method of the strategy.
In the authenticate method, you define how to handle the authentication process.
For example, you might redirect the user to an external authentication provider (Google) for login.
External Authentication:

The user interacts with the external authentication provider (e.g., Google) to log in.
After successful authentication, the provider redirects the user back to your application with authentication details.
validate Method:

Passport.js calls the validate method after receiving the authentication details.
In the validate method, you define how to handle the user's profile information obtained from the external provider.
This may involve logging the information, creating or retrieving a user in your database, and setting up the user's session or issuing a token.
Success or Failure:

Depending on the outcome of the validate method, Passport.js either considers the user authenticated and proceeds with the request or fails the authentication.
If successful, the user is typically granted access to protected routes or resources.
 */