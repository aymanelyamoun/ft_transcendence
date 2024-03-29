import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, Request, UseGuards } from "@nestjs/common";
import { ChangeChannelDataDto, ChannelEditDto, ChannelEditDto_, ConversationInfoDto, CreateChannelDto, JoinChannelDto, MuteUserDto, userDataDto } from "./DTOs/dto";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";
import { ChangeChannelData, JoinChannel } from "./types/channel";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";
import { user } from "./types/user";
import { JwtGuard } from "src/Auth/auth_google/utils/jwt.guard";

import { plainToClass } from 'class-transformer';
import { validate } from "class-validator";
// interface joinChannelInterface
// {
//     channelId : string;
//     password: string;
// };

@UseGuards(JwtGuard)
@Controller('channels')
export class ChannelController{
    constructor(private readonly prismaChatService:PrismaChatService){};
    @Post('createChannel')
    async createChannel(@Body() createChannelDto:CreateChannelDto, @Req() req:Request){
        console.log("getting to create the channel");
        await this.prismaChatService.createChannel(createChannelDto, req);
    }

    @Patch('joinChannel')
    async joinChannel(@Body() joinData:JoinChannelDto, @Req() req:Request){
        console.log("join the channel : ", joinData.channelId);
        await this.prismaChatService.joinChannel(joinData, req);
    }

    @Patch('addUserToChannel')
    async addUserToChannel(@Body() data:ChannelEditDto, @Req() req:Request){
        await this.prismaChatService.addUserToChannel(data, req);
    }

   @Post('deleteChannel')
    async deleteChannel(@Body() deleteData:ChannelEditDto_, @Req() req:Request){
        await this.prismaChatService.deleteChannel(deleteData, req);
    }

    @Patch('removeUserFromChannel')
    async removeUserFromChannel(@Body() data:ChannelEditDto, @Req() req:Request){
        await this.prismaChatService.removeUserFromChannel(data, req);
    }

    @Patch('leaveChannel')
    async leaveChannel(@Body() data:ChannelEditDto_, @Req() req:Request){
        await this.prismaChatService.leaveChannel(data, req);
    }

    @Post('editChannel')
    async editChannel(@Body() data: ChangeChannelDataDto, @Req() req:Request){

        // const tmp = plainToClass(ChangeChannelDataDto, data);
        // console.log("getting to edit the channel");
        // console.log("the bknd data is : ", data);
        // const errors = await validate(ChangeChannelDataDto);
        // if (errors.length > 0) {
        //   // If validation fails, throw an exception with the validation errors
        //   throw new HttpException({ message: 'Validation failed', errors }, HttpStatus.BAD_REQUEST);
        // }
        // await this.prismaChatService.editChannel(tmp, req);
        await this.prismaChatService.editChannel(data, req);
    }

    @Patch('addAdmin')
    async addAdminOnChannel(@Body()data:ChannelEditDto, @Req() req:Request){
        await this.prismaChatService.addAdminOnChannel(data, req);
    }

    @Patch('removeAdmin')
    async removeAdminOnChannel(@Body()data:ChannelEditDto, @Req() req:Request){
        await this.prismaChatService.removeAdminOnChannel(data, req);
    }

    @Get('/search/all')
    async getAllChannels(@Req() req:Request){
        return await this.prismaChatService.getAllChannels(req);
    }
    @Get('/toAddSearch/')
    async addUserToChannelSearch(@Req() req:Request ){
        return await this.prismaChatService.addUserToChannelSearch(req);
        // return await this.prismaChatService.getAllChannels();
    }

    @Get('/search/:filter')
    // @UseGuards(JwtGuard)
    async getChannel(@Param('filter') filter:string, @Req() req: Request){
        // cons
        return await this.prismaChatService.getFilteredChannels(filter, req);
    }

    @Patch('banUser')
    async banUser(@Body()data:ChannelEditDto, @Req() req:Request){
        await this.prismaChatService.banUser(data, req);
    }

    @Patch('unbanUser')
    async unbanUser(@Body()data:ChannelEditDto, @Req() req:Request){
        await this.prismaChatService.unbanUser(data, req);
    }

    @Patch('muteUser')
    async muteUser(@Body()data:MuteUserDto, @Req() req:Request){
        console.log("RECIEVED DATA : ", data);
        await this.prismaChatService.muteUser(data, req);
    }

    @Get('/conversation/groupMembers')
    async getChannelMembers(@Query() conversationInfo:ConversationInfoDto, @Req() req:Request){
        console.log("getting the channel members");
        return await this.prismaChatService.getChannelMembers(conversationInfo, req);
    }

    // @Get('getUserConversationsDirect')
    // async getUserConversationsDirect(@Query() userData:userDataDto){
    //     // const userData_ = this.getUserData(userData);
    //     return await this.prismaChatService.getUserConversationsDirect(userData);
    // }
    
    @Get('getUserConversationsIthemList')
    // async getUserConversationsIthemList(@Query() userData:userDataDto){
    async getUserConversationsIthemList(@Req() req:Request){
        // const userData_ = this.getUserData(userData);
        return await this.prismaChatService.getConversationIthemList(req);
    }

    // @Get('getUserConversationsChannelChat')
    // async getUserConversationsChannelChat(@Query() userData:userDataDto){
    //     // const userData_ = this.getUserData(userData);
    //     return await this.prismaChatService.getUserConversationsChannelChat(userData);
    // }

    @Get('/conversation/:id')
    // async getConversationsMessages(@Param('id') id:string, @Body()userData:userDataDto){
    async getConversationsMessages(@Param('id') id:string, @Req() req:Request){
        // const userData_ = this.getUserData(userData);
        return await this.prismaChatService.getConversationMessages(id, req);
    }

    @Get('/getConversationMembers/:id')
    // async getConversationMembers(@Query() conversationInfo:ConversationInfoDto, @Param('id') id:string){
    async getConversationMembers(@Param('id') id:string, @Req() req:Request){
        return await this.prismaChatService.getConversationMembers( id , req);
    }

    @Get("/channelInfos/:id")
    async getChannelInfo(@Param('id') channelId:string, @Req() req:Request){
        return await this.prismaChatService.getChannelInfos(channelId, req);
    }
    
    @Get("blockedUsers")
    async getBlockedUsers(@Req() req: Request) {
        return await this.prismaChatService.getBlockedUsers(req);
    }


    // this one is just tmeporary it should be handeled in the user part
    // @Get('friends/:id')
    // async getFriends(@Param('id') id:string){
    //     return await this.prismaChatService.getFriends(id)
    // }
    // getUserData(userDataDto):user{
    //     return {
    //         userId:userDataDto.userId,
    //         // isAdmin:userDataDto.isAdmin === "true" ? true : false
    //     }
    // }
}

// * getUserConversations [*]
// * getUserSelfId - no need
// * GetConverstion messages [*]
// * GetCoversation info <
//   - admins
//   - name
//   - profile pic
// * GetFriends [*]
// * Get group members [*]

// don't allow other  admins to (ban, kick, remove admin to channel creator)
// only channel creator can change channel proberties

