import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Messages, Prisma } from "@prisma/client";
import { Channel, JoinChannel } from "src/chat/types/channel";

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

        async createChannel(data:Prisma.ChannelCreateInput){
          this.prisma.channel.create({data});
        }

        async joinChannel(channelData:JoinChannel){
          const requestedChannel = this.getChannelWithProp(channelData.channelId);
          // const userIsBanned = (await requestedChannel).banedUsers.some(channelData.userId);
        }

        async getChannel(channelId:string){
          return await this.prisma.channel.findUnique({where:{id:channelId}});
        }
        
        async getChannelWithProp(channelId:string){
          return await this.prisma.channel.findUnique({where:{id:channelId}, include:{banedUsers:true, admins:true, }});
        }
}