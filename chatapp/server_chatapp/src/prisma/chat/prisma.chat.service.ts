import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Messages, Prisma, User } from "@prisma/client";
import { Channel, JoinChannel } from "src/chat/types/channel";
import { CreateChannelDto, JoinChannelDto } from "src/chat/DTOs/dto";
import { user } from "src/chat/types/user";

@Injectable()
export class PrismaChatService{
    constructor(private readonly prisma: PrismaService) {}

        async createNewDM(userId:string, data: Prisma.MessagesCreateInput) {
          const DMexists = await this.prisma.messages.findMany({
            where: {
              AND:[{
                usersMessages: { some: { userId: data.receiver } },
              },
              {
                usersMessages: { some: { userId: data.sender } },
              }
            ]
            }
          });

          if (DMexists.length) {return DMexists.at(0)}

          const new_DM = await this.prisma.messages.create({ data });
          console.log("new_DM", new_DM);
          return new_DM;
        }

        async addMessageToDM(message: Prisma.MessageCreateInput) {
          const newMessage = this.prisma.message.create({ data: message });
          console.log(newMessage);
          return newMessage;
        }

        // channel DB:

        async createChannel(data:CreateChannelDto){

          console.log("getting to create the channel");
        
          // problem probably in makeFriendShip
          data.members = await this.checkUsersToAdd(data.creator, data.members);
          console.log("new members: ", data.members)
          // if (!creator) throw new ForbiddenException("user creator doesn't exit"); // this check is probably usless

          if (data.members.length > 0){
            console.log("adding members...");
            const channel = await this.prisma.channel.create({
              data: {
                channelName: data.channelName,
                creator: data.creator,
                channelType: data.type,
                // later on user hashing service
                hash: data.password,
                members: {
                  create: data.members.map((member) => ({
                    users: { connect: { id: member.userId } },
                  }))
                }
              }
            });

            console.log("the created channel:", channel);
          }
          else{
            console.log("no members");

            const channel = await this.prisma.channel.create({
            data: {
              channelName: data.channelName,
              creator: data.creator,
              channelType: data.type,
              // later on user hashing service
              hash: data.password,
            }
          });

          console.log("the created channel:", channel);
          }
            
        }

        async joinChannel(channelData:JoinChannelDto){
          const requestedChannel = await this.getChannelWithProp(channelData.channelId);
          console.log("requested channel: ", requestedChannel);
          const userIsBanned = (await requestedChannel).banedUsers.some((user)=> user.id === channelData.userId);

          if (userIsBanned) throw new ForbiddenException("you are banned from this channel");

          const joinedchannel =  await this.addChannelToUser(channelData.userId, channelData.channelId);

          console.log("has joined channel: ",joinedchannel);
        }

        async getChannel(channelId: string) {
          return await this.prisma.channel.findUnique({ where: { id: channelId } });
        }

        async getChannelWithProp(channelId: string) {
          return await this.prisma.channel.findUnique({
            where: { id: channelId },
            include: { banedUsers: true, admins: true },
          });
        }

        // async addChannelToUser(userId: string, requestedUserChannelId: string) {
        async addChannelToUser(userId: string, requestedUserChannelId: string) {
          const user = this.prisma.user.update({
            where: { id: userId },
            data: {
              channels: {
                connectOrCreate: {
                  where: { userId_channelId: { userId, channelId: requestedUserChannelId } },
                  create: { channelId: requestedUserChannelId } // Add the create property
                }
              }
            },
          });
          return user;
        }

        async getUser(params: Prisma.UserFindUniqueArgs){
          return (await this.prisma.user.findUnique(params))
        }

        async checkUsersToAdd(userId: string, usersTocheck: user[]) {
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
              friends: true,
              blockedUsers: true,
              blockedByUsers: true,
            },
          });
        
          if (!user) {
            console.log('User not found');
            return;
          }
          console.log("userId: ", userId);
          console.log("friends..:", user.friends);
          const friends = user.friends.map(friend => friend.userId);
          console.log("friends:", friends);
          const blockedUsers = user.blockedUsers.map(blockedUser => blockedUser.userblockedId);
          const blockedByUsers = user.blockedByUsers.map(blockedByUser => blockedByUser.userblockedById);
        
          // console.log("usersTocheck:", usersTocheck.map(user => user.userId));
        
          const newList = usersTocheck.filter(toCheck => {
            console.log("Checking userId:", toCheck.userId);
            return friends.includes(toCheck.userId) && 
              !blockedUsers.includes(toCheck.userId) && 
              !blockedByUsers.includes(toCheck.userId);
          });
        
          console.log("New List: ", newList);
          return newList;
        }
        // async IsFriend(userId:string, usersTocheck:user[]){
        //   // const {user} = await this.getUser({where:{id:userId},
        //   const user = await this.prisma.user.findUnique({where:{id:userId},
        //     include:{
        //       friends: true,
        //         // include: {friend:true}
        //       blockedUsers:true,
        //       blockedByUsers:true,
        //     }
        //   });

        //   // const newUsers:user[] = [];
        //   const newList = usersTocheck.map((toCheck)=>{
        //     if (user.friends.some(friend => friend.userId === toCheck.userId))
        //       return(toCheck);
        //   }).map((toCheck)=>{
        //     if (!user.blockedUsers.some(blockedUser => blockedUser.userblockedId === toCheck.userId))
        //       return(toCheck)
        //   })

        //   console.log(newList);
        //   // const 
        //   // const friends = user.friends;
        //   // const blockedByUsers = user.b
        //   // console.log(user);
        // }

}






