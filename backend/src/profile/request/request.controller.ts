import { Controller } from "@nestjs/common";




@Controller('request')
export class RequestController {
    constructor(private readonly Request){}
}