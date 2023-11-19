import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaChatService{
    constructor(private readonly prisma: PrismaService) {}

        async createNewDM(userId:string, data: Prisma.MessagesCreateInput){
          const DMexists = await this.prisma.messages.findMany({where:{toUserId: data.toUserId}});

          console.log("user exists: ", data);
          if (!DMexists){
            // await this.prisma.messages.u({where:{toUserId:data.toUserId}, data:{create:{data}}} )
            const  new_DM = await this.prisma.messages.create({data});
            // const  new_BackDM = await this.prisma.messages.create({});
            console.log("new_DM", new_DM);
          }
            // if (!new_DM)
            //   return;
            //     await this.prisma.user.update({
            //       where: {
            //         id: userId,
            //       },
            //       data: {
            //         userDMs: {
            //             connect: new_DM,
            //         },
            //       },
            //     },
            //   );
          // }
        }
}