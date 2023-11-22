import { Injectable } from "@nestjs/common";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { CreateChannelDto } from "./DTOs/dto";

@Injectable()
export class ChannelService{
    constructor(private readonly prismaChatService:PrismaChatService){}

    async createService(createChannelDto:CreateChannelDto){
        this.prismaChatService.createChannel(createChannelDto);
    }
}