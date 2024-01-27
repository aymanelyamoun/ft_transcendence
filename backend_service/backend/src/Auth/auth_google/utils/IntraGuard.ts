import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const httpContext = context.switchToHttp();
//     const response = httpContext.getResponse();
//     const request = httpContext.getRequest();

//     // if (response.headersSent) {
//     //   return false; // Headers have already been sent, do not proceed
//     // }

//     if (request.query.error === 'access_denied') {
//       response.redirect('http://localhost:3000/');
//     //   return false; // Do not proceed with the normal flow
//     }

//      return true; // Proceed with the normal flow
  }

