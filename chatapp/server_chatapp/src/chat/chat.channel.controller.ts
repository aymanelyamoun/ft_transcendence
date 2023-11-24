import { Body, Controller, Post } from "@nestjs/common";
import { CreateChannelDto, JoinChannelDto } from "./DTOs/dto";
import { PrismaChatService } from "src/prisma/chat/prisma.chat.service";
import { JoinChannel } from "./types/channel";

@Controller('channels')
export class ChannelController{

    constructor(private readonly prismaChatService:PrismaChatService){};
    @Post('add')
    async createChannel(@Body() createChannelDto:CreateChannelDto){
        console.log("getting to create the channel");
        await this.prismaChatService.createChannel(createChannelDto);
    }

    @Post('join')
    async joinChannel(@Body() joinData:JoinChannelDto){
        console.log("join the channel : ", joinData.channelId);
        await this.prismaChatService.joinChannel(joinData);
    }
}