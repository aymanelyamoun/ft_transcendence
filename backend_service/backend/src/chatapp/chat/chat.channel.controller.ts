import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ChangeChannelDataDto, ChannelEditDto, ConversationInfoDto, CreateChannelDto, JoinChannelDto, userDataDto } from "./DTOs/dto";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";
import { JoinChannel } from "./types/channel";
import { ChatChannelAdminGuard } from "./chat.channel.guard";
import { Role, Roles } from "./roles.decorator";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";




@Controller('channels')
export class ChannelController{

    constructor(private readonly prismaChatService:PrismaChatService){};
    @Post('createChannel')
    async createChannel(@Body() createChannelDto:CreateChannelDto){
        console.log("getting to create the channel");
        await this.prismaChatService.createChannel(createChannelDto);
    }

    @UseGuards(ChatChannelAdminGuard)
    // @Roles(Role.Admin)
    @Patch('joinChannel')
    async joinChannel(@Body() joinData:JoinChannelDto){
        console.log("join the channel : ", joinData.channelId);
        await this.prismaChatService.joinChannel(joinData);
    }

    @Patch('addUserToChannel')
    async addUserToChannel(@Body() data:ChannelEditDto){
        await this.prismaChatService.addUserToChannel(data);
    }

    @Post('deleteChannel')
    async deleteChannel(@Body() deleteData:ChannelEditDto){
        await this.prismaChatService.deleteChannel(deleteData);
    }

    @Patch('removeUserFromChannel')
    async removeUserFromChannel(@Body() data:ChannelEditDto){
        await this.prismaChatService.removeUserFromChannel(data);
    }

    @Patch('leaveChannel')
    async leaveChannel(@Body() data:ChannelEditDto){
        await this.prismaChatService.leaveChannel(data);
    }

    @Patch('editChannel')
    async editChannel(@Body() data:ChangeChannelDataDto){
        await this.prismaChatService.editChannel(data);
    }

    @Patch('addAdmin')
    async addAdminOnChannel(@Body()data:ChannelEditDto){
        await this.prismaChatService.addAdminOnChannel(data);
    }

    @Patch('removeAdmin')
    async removeAdminOnChannel(@Body()data:ChannelEditDto){
        await this.prismaChatService.removeAdminOnChannel(data);
    }

    @Patch('banUser')
    async banUser(@Body()data:ChannelEditDto){
        await this.prismaChatService.banUser(data);
    }

    @Patch('unbanUser')
    async unbanUser(@Body()data:ChannelEditDto){
        await this.prismaChatService.unbanUser(data);
    }

    @Get('/conversation/groupMembers')
    async getChannelMembers(@Body() conversationInfo:ConversationInfoDto){
        return await this.prismaChatService.getChannelMembers(conversationInfo);
    }

    @Post('getUserConversationsDirect')
    async getUserConversationsDirect(@Body() userData:userDataDto){
        // async getUserConversationsDirect(@Param('id') id:string){
        // async getUserConversationsDirect(@Param('id') id:string){
        console.log("------------------------------");

        return await this.prismaChatService.getUserConversationsDirect(userData);
    }

    @Get('getUserConversationsChannelChat')
    async getUserConversationsChannelChat(@Body() userData:userDataDto){
        return await this.prismaChatService.getUserConversationsChannelChat(userData);
    }

    @Get('/conversation/:id')
    async getConversationsMessages(@Param('id') id:string, @Body()userData:userDataDto){
        return await this.prismaChatService.getConversationMessages(id, userData);
    }

    // this one is just tmeporary it should be handeled in the user part
    @Get('friends/:id')
    async getFriends(@Param('id') id:string){
        return await this.prismaChatService.getFriends(id)
    }
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

