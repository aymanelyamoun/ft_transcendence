import { ConsoleLogger, ForbiddenException, Injectable, NotFoundException, Req, Request } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Conversation,Prisma, User } from "@prisma/client";
// import { ChangeChannelData, ChannelData, ChannelEdit, JoinChannel } from "chatapp/server_chatapp/chat/types/channel";
// import { CreateChannelDto, JoinChannelDto } from "chatapp/server_chatapp/chat/DTOs/dto";
// import { user } from "chatapp/server_chatapp/chat/types/user";
import { IsStrongPassword } from "class-validator";
// import { MessageInfo } from "chatapp/server_chatapp/chat/types/message";
import * as bcrypt from 'bcrypt';
import { NOTIF_TYPE } from "@prisma/client";
import { CONVERSATION_TYPE } from "@prisma/client";
import { title } from "process";
import { MessageInfo } from "src/chatapp/chat/types/message";
import { ChangeChannelData, ChannelData, ChannelEdit, JoinChannel, MuteUser } from "src/chatapp/chat/types/channel";
import { JoinChannelDto } from "src/chatapp/chat/DTOs/dto";
import { user } from "src/chatapp/chat/types/user";
import { ConversationInfo } from "src/chatapp/chat/types/conversation";
import { ConversationIthemProps, MessageProps } from "types/chatTypes";
import { channel } from "diagnostics_channel";

@Injectable()
export class PrismaChatService{
    constructor(private readonly prisma: PrismaService) {}

    async getConversation(userId:string, userId2){
      try{
       const DM = await this.prisma.conversation.findFirst({where:{
          AND:[
            {users:{some:{id:userId}}},
            {users:{some:{id:userId2}}},
            {type:CONVERSATION_TYPE.DIRECT},
          ]
        }});

        if (DM) return DM;

        const new_DM = await this.prisma.conversation.create({
          data:{
            type:CONVERSATION_TYPE.DIRECT,
            users:{connect:[{id:userId}, {id:userId2}]},
        }
        }); 
        return new_DM;
      }
      catch(error){
        // thow prisma server error
        throw error;
        // console.log(error);
      }

    }

          // if (DMexists.length) {return DMexists.at(0)}

          // const new_DM = await this.prisma.messages.create({ data });
          // console.log("new_DM", new_DM);
          // return new_DM;
        // }

        async addMessageToDM(message:MessageInfo) {
          try{
            const conversation = await this.prisma.conversation.findUnique({where:{id:message.conversationId}});

            if (!conversation) throw new NotFoundException("the conversation you are asking does not exit");

            const newMessage = await this.prisma.message.create({
              data:{
                message:message.message,
                conversation:{connect:{id:message.conversationId}},
                sender:{connect:{id:message.from}}
              }
            });
            const updatedConversation = await this.prisma.conversation.update({where:{id:message.conversationId}, data:{lastMessage:message.message, 
              messages:{connect:{id:newMessage.id}}}});
            // if (!newMessage) throw new NotFoundException("the message you are trying to send does not exist");

            return await this.prisma.message.findUnique({where:{id:newMessage.id}, include:{sender:{select:{profilePic:true, username:true}}, conversation:{select:{type:true,}}}});
          }
          catch(error){
            throw error;
          }
        }

        // channel DB:

        async createChannel(data:ChannelData, @Req() req:Request){

          try{
            const user = req['user'] as User;
          
            data.members = await this.filterUsersToAdd(user.id, data.members);
            console.log("new members: ", data.members)

            // add default for data.member.isAdmin to be false

            const hash = await bcrypt.hash(data.password, 10);

            console.log("adding members...");
            const channel = await this.prisma.channel.create({
              data: {
                channelName: data.channelName,
                channelPic: data.channelPic,
                creator: {connect:{id:user.id}},
                channelType: data.type,
                // later on use hashing service
                hash: hash,
                members: {
                  create: data.members.map((member) => {
                    if (member.userId === user.id) {
                      return({
                        user: { connect: { id: member.userId } },
                        isAdmin: true,
                      })
                    }
                    return({
                      user: { connect: { id: member.userId } },
                  })}),
                },
                
              },
            });

            const createConversation = await this.prisma.conversation.create({data:{
              type: CONVERSATION_TYPE.CHANNEL_CHAT,
              members:{
                create: data.members.map((member)=>({
                  user:{connect:{id:member.userId}}
                }))
              },
              users:{
                connect: data.members.map((member)=>({id:member.userId})),
              },
              channel:{connect:{id:channel.id},}
            }

          });
          }
          catch(error){
            throw error;
          }
        }

