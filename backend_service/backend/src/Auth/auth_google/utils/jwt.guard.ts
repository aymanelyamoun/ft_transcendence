import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { AuthGoogleService } from "../auth_google.service";

@Injectable()
export class JwtGuard implements CanActivate{
    constructor (private readonly jwtService: JwtService,
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService){}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request =  context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret : process.env.jwtSecretKey,
            });
            const user = await this.authGoogleService.findUserByEmail(payload.email);
            if (!user)
            throw new UnauthorizedException();
            request['user'] = user;
            request['isConfirmed2Fa'] = payload.isConfirmed2Fa;
        }
        catch {
            throw new UnauthorizedException();
        }
        return true;

    }

    private extractTokenFromHeader (req: Request){
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        return token ;
      }
}


// import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { Request, Response } from 'express';
// import { JwtService } from "@nestjs/jwt";
// import { AuthGoogleService } from "../auth_google.service";

// @Injectable()
// export class JwtGuard implements CanActivate {
//     constructor(
//         private readonly jwtService: JwtService,
//         @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest<Request>();
//         const response = context.switchToHttp().getResponse<Response>();

//         const token = this.extractTokenFromHeader(request);
//         if (!token) {
//             // Redirect to home if token is not found
//             this.redirectToHome(response);
//             return false;
//         }

//         try {
//             const payload = await this.jwtService.verifyAsync(token, {
//                 secret: process.env.jwtSecretKey,
//             });

//             const user = await this.authGoogleService.findUserByEmail(payload.email);
//             if (!user) {
//                 // Redirect to home if user is not found
//                 this.redirectToHome(response);
//                 return false;
//             }

//             request['user'] = user;
//         } catch {
//             // Redirect to home if token verification fails
//             this.redirectToHome(response);
//             return false;
//         }

//         return true;
//     }

//     private extractTokenFromHeader(req: Request): string | null {
//         if (req && req.cookies) {
//             return req.cookies['access_token'];
//         }
//         return null;
//     }

//     private redirectToHome(response: Response): void {
//         response.redirect('/');
//     }
// }
