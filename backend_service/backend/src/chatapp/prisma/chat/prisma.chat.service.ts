import { ConsoleLogger, ForbiddenException, Injectable, NotFoundException, Req } from "@nestjs/common";
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
import { ChangeChannelData, ChannelData, ChannelEdit, JoinChannel } from "src/chatapp/chat/types/channel";
import { JoinChannelDto } from "src/chatapp/chat/DTOs/dto";
import { user } from "src/chatapp/chat/types/user";
import { ConversationInfo } from "src/chatapp/chat/types/conversation";
import { ConversationIthemProps, MessageProps } from "types/chatTypes";
import { channel } from "diagnostics_channel";

@Injectable()
export class PrismaChatService{
    constructor(private readonly prisma: PrismaService) {}

    async getConversation(userId:string, userId2){
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

          // if (DMexists.length) {return DMexists.at(0)}

          // const new_DM = await this.prisma.messages.create({ data });
          // console.log("new_DM", new_DM);
          // return new_DM;
        // }

        async addMessageToDM(message:MessageInfo) {
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

        // channel DB:

        async createChannel(data:ChannelData, @Req() req:Request){

          console.log("getting to create the channel");
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
        console.log(createConversation);
          console.log("the created channel:", channel);
        }

        async deleteChannel(data:ChannelEdit, @Req() req:Request){
          const user = req['user'] as User;

          const requestedChannel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{creator:true}});
          if (!requestedChannel) throw new ForbiddenException("channel does not exits");
          const {creator} = (requestedChannel);
          if (creator.id === user.id)
          {
            await this.prisma.userChannel.deleteMany({where:{channelId: requestedChannel.id}});
            await this.prisma.channel.delete({where:{id:requestedChannel.id}})
          }
        }

        async removeUserFromChannel(data: ChannelEdit, @Req() req: Request) {
          const user = req['user'] as User;

          const requestedChannel = await this.prisma.channel.findUnique({ where: { id: data.channelId } });
          if (!requestedChannel) throw new ForbiddenException("channel does not exist");

          const userIsAdmin = await this.userIsAdmin(user.id, data.channelId);
          if (userIsAdmin) {
            await this.prisma.userChannel.delete({where:{userId_channelId:{userId: data.userId2, channelId:data.channelId}}});
          }
          else
            throw new ForbiddenException("you are not an admin on this channel");
        }

        async getAllChannels(){
          const channels = await this.prisma.channel.findMany({where:{
            OR:[
              {channelType:"public"},
              {channelType:"protected"},
            ],
          }, include:{members:{select:{user:{select:{profilePic:true}}}}, creator:{select:{id:true, }}}});
          return channels.map((channel)=>{
            return{
              ...channel,
              group:true,
            }
          });
          return channels;
        }

        async getFilteredChannels(filter:string, @Req() req: Request){
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
          return channels;
        }

        // async changeChannel(data:ChangeChannelData){
        //   const requestedChannel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{creator:true}});
        //   if (!requestedChannel) throw new ForbiddenException("channel does not exits");
        //   const {creator} = (await requestedChannel);
        //   if (creator.id === data.userId)
        //   {
        //     await this.prisma.channel.update({where:{id:data.channelId}, data:{
        //       channelName:data.channelName,
        //       hash: data.password,
        //       channelType: data.type,
              
        //     }});
        //   } 
        // }

        async editChannel(data: ChangeChannelData, @Req() req: Request) {
          const user = req['user'] as User;
          // Filter the admins to add and remove

          const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{creator:true}})

          if (!channel) throw new NotFoundException("channel does not exist");

          if (channel.creator.id !== user.id) throw new ForbiddenException("you are not the creator of this channel");

          const addAdmins = await this.filterAddAdmins(data, req);
          const removeAdmins = await this.filterToDelete(data);

          // Start a transaction
          const transaction = await this.prisma.$transaction([
            // Update the channel
            this.prisma.channel.update({
              where: { id: data.channelId },
              data: {
                channelName: data.channelName,
                channelType: data.type,
                hash: data.password,
              },
            }),
            // Add the new admins
            ...addAdmins.map(admin => this.prisma.userChannel.update({
              where: { userId_channelId: { userId: admin.userId , channelId: data.channelId } },
              data: { isAdmin: true },
            })),
            // Remove the admins
            ...removeAdmins.map(admin => this.prisma.userChannel.update({
              where: { userId_channelId: { userId: admin.userId, channelId: data.channelId } },
              data: { isAdmin: false },
            })),
          ]);

          return transaction;
        }

        async leaveChannel(data:ChannelEdit, @Req() req:Request){
          const user = req['user'] as User;
          // const user = this.prisma.user.findUnique({where:{id:data.userId}});
          const userInChannel = await this.prisma.userChannel.findUnique({where:{userId_channelId:{userId: user.id, channelId:data.channelId}}});
          console.log("userInChannel: ", userInChannel);
          if (!userInChannel) throw new NotFoundException('user does not exist');

          // remove the user from the conversation 
          const conversation = await this.getChannelConversation(data.channelId);

          await this.prisma.conversation.update({where:{id:conversation.id}, data:{users:{disconnect:{id:user.id}}}});

          const memberId = await this.prisma.member.findFirst({where:{AND:[{userId:user.id}, {conversationId:conversation.id}]}});

          await this.prisma.conversation.update({where:{id:conversation.id}, data:{members:{delete
            
            :{id:memberId.id}}}});

          await this.prisma.userChannel.delete({where:{userId_channelId:{userId: user.id, channelId:data.channelId}}});
        }

        async joinChannel(channelData:JoinChannel, @Req() req:Request){
          const loggedUser = req['user'] as User;

          const requestedChannel = await this.getChannelWithProp(channelData.channelId);
          console.log("requested channel: ", requestedChannel);
          // const userIsBanned = (await requestedChannel).banedUsers.some((user)=> user.id === channelData.userId);
          const userIsBanned = requestedChannel.banedUsers.some((user)=> user.id === loggedUser.id);

          if (userIsBanned) throw new ForbiddenException("you are banned from this channel");

          // test when the pass is empty

          const correctPass = await bcrypt.compare(channelData.password, requestedChannel.hash);

          if (correctPass)
          {
            const joinedchannel =  await this.addChannelToUser(loggedUser.id, channelData.channelId);
            console.log("has joined channel: ",joinedchannel);
          }
          else
            throw new ForbiddenException("wrong password please check again");


        }

        async addUserToChannel(data:ChannelEdit, @Req() req:Request){
          const loggedUser = req['user'] as User;

          const channel = this.getChannelWithProp(data.channelId);

          if (!channel)
            throw new NotFoundException("the channel you are asking does not exist");
          
          const user = await this.getUser({where:{id:data.userId2}})

          if (!user)
            throw new NotFoundException("the channel you are asking does not exist");

          const isFriendOf = await this.isFriendOf(loggedUser.id, data.userId2);
          const isAdmin = await this.isAdminOnChannel(loggedUser.id, data.channelId);

          if (isAdmin && isFriendOf){
            console.log("adding user to the channel");
           const joinChannel = await this.addChannelToUser(data.userId2 ,data.channelId);
          }

          // else if (isAdmin){
          //   console.log("sending request to user from admin");
          //   await this.addNotifToUser(data.userId2, data.userId, NOTIF_TYPE.acceptChannelReq, `${data.userId} requested you to join channel`, "yes or no");
          // }

          // else {
          //   console.log("sending request to user");
          //   await this.addNotifToUser(data.userId2, data.userId, NOTIF_TYPE.joinChannelReq, `${data.userId} requested you to join channel`, "send join request");
          // }
          
        }

        async addNotifToUser(userId:string, senderId:string,type:NOTIF_TYPE, title:string, discription:string){
          // to handel : if the user has the multible notifs that do the same thing, ex: to join to the same channel
          // check if the same notif information already exists
          // const user = await this.prisma.user.up
          const notif = await this.prisma.notification.create({data:{type:type, title:title, discription:discription, user:{connect:{id:userId}}, sender:{connect:{id:senderId}}}});

        }

        async addAdminOnChannel(data: ChannelEdit, @Req() req: Request) {
          const user = req['user'] as User;

          const admin = await this.prisma.userChannel.findUnique({ where: { userId_channelId: { userId: user.id, channelId: data.channelId,}, }, });
          if (!admin || !admin.isAdmin) throw new ForbiddenException("This admin doesn't exist for the channel");

          const user2 = await this.prisma.userChannel.findUnique({ where: { userId_channelId: { userId: data.userId2, channelId: data.channelId,}, }, });
          if (!user2) throw new NotFoundException("this user doesn't exixt in the channel");

          await this.prisma.userChannel.update({where:{userId_channelId:{userId:data.userId2, channelId:data.channelId}}, data:{isAdmin:true}});
        }

        async removeAdminOnChannel(data: ChannelEdit, @Req() req: Request) {
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
          // const user2 = await this.prisma.userChannel.findUnique({ where: { userId_channelId: { userId: data.userId2, channelId: data.channelId,}, }, });
        }

        async banUser(data: ChannelEdit, @Req() req: Request) {

          const user = req['user'] as User;
          const { channelId, userId2 } = data;

          // Fetch the channel
          const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
          });

          if (!channel) {
            throw new NotFoundException("Channel not found");
          }

          // Check if the user is an admin
          const isAdmin = await this.userIsAdmin(user.id, channelId);

          if (!isAdmin) {
            throw new ForbiddenException("Only admins can ban users");
          }

          // Add the user to the banedUsers relation and remove from members
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

          return updatedChannel;
        }

        async unbanUser(data: ChannelEdit, @Req() req: Request) {
          const user = req['user'] as User;
          const { channelId, userId2 } = data;

          // Fetch the channel
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

          // Remove the user from the banedUsers relation
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

        async getChannelMembers(conversationInfo:ConversationInfo, @Req() req:Request){
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

        async getChannel(channelId: string) {
          // need to add some more logic 
          return await this.prisma.channel.findUnique({ where: { id: channelId } });
        }

        async getChannelWithProp(channelId: string) {
          return await this.prisma.channel.findUnique({
            where: { id: channelId },
            include: { banedUsers: true,},
          });
        }

        async userIsAdmin(userId: string, channelId: string): Promise<boolean> {
          const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
            include: { members: true },
          });

          if (!channel) throw new NotFoundException('Channel does not exist');

          return channel.members.some(admin => ((admin.userId) === userId && admin.isAdmin));
        }

        async isFriendOf(userId:string, userId2:string):Promise<boolean> {
          const user = await this.prisma.user.findUnique({where:{id:userId}, include:{friends:true}});

          if (!user) throw new NotFoundException('user does not exist');

          return (user.friends.some((friend)=>(friend.id === userId2)))
        }

        private async addUserTochannel(userId:string, channelId:string){

        }
        // to be checked
        async addChannelToUser(userId: string, requestedUserChannelId: string) {
          // const user = await this.prisma.user.update({
          //   where: { id: userId },
          //   data: {
          //     channels: {
          //       connectOrCreate: {
          //         where: { userId_channelId: { userId, channelId: requestedUserChannelId } },
          //         create:{ channelId: requestedUserChannelId } // Add the create property
          //       }
          //     }
          //   },
          // });

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
          // jump

          // console.log("the user: ", user);
          // return user;
        }

        async getUser(params: Prisma.UserFindUniqueArgs){
          return (await this.prisma.user.findUnique(params))
        }

        async filterUsersToAdd(cratorUserId: string, usersTocheck: user[]) {
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
        
          const newList = usersTocheck.filter(toCheck => {
            console.log("Checking userId:", toCheck.userId);
            return friends.includes(toCheck.userId) && 
              !blockedUsers.includes(toCheck.userId) && 
              !blockedByUsers.includes(toCheck.userId);
          });

          newList.push({userId:cratorUserId});
          console.log("New List: ", newList);
          return newList;
        }

        async filterAddAdmins(data: ChangeChannelData, @Req() req: Request) {
          const user = req['user'] as User;
          // If there are no admins to add, return an empty array

          const channel = await this.prisma.channel.findUnique({where:{id:data.channelId}, include:{banedUsers:true}});
          if (!data.addAdmins) {
            return [];
          }

          const newAddAdmins = [];

          for (const admin of data.addAdmins) {
            // Fetch the user
            const user = await this.prisma.user.findUnique({
              where: { id: admin.userId },
              include: { blockedUsers: true, blockedByUsers: true, channels: true }
            });

            // If the user does not exist, continue to the next iteration
            if (!user) {
              continue;
            }

            // Check if the user is banned, blocked, blocked by someone, or already an admin
            const isBanned = channel.banedUsers.some((checkedUser)=> checkedUser.id === user.id);
            const isBlocked = user.blockedUsers.some(blockedUser => blockedUser.id === user.id);
            const isBlockedBy = user.blockedByUsers.some(blockedByUser => blockedByUser.id === user.id);
            // async userIsAdmin(userId: string, channelId: string): Promise<boolean> {
            const isAdmin = await this.userIsAdmin(user.id, data.channelId);

            // If the user is not banned, blocked, blocked by someone, or already an admin, add them to the newAddAdmins array
            if (!isBanned && !isBlocked && !isBlockedBy && !isAdmin) {
              newAddAdmins.push(admin);
            }
          }

          return newAddAdmins;
        }

        async filterToDelete(data: ChangeChannelData) {
          // If there are no admins to remove, return an empty array
          if (!data.removeAdmins) {
            return [];
          }
        
          const newRemoveAdmins = [];
        
          for (const admin of data.removeAdmins) {
            // Fetch the user
            const user = await this.prisma.user.findUnique({
              where: { id: admin.userId },
              include: { channels: true }
            });
        
            // If the user does not exist, continue to the next iteration
            if (!user) {
              continue;
            }
        
            // Check if the user is already an admin
            const isAdmin = await this.userIsAdmin(user.id, data.channelId);
        
            // If the user is already an admin, add them to the newRemoveAdmins array
            if (isAdmin) {
              newRemoveAdmins.push(admin);
            }
          }
        
          return newRemoveAdmins;
        }

        async getMemberIn(userId:string){

          const memberIn = await this.prisma.member.findMany({
            where:{
              userId:userId,
            }
          });

          return memberIn
        }

        async getMemberInWithConv(userId:string){

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

        async getConversationMembers(conversationId:string, @Req() req:Request){
          const user = req['user'] as User;

          // console.log("conversationId: ", conversationId);
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

        async getUserConversations(userId:string){
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

        async getUserConversationsDirect(@Req() req:Request){
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

        // async getUserConversationsDirect(userData:user){
        //   const conversations = await this.prisma.conversation.findMany({
        //     where:{
        //       users:{some:{id:userData.userId}},
        //       type: CONVERSATION_TYPE.DIRECT,
        //     },
        //     include:{
        //       users:true,

        //     }
        //     }
        //   ); 
        //   const conversationIthem: ConversationIthemProps[] = conversations.map((conversation) => {
        //     const friend = conversation.users[0].id === userData.userId ? conversation.users[1] : conversation.users[0];
        //     return {
        //       id:conversation.id,
        //       type:conversation.type,
        //       createdAt:conversation.createdAt.toISOString(),
        //       channelId:conversation.channelId,
        //       lastMessage:conversation.lastMessage,
        //       profilePic:friend.profilePic,
        //       name:friend.username,
        //       title:friend.title,
        //     }
        //   });
        //   return conversationIthem;
        // }

        async getUserConversationsChannelChat(@Req() req:Request){
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

        async getConversationIthemList(@Req() req:Request){
          const user = req['user'] as User;

          const DMs = await this.getUserConversationsDirect(req);
          const channelChats = await this.getUserConversationsChannelChat(req);

          return [...DMs, ...channelChats];
        }

        // async getConversationMessages(conversationId:string, userData:user){
        async getConversationMessages(conversationId:string, @Req() req:Request){
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

        async getChannelInfo(channelId: string) {
          const channelData = await this.prisma.channel.findUnique({
            where: {id: channelId}, 
            include: {creator: true, members: true, banedUsers: true, mutedUsers: true}
          });

          // Destructure the channelData object to separate the hash property
          const { hash, ...channelInfoWithoutHash } = channelData;

          // Return the channelInfoWithoutHash object which doesn't include the hash property
          return channelInfoWithoutHash;
        }


        async getChannelInfos(channelId: string, @Req() req: Request) {
          const user = req['user'] as User;

          const channelData = await this.prisma.channel.findUnique({
            where: {id: channelId},
            select:{
              creator:{select:{id:true, username:true, profilePic:true}},
              channelName:true,
              channelPic:true,
              channelType:true,
            }
            // include: {creator: true}
          });

          if (!channelData) throw new NotFoundException("channel does not exist");

          return channelData;

        }

    // this one is just tmeporary it should be handeled in the user part
        async getFriends(userId:string){
          const {friends} = await this.prisma.user.findUnique({where:{id:userId}, include:{friends:true}});

          console.log("friends:", friends);
          return friends;
        }


        async createNewDM(userId1:string, userId2:string){
          // need to add more logic to later, (this is just for test)

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
          console.log("conversation created : ", newConversation);
        }

        async isAdminOnChannel(userId:string, channelId:string){
          const user = await this.prisma.userChannel.findUnique({where:{userId_channelId:{userId,channelId}}});
          console.log("the user: ", user);

          return user.isAdmin
        }

        async addUserToConversation(userId:string, conversationId:string){

          const updatedConversation = await this.prisma.conversation.update({
            where:{
              id:conversationId,
            },
            data:{
              members:{create:{user:{connect:{id:userId}}}},
              users:{connect:{id:userId}}
            }
          });

          // const user = await this.prisma.user.update({where:{id:userId}, data:{memberConv}})

          const conversation = await this.prisma.conversation.findUnique({where:{id:conversationId}, include:{members:true}});
          console.log("conversation: ", conversation);
        }

        async getChannelConversation(channelId:string){
          const channel = await this.prisma.channel.findUnique({where:{id:channelId}, include:{conversation:true}});
          return channel.conversation;
        }

        async makeConversation(userId:string, userId2:string){
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
}












