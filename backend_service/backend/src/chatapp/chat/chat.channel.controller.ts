import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ChangeChannelDataDto, ChannelEditDto, ConversationInfoDto, CreateChannelDto, JoinChannelDto, userDataDto } from "./DTOs/dto";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";
import { JoinChannel } from "./types/channel";
import { ChatChannelAdminGuard } from "./chat.channel.guard";
import { Role, Roles } from "./roles.decorator";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";
import { user } from "./types/user";




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
    async addUserToChannel(@Query() data:ChannelEditDto){
        await this.prismaChatService.addUserToChannel(data);
    }

    @Post('deleteChannel')
    async deleteChannel(@Query() deleteData:ChannelEditDto){
        await this.prismaChatService.deleteChannel(deleteData);
    }

    @Patch('removeUserFromChannel')
    async removeUserFromChannel(@Query() data:ChannelEditDto){
        await this.prismaChatService.removeUserFromChannel(data);
    }

    @Patch('leaveChannel')
    async leaveChannel(@Query() data:ChannelEditDto){
        await this.prismaChatService.leaveChannel(data);
    }

    @Patch('editChannel')
    async editChannel(@Query() data:ChangeChannelDataDto){
        await this.prismaChatService.editChannel(data);
    }

    @Patch('addAdmin')
    async addAdminOnChannel(@Query()data:ChannelEditDto){
        await this.prismaChatService.addAdminOnChannel(data);
    }

    @Patch('removeAdmin')
    async removeAdminOnChannel(@Query()data:ChannelEditDto){
        await this.prismaChatService.removeAdminOnChannel(data);
    }

    @Patch('banUser')
    async banUser(@Query()data:ChannelEditDto){
        await this.prismaChatService.banUser(data);
    }

    @Patch('unbanUser')
    async unbanUser(@Query()data:ChannelEditDto){
        await this.prismaChatService.unbanUser(data);
    }

    @Get('/conversation/groupMembers')
    async getChannelMembers(@Query() conversationInfo:ConversationInfoDto){
        return await this.prismaChatService.getChannelMembers(conversationInfo);
    }

    @Get('getUserConversationsDirect')
    async getUserConversationsDirect(@Query() userData:userDataDto){
        const userData_ = this.getUserData(userData);
        return await this.prismaChatService.getUserConversationsDirect(userData_);
    }
    
    @Get('getUserConversationsIthemList')
    async getUserConversationsIthemList(@Query() userData:userDataDto){
        const userData_ = this.getUserData(userData);
        return await this.prismaChatService.getConversationIthemList(userData_);
    }

    @Get('getUserConversationsChannelChat')
    async getUserConversationsChannelChat(@Query() userData:userDataDto){
        const userData_ = this.getUserData(userData);
        return await this.prismaChatService.getUserConversationsChannelChat(userData_);
    }

    @Get('/conversation/:id')
    // async getConversationsMessages(@Param('id') id:string, @Body()userData:userDataDto){
    async getConversationsMessages(@Param('id') id:string){
        // const userData_ = this.getUserData(userData);
        return await this.prismaChatService.getConversationMessages(id);
    }

    @Get('/getConversationMembers/:id')
    // async getConversationMembers(@Query() conversationInfo:ConversationInfoDto, @Param('id') id:string){
    async getConversationMembers(@Param('id') id:string){
        return await this.prismaChatService.getConversationMembers( id );
    }


    // this one is just tmeporary it should be handeled in the user part
    @Get('friends/:id')
    async getFriends(@Param('id') id:string){
        return await this.prismaChatService.getFriends(id)
    }
    getUserData(userDataDto):user{
        return {
            userId:userDataDto.userId,
            isAdmin:userDataDto.isAdmin === "true" ? true : false
        }
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