        async deleteChannel(data:ChannelEdit, @Req() req:Request){

          try{
            const user = req['user'] as User;

            const requestedChannel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{creator:true}});
            if (!requestedChannel) throw new ForbiddenException("channel does not exits");
            const {creator} = (requestedChannel);
            if (creator.id === user.id)
            {
              // const removeBannedUsers = this.prisma.channel.update({where:{id:data.channelId}, data:{banedUsers:{disconnect:{id:{in:data.banedUsers}}}}});
              // const conversation = await this.prisma.conversation.findUnique({where:{channelId:data.channelId}});
              // const conversationUsers = await this.prisma.conversation.findUnique({where:{channelId:data.channelId}, include:{users:true}});
              // to protect 
              // const {users} = conversationUsers;
              const rmChannel = this.prisma.channel.delete({where:{id:requestedChannel.id}});
              await this.prisma.$transaction([rmChannel]);
            }
          }
          catch(error){
            throw error;
          }
        }

        async removeUserFromChannel(data: ChannelEdit, @Req() req: Request) {

          try{
            const user = req['user'] as User;

            const requestedChannel = await this.prisma.channel.findUnique({ where: { id: data.channelId }, include:{conversation:{select:{id:true}}} });
            if (!requestedChannel) throw new ForbiddenException("channel does not exist");

            const userIsAdmin = await this.userIsAdmin(user.id, data.channelId);
            if (userIsAdmin) {
              console.log("user is admin");
              await this.prisma.userChannel.delete({where:{userId_channelId:{userId: data.userId2, channelId:data.channelId}}});
              const memberTodlt = await this.prisma.member.findFirst({where:{AND:[{userId:data.userId2}, {conversationId:requestedChannel.conversation.id}]}});
              await this.prisma.conversation.update({where:{channelId:data.channelId}, data:{users:{disconnect:{id:data.userId2}}, members:{delete:{ id:memberTodlt.id }}}});
            }
            else
              throw new ForbiddenException("you are not an admin on this channel");
          }
          catch(error){
            if (error instanceof ForbiddenException)
              throw new ForbiddenException("you are not an admin on this channel");
            else
              throw error;
          }
        }

        async getAllChannels(@Req() req:Request){
          try{
            const user = req['user'] as User;
            const channels = await this.prisma.channel.findMany({where:{
              OR:[
                {channelType:"public"},
                {channelType:"protected"},
              ],
              banedUsers: {
                none: {
                  id : user.id
                }
              }
            }, include:{members:{select:{user:{select:{id : true, profilePic:true}}}}, creator:{select:{id:true, }}}});
            return channels.map((channel)=>{
              return{
                ...channel,
                group:true,
              }
            });
          }
          catch(error){
            throw error;
          }
        }

        async addUserToChannelSearch(@Req() req:Request){
          try{
            const user = req['user'] as User;
            const channel = await this.prisma.channel.findMany({where:{members:{some:{userId:user.id, isAdmin:true}}}, include:{members:{select:{user:{select:{id:true, profilePic:true}}}}, banedUsers:{select:{id:true}} } });
            if (!channel) throw new NotFoundException("channel does not exist");
            return channel;
          }
          catch(error){
            throw error;
          }
        }
      
        async getFilteredChannels(filter:string, @Req() req: Request){
          try{
            const user = req['user'] as User;
            const loggedUserId = user.id;
            const channels = await this.prisma.channel.findMany({where:{
              AND:[
                {
                  OR:[
                    {channelType:"public"},
                    {channelType:"protected"},
                  ]
                },
                {channelName:{
                  startsWith:filter,
                  mode:"insensitive",
                },
                members:{none:{userId:loggedUserId}},
                banedUsers:{none:{id:loggedUserId}},
              },
              ]
              
            }, include:{members:{select:{user:{select:{profilePic:true}}}}, creator:{select:{id:true, }}}});
            return channels.map((channel)=>{
              return{
                ...channel,
                group:true,
              }
            });
          }
          catch(error){
            throw error;
          }

        }

        async editChannel(data: ChangeChannelData, @Req() req: Request) {

          try{
            const user = req['user'] as User;

            const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{creator:true}})

            if (!channel) throw new NotFoundException("channel does not exist");

            if (channel.creator.id !== user.id) throw new ForbiddenException("you are not the creator of this channel");

            // const addAdmins = await this.filterAddAdmins(data, req);
            // const removeAdmins = await this.filterToDelete(data);

            const transaction = await this.prisma.$transaction([
              this.prisma.channel.update({
                where: { id: data.channelId },
                data: {
                  channelName: data.channelName,
                  channelType: data.type,
                  hash: data.password,
                },
              }),
              // ...addAdmins.map(admin => this.prisma.userChannel.update({
              //   where: { userId_channelId: { userId: admin.userId , channelId: data.channelId } },
              //   data: { isAdmin: true },
              // })),
              // ...removeAdmins.map(admin => this.prisma.userChannel.update({
              //   where: { userId_channelId: { userId: admin.userId, channelId: data.channelId } },
              //   data: { isAdmin: false },
              // })),
            ]);

            return transaction;
          }
          catch(error){
            throw error;
          }

        }

        async leaveChannel(data:ChannelEdit, @Req() req:Request){
          try{
            const user = req['user'] as User;
            const userInChannel = await this.prisma.userChannel.findUnique({where:{userId_channelId:{userId: user.id, channelId:data.channelId}}});
            if (!userInChannel) throw new NotFoundException('user does not exist');

            const conversation = await this.getChannelConversation(data.channelId);

            await this.prisma.conversation.update({where:{id:conversation.id}, data:{users:{disconnect:{id:user.id}}}});

            const memberId = await this.prisma.member.findFirst({where:{AND:[{userId:user.id}, {conversationId:conversation.id}]}});

            await this.prisma.conversation.update({where:{id:conversation.id}, data:{members:{delete :{id:memberId.id}}}});

            await this.prisma.userChannel.delete({where:{userId_channelId:{userId: user.id, channelId:data.channelId}}});
          }
          catch(error){
            throw error;
          }
        }

        async joinChannel(channelData:JoinChannel, @Req() req:Request){
          try{
            const loggedUser = req['user'] as User;

            const requestedChannel = await this.getChannelWithProp(channelData.channelId);
            const userIsBanned = requestedChannel.banedUsers.some((user)=> user.id === loggedUser.id);
            console.log("user is banned: ", userIsBanned);
            if (userIsBanned) throw new ForbiddenException("you are banned from this channel");
            // if (requestedChannel.channelType === "public")
            //   return await this.addChannelToUser(loggedUser.id, channelData.channelId);
            const correctPass = await bcrypt.compare(channelData.password, requestedChannel.hash);
            console.log("correctPass: ", correctPass);
            console.log("user is banned: ", userIsBanned);

            if (correctPass) {const joinedchannel =  await this.addChannelToUser(loggedUser.id, channelData.channelId);}
            else
              throw new ForbiddenException("wrong password please check again");
          }
          catch(error){
            throw error;
          }
        }

        async addUserToChannel(data:ChannelEdit, @Req() req:Request){
          try{
            const loggedUser = req['user'] as User;

            // const channel = await this.getChannelWithProp(data.channelId);
            const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{members:true, banedUsers:true}})

            if (!channel)
              throw new NotFoundException("the channel you are asking does not exist");


            if (!channel.members.some((member)=>{ return(member.userId === data.userId2)})){
              if (channel.banedUsers.some((user)=> user.id === data.userId2))
                throw new ForbiddenException("this user is banned from this channel");
              
              const user = await this.getUser({where:{id:data.userId2}})

              if (!user)
                throw new NotFoundException("the channel you are asking does not exist");

              const isFriendOf = await this.isFriendOf(loggedUser.id, data.userId2);
              const isAdmin = await this.isAdminOnChannel(loggedUser.id, data.channelId);

              if (isAdmin && isFriendOf){
              const joinChannel = await this.addChannelToUser(data.userId2 ,data.channelId);
              }
            }
          }
          catch(error){
            throw error;
          }
        }

        async addNotifToUser(userId:string, senderId:string,type:NOTIF_TYPE, title:string, discription:string){
          try{
            const notif = await this.prisma.notification.create({data:{type:type, title:title, discription:discription, user:{connect:{id:userId}}, sender:{connect:{id:senderId}}}});
          }
          catch(error){
            throw error;
          }
        }

        async addAdminOnChannel(data: ChannelEdit, @Req() req: Request) {
          try{
            const user = req['user'] as User;

            const admin = await this.prisma.userChannel.findUnique({ where: { userId_channelId: { userId: user.id, channelId: data.channelId,}, }, });
            if (!admin || !admin.isAdmin) throw new ForbiddenException("This admin doesn't exist for the channel");

            const user2 = await this.prisma.userChannel.findUnique({ where: { userId_channelId: { userId: data.userId2, channelId: data.channelId,}, }, });
            if (!user2) throw new NotFoundException("this user doesn't exixt in the channel");

            await this.prisma.userChannel.update({where:{userId_channelId:{userId:data.userId2, channelId:data.channelId}}, data:{isAdmin:true}});
          }
          catch(error){
            throw error;
          }
        }

        async removeAdminOnChannel(data: ChannelEdit, @Req() req: Request) {
          try{
            const user = req['user'] as User;

            const admin = await this.prisma.userChannel.findUnique({ where: { userId_channelId: { userId: user.id, channelId: data.channelId,}, }, });
            if (!admin || !admin.isAdmin) throw new ForbiddenException("This admin doesn't exist for the channel");

            const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{members:true, creator:true}})

            if (channel.members.some((member)=>{ return(member.userId === data.userId2)}) && channel.creator.id !== data.userId2){
              await this.prisma.userChannel.update({where:{userId_channelId:{userId:data.userId2, channelId:data.channelId}}, data:{isAdmin:false}});
            }
            else if (channel.creator.id === data.userId2)
              throw new ForbiddenException("you can not remove the channel creator");
            else
              throw new NotFoundException("this user doesn't exixt in the channel");
          }
          catch(error){
            throw error;
          }
        }

        async banUser(data: ChannelEdit, @Req() req: Request) {

          try{
            const user = req['user'] as User;
            const { channelId, userId2 } = data;
            const channel = await this.prisma.channel.findUnique({
              where: { id: channelId },
              include:{conversation:{select:{id:true}},}
            });

            if (!channel) {
              throw new NotFoundException("Channel not found");
            }
            const isAdmin = await this.userIsAdmin(user.id, channelId);

            if (!isAdmin) {
              throw new ForbiddenException("Only admins can ban users");
            }
            const updatedChannel = await this.prisma.channel.update({
              where: { id: channelId },
              data: {
                banedUsers: {
                  connect: { id: userId2 },
                },
                members: {
                  delete: { userId_channelId:{userId:userId2, channelId:channelId} },
                },
              },
            });
            const memberTodlt = await this.prisma.member.findFirst({where:{AND:[{userId:userId2}, {conversationId:channel.conversation.id}]}});
            await this.prisma.conversation.update({where:{channelId:channelId}, data:{users:{disconnect:{id:userId2}}, members:{delete:{ id:memberTodlt.id }}}});
            return updatedChannel;
          }
          catch(error){
            throw error;
          }
        }

        async unbanUser(data: ChannelEdit, @Req() req: Request) {
          try{
            const user = req['user'] as User;
            const { channelId, userId2 } = data;

            const channel = await this.prisma.channel.findUnique({
              where: { id: channelId },
            });

            if (!channel) {
              throw new NotFoundException("Channel not found");
            }

            // Check if the user is an admin
            const isAdmin = await this.userIsAdmin(user.id, channelId);

            if (!isAdmin) {
              throw new ForbiddenException("Only admins can unban users");
            }

            const updatedChannel = await this.prisma.channel.update({
              where: { id: channelId },
              data: {
                banedUsers: {
                  disconnect: { id: userId2 },
                },
              },
            });

            return updatedChannel;
          }
          catch(error){
            throw error;
          }

        }

        async getChannelMembers(conversationInfo:ConversationInfo, @Req() req:Request){
          console.log("got to conversation member");
          try{
            const user = req['user'] as User;

            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationInfo.conversationId}, include:{members:true}});
            // add is a member
            if (!conversation)
              throw new NotFoundException("this conversation does not exist");
            
            if (!conversation.members.some((member)=>{return(member.userId === user.id)}))
            throw new ForbiddenException("you are not a member of this conversation");
          
          const {members} = conversation;
          console.log("members: ",members);
          return members;
        }
        catch(error){
            // if(error instanceof NotFoundException)
            //   throw new NotFoundException("this conversation does not exist");
            // if (error instanceof ForbiddenException)
            //   throw new ForbiddenException("you are not an admin on this channel");
            // else
              throw error;
            }
        }

        async getChannel(channelId: string) {
          try{
            return await this.prisma.channel.findUnique({ where: { id: channelId } });
          }
          catch (error){
            throw error;
          }
        }

        async getChannelWithProp(channelId: string) {
          try{
            return await this.prisma.channel.findUnique({
              where: { id: channelId },
              include: { banedUsers: true,},
            });
          }
          catch (error){
            throw error;
          }
        }

        async userIsAdmin(userId: string, channelId: string): Promise<boolean> {
          try {
            const channel = await this.prisma.channel.findUnique({
              where: { id: channelId },
              include: { members: true },
            });

            if (!channel) throw new NotFoundException('Channel does not exist');

            return channel.members.some(admin => ((admin.userId) === userId && admin.isAdmin));
          }
          catch(error){
            throw error;
          }
        }

        async isFriendOf(userId:string, userId2:string):Promise<boolean> {
          try{
            const user = await this.prisma.user.findUnique({where:{id:userId}, include:{friends:true}});

            if (!user) throw new NotFoundException('user does not exist');

            return (user.friends.some((friend)=>(friend.id === userId2)))
          }
          catch(error){
            throw error;
          }
        }

        async addChannelToUser(userId: string, requestedUserChannelId: string) {
          try{
            const existingUserChannel = await this.prisma.userChannel.findUnique({
              where: {
                userId_channelId: {
                  userId: userId,
                  channelId: requestedUserChannelId,
                },
              },
            });

            if (!existingUserChannel)
            { const userChannel = await this.prisma.userChannel.create({data:{user:{connect:{id:userId}}, channel:{connect:{id:requestedUserChannelId}}}}) }

            const conversation = await this.getChannelConversation(requestedUserChannelId);

            await this.addUserToConversation(userId, conversation.id);
          }
          catch(error){
            throw error;
          }

        }

        async getUser(params: Prisma.UserFindUniqueArgs){
          try{
            return (await this.prisma.user.findUnique(params))
          }
          catch(error){
            throw error;
          }
        }

        async filterUsersToAdd(cratorUserId: string, usersTocheck: user[]) {
          try{
            const creator = await this.prisma.user.findUnique({
              where: { id: cratorUserId },
              include: {
                friends: true,
                blockedUsers: true,
                blockedByUsers: true,
              },
            });

            if (!creator) throw new ForbiddenException("user creator doesn't exit"); // this check is probably usless

            const friends = creator.friends.map(friend => friend.id);
            const blockedUsers = creator.blockedUsers.map(blockedUser => blockedUser.id);
            const blockedByUsers = creator.blockedByUsers.map(blockedByUser => blockedByUser.id);
          
            let newList = usersTocheck.filter(toCheck => {
              console.log("Checking userId:", toCheck.userId);
              return friends.includes(toCheck.userId) && 
                !blockedUsers.includes(toCheck.userId) && 
                !blockedByUsers.includes(toCheck.userId);
            });

            // remove dubplicates

            newList.push({userId:cratorUserId});

            newList = newList.filter((user, index, self) =>
            index === self.findIndex((t) => (
              t.userId === user.userId
            ))
            )
            return newList;
          }
          catch(error){
            throw error;
          }
        }

        // async filterAddAdmins(data: ChangeChannelData, @Req() req: Request) {
        //   // const user = req['user'] as User;

        //   try{
        //     const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{banedUsers:true}});
        //     if (!data.addAdmins) {
        //       return [];
        //     }

        //     const newAddAdmins = [];

        //     for (const admin of data.addAdmins) {
        //       // Fetch the user
        //       const user = await this.prisma.user.findUnique({
        //         where: { id: admin.userId },
        //         include: { blockedUsers: true, blockedByUsers: true, channels: true }
        //       });

        //       // If the user does not exist, continue to the next iteration
        //       if (!user) {
        //         continue;
        //       }

        //       // Check if the user is banned, blocked, blocked by someone, or already an admin
        //       const isBanned = channel.banedUsers.some((checkedUser)=> checkedUser.id === user.id);
        //       const isBlocked = user.blockedUsers.some(blockedUser => blockedUser.id === user.id);
        //       const isBlockedBy = user.blockedByUsers.some(blockedByUser => blockedByUser.id === user.id);
        //       // async userIsAdmin(userId: string, channelId: string): Promise<boolean> {
        //       const isAdmin = await this.userIsAdmin(user.id, data.channelId);

        //       // If the user is not banned, blocked, blocked by someone, or already an admin, add them to the newAddAdmins array
        //       if (!isBanned && !isBlocked && !isBlockedBy && !isAdmin) {
        //         newAddAdmins.push(admin);
        //       }
        //     }

        //     return newAddAdmins;
        //   }
        //   catch(error){
        //     throw error;
        //   }
        // }

        async userIsInConversation(userId:string, conversationId:string){
          try{
            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{users:{select:{id:true}}}});

            if (!conversation) throw new NotFoundException("conversation does not exist");

            return conversation.users.some((user)=>{return(user.id === userId)});
          }
          catch(error){
            throw error;
          }
        }

        async userIsMutedFromConversation(userId:string, conversationId:string){
          try{
            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{channel:{select:{mutedUsers:true}}}});

            if (!conversation) throw new NotFoundException("conversation does not exist");
            if (conversation.type === CONVERSATION_TYPE.DIRECT)
              return false;

            return conversation.channel.mutedUsers.some((mutedUser)=>{return(mutedUser.mutedId === userId && (new Date() < mutedUser.timeToEnd))});
          }
          catch(error){
            throw error;
          }
        }

        async getFriendFromConversation(userId:string, conversation:any){
          
          try{
            const friend = conversation.users.find((user)=>{return(user.id !== userId)});
            return friend;
          }
          catch(error){
            throw error;
          }
        }

        async isInBlock(userId:string, conversationId:string){
          try{
            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{channel:{select:{mutedUsers:true}}, users:true}});

            if (!conversation) throw new NotFoundException("conversation does not exist");

            if (conversation.type === CONVERSATION_TYPE.DIRECT){
              const user = await this.prisma.user.findUnique({where:{id:userId}, include:{blockedByUsers:true, blockedUsers:true}})

              if (!user) throw new NotFoundException("this user doesn't exist");

              const freind = await this.getFriendFromConversation(userId, conversation);
              // check if the other member is blocked by the user
              
              const isBlockedBy = user.blockedByUsers.some((blockedByUser)=>{return(blockedByUser.id === freind.id)});
              const isBlocked = user.blockedUsers.some((blockedUser)=>{return(blockedUser.id === freind.id)});

              if (isBlockedBy || isBlocked)
                return true;

            }
            return false;

          }
          catch(error){
            throw error;
          }
        }
        // async filterToDelete(data: ChangeChannelData) {
        //   try {
        //     if (!data.removeAdmins) {
        //       return [];
        //     }
        //     const newRemoveAdmins = [];
        //     for (const admin of data.removeAdmins) {
        //       const user = await this.prisma.user.findUnique({
        //         where: { id: admin.userId },
        //         include: { channels: true }
        //       });
        //       if (!user) {
        //         continue;
        //       }
        //       const isAdmin = await this.userIsAdmin(user.id, data.channelId);
        //       if (isAdmin) {
        //         newRemoveAdmins.push(admin);
        //       }
        //     }
          
        //     return newRemoveAdmins;
        //   }
        //   catch(error){
        //     throw error;
        //   }
        // }

        async getMemberIn(userId:string){
          try{
            const memberIn = await this.prisma.member.findMany({
              where:{
                userId:userId,
              }
            });

            return memberIn
          }
          catch(error){
            throw error;
          }
        }

        async getMemberInWithConv(userId:string){
          try{
            const memberIn = await this.prisma.member.findMany({
              where:{
                userId:userId,
              },
              include:{
                conversation:true,
              }
            });

            return memberIn
          }
          catch(error){
            throw error;
          }
        }

        async getConversationMembers(conversationId:string, @Req() req:Request){
          try{
            const user = req['user'] as User;

            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{members:{
              select:{
                user:{select:{
                  id:true,
                  profilePic:true,
                  username:true,
                }}             
              }
            }}});

            if (!conversation)
              throw new NotFoundException("this conversation does not exist");

            if (!conversation.members.some((member)=>{return(member.user.id === user.id)}))
              throw new ForbiddenException("you are not a member of this conversation");

            const {members} = conversation;
            if (!members)
              throw new NotFoundException("this conversation does not have any members");
            console.log("conversation: ", members);

            return members
          }
          catch(error){
            throw error;
          }
        }

        async getUserConversations(userId:string){
          try{
            const conversations = await this.prisma.conversation.findMany({
              where:{
                users:{some:{id:userId}}
              },
              include:{
                members:true,
              }
            });
            return conversations;
          }
          catch(error){
            throw error;
          }
        }

        async getUserConversationsDirect(@Req() req:Request){
          try{
            const user = req['user'] as User;

            const conversations = await this.prisma.conversation.findMany({
              where:{
                users:{some:{id:user.id}},
                type: CONVERSATION_TYPE.DIRECT,
              },
              include:{
                users:{
                  select:{
                    profilePic:true,
                    username:true,
                    title:true,
                    id:true,
                  }
                },

              }
              }
            ); 
            const conversationIthem: ConversationIthemProps[] = conversations.map((conversation) => {
              const friend = conversation.users[0].id === user.id ? conversation.users[1] : conversation.users[0];
              return {
                id:conversation.id,
                type:conversation.type,
                // createdAt:conversation.createdAt.toISOString(),
                updatedAt:conversation.updatedAt,
                createdAt:conversation.createdAt,
                channelId:conversation.channelId,
                lastMessage:conversation.lastMessage,
                profilePic:friend.profilePic,
                name:friend.username,
                title:friend.title,
              }
            });
            return conversationIthem;
          }
          catch(error){
            throw error;
          }
        }

        async getUserConversationsChannelChat(@Req() req:Request){
          try{
            const user = req['user'] as User;

            const conversations = await this.prisma.conversation.findMany({
              where:{
                users:{some:{id:user.id},},
                type: CONVERSATION_TYPE.CHANNEL_CHAT,
                
              },
              include:{
                users:true,
                channel:true,
              }
              }
            ); 
            const conversationIthem:ConversationIthemProps[] = conversations.map((conversation)=>{
              return {
                id:conversation.id,
                type:conversation.type,
                // createdAt:conversation.createdAt.toISOString(),
                updatedAt:conversation.updatedAt,
                createdAt:conversation.createdAt,
                channelId:conversation.channelId,
                lastMessage:conversation.lastMessage,
                profilePic:conversation.channel.channelPic,
                name:conversation.channel.channelName,
                title:"",
              }
            });
            return conversationIthem;
          }
          catch(error){
            throw error;
          }
        }

        async getConversationIthemList(@Req() req:Request){
          try{
            const DMs = await this.getUserConversationsDirect(req);
            const channelChats = await this.getUserConversationsChannelChat(req);

            return [...DMs, ...channelChats];
          }
          catch(error){
            throw error;
          }
        }

        async getConversationMessages(conversationId:string, @Req() req:Request){
          console.log("got to finding conversation messages");
          try{
            const user = req['user'] as User;

            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{members:true}});
            console.log("conversation not found");
            if (!conversation)
              throw new NotFoundException("this conversation does not exist");
            console.log("conversation is found");

            if (!conversation.members.some((member)=>{return(member.userId === user.id)}))
              throw new ForbiddenException("you are not a member of this conversation");
            console.log("is member in conversation")

            const messages_ = await this.prisma.message.findMany({where:{conversationId:conversationId}, include:{sender:{ select: {profilePic:true, username:true}}, conversation:{select:{type:true,}}}});
            // const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{messages:true}})
            // if (!conversation)
            if (!messages_)
              return new NotFoundException("conversation not found");
            console.log("messages: ", messages_);
            return messages_;
          }
          catch(error){
            throw error;
          }
        }

        async getChannelInfo(channelId: string) {
          try{
            const channelData = await this.prisma.channel.findUnique({
              where: {id: channelId}, 
              include: {creator: true, members: true, banedUsers: true, mutedUsers: true}
            });

            const { hash, ...channelInfoWithoutHash } = channelData;
            return channelInfoWithoutHash;
          }
          catch(error){
            throw error;
          }
        }

        async getChannelInfos(channelId: string, @Req() req: Request) {
          try{
            const user = req['user'] as User;

            const channelData = await this.prisma.channel.findUnique({
              where: {id: channelId},
              select:{
                creator:{select:{id:true, username:true, profilePic:true}},
                channelName:true,
                channelPic:true,
                channelType:true,
                members:true,
              }
            });

            if (!channelData) throw new NotFoundException("channel does not exist");

            return channelData;
          }
          catch(error){
            throw error;
          }
        }

        async createNewDM(userId1:string, userId2:string){
          try{
            const newConversation = await this.prisma.conversation.create({
              data:{
                type:CONVERSATION_TYPE.DIRECT,
                members:{
                  create:[{userId:userId1}, {userId:userId2}]
                },
                users:{
                  connect:[{id:userId1}, {id:userId2}]
                }
              }
            });
          }
          catch(error){
            throw error;
          }
        }
  async getBlockedUsers(@Req() req: Request) { 
    try {
      const user = req['user'] as User;
      const blockedUsers = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { blockedUsers: {select:{id:true}} },
      });
      return blockedUsers.blockedUsers;
    }
    catch(error){
      throw error;
    }
  }

        async isAdminOnChannel(userId:string, channelId:string){
          try{
            const user = await this.prisma.userChannel.findUnique({where:{userId_channelId:{userId,channelId}}});
            console.log("the user: ", user);

            return user.isAdmin
          }
          catch(error){
            throw error;
          }
        }

        async addUserToConversation(userId:string, conversationId:string){

          try{
            const updatedConversation = await this.prisma.conversation.update({
              where:{
                id:conversationId,
              },
              data:{
                members:{create:{user:{connect:{id:userId}}}},
                users:{connect:{id:userId}}
              }
            });
            const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{members:true}});
          }
          catch(error){
            throw error;
          }

        }

        async getChannelConversation(channelId:string){
          try{
            const channel = await this.prisma.channel.findUnique({where:{id:channelId}, include:{conversation:true}});
            return channel.conversation;
          }
          catch(error){
            throw error;
          }
        }

        async makeConversation(userId:string, userId2:string){
          try{
            const conversation = await this.prisma.conversation.create({
              data:{
                type:CONVERSATION_TYPE.DIRECT,
                users:{
                  connect:[{id:userId}, {id:userId2}]
                }
              }
            });
            return conversation;
          }
          catch(error){
            throw error;
          }
        }

        async muteUser(data: MuteUser, @Req() req: Request){
          try{
            const user = req['user'] as User;

            const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{mutedUsers:true, members:true},});

            if (!channel) throw new NotFoundException("channel does not exist");

            if (!channel.members.some((member)=>{return(member.userId === user.id)}))
              throw new ForbiddenException("you are not a member of this channel");

            const userToMute = await this.prisma.user.findUnique({ where: { id: data.userToMute } });
            console.log("user to mute: ", userToMute);
            if (!userToMute) {
              throw new NotFoundException("User to mute does not exist");
            }

            const timeToEnd = new Date(data.muteUntil);

