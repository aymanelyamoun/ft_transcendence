import { Body, Controller, Get, Inject, Param, Patch, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth_google/utils/jwt.guard";
import { UserService } from "./user.service";
import { ConfirmUserDto } from "./dto/confirm.dto";
import { AuthGoogleService } from "src/auth_google/auth_google.service";
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private userService: UserService,
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
    ) { }



    @UseGuards(JwtGuard)
    @Get(":id")
    async getUserProfile(@Param("id") id: number)
    {
        return await this.userService.findById(id);
    }


    @Patch('confirm')
  @UseGuards(JwtGuard)
  async confirm(@Req() req: Request, @Res() res: Response, @Body() dto : ConfirmUserDto){
      try {
        console.log("-----------------------------------------------");
        console.log(dto);
        console.log("----------user-------------------------------------");
        const user = await this.authGoogleService.check_token(req);
        // console.log(user);
        if (!user) {
            throw new UnauthorizedException();
        }
        const confirm = await this.userService.confirm(user.email, dto);
        res.status(200).json({ message: 'User confirmed successfully', result: confirm });
    //   res.status(200).send(user);
    } catch (error) {
      res.status(500).json({ message: 'Error finding user' });
    }
  }
}