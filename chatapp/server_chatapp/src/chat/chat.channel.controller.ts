import { Controller, Post } from "@nestjs/common";
import { CreateChannelDto } from "./DTOs/dto";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";

@Controller()
export class ChannelController{
    constructor(private readonly prismaChatService:PrismaChatService){}

    @Post()
    createChannel(createChannelDto:CreateChannelDto){
        this.prismaChatService.createChannel(createChannelDto);
    }
}