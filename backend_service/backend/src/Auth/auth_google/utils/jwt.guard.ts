import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { AuthGoogleService } from "../auth_google.service";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class JwtGuard implements CanActivate{
    constructor (private readonly jwtService: JwtService,
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
        private readonly redisService: RedisService
            ){}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request =  context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            if (await this.redisService.isTokenBlackListed(`blacklist:${token}`))
                throw new UnauthorizedException();
            const payload = await this.jwtService.verifyAsync(token, {
                secret : process.env.jwtSecretKey,
            });
            const user = await this.authGoogleService.findUserByEmail(payload.email);
            if (!user)
                throw new UnauthorizedException();
            request['jwt_payload'] = payload;
            request['Token'] = token;
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