if (channel.mutedUsers.some((mutedUser)=>{return(mutedUser.mutedId === data.userToMute)})){
              console.log("USER EXE----------------------------------------");
              const mutedUser = await this.prisma.muted.findFirst({where:{AND:[{mutedUser:{id:data.userToMute}}, {mutedChannel:{id: data.channelId}}]}});
              await this.prisma.channel.update({where:{id:data.channelId}, data:{mutedUsers:{update:{where:{id:mutedUser.id}, data:{timeToEnd:timeToEnd}}}}});
            }
            else
            {
              console.log("USER NOT EXE")
              // let test = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{mutedUsers:true}});
              // console.log("TEST: ",test)
              console.log("USER TO MUTE: ", data.userToMute);
              const testuser = await this.prisma.muted.create({data:{mutedUser:{connect:{id:data.userToMute}}, mutedChannel:{connect:{id:data.channelId}}, timeToEnd:timeToEnd}});
              console.log("TEST USER: ", testuser);
              // await this.prisma.channel.update({where:{id:data.channelId}, data:{mutedUsers:{create:{mutedUser:{connect:{id:data.userToMute}}, timeToEnd:timeToEnd}}}});
              const test = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{mutedUsers:true}});
              console.log("TEST: ",test)
            }
          }
          catch(error){
            throw error;
          }
        }
}