import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Messages, Prisma } from "@prisma/client";
import { Channel, JoinChannel } from "src/chat/types/channel";
import { CreateChannelDto, JoinChannelDto } from "src/chat/DTOs/dto";

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
          // const channelData:Prisma.ChannelCreateInput;

          // check if the user exists
          // check if the default assigned users also exist

          // add all usersto the channel

          console.log("getting to create the channel");
         

          const creatorExists = await this.getUser({where:{id:data.creator}});
          if (!creatorExists) throw new ForbiddenException("user creator doesn't exit"); // this check is probably usless

          // CheckForBlocked users

          
          
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
}






