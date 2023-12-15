import { Prisma, $Enums } from "@prisma/client";
// export interface Conversation {
//     id: string;
//     email: string;
//     hash: string;
//     profilePic: string;
//     username: string;
//     TwoFactSecret: string;
//     title: string;
//     wallet: number;
//     typeLog: $Enums.LOG_TYPE;
//     isFirstLog: boolean;
//     isTwoFactorEnabled: boolean;
//     mutedId: string;
//   }

// export enum CONVERSATION_TYPE {
//   DIRECT = $Enums.CONVERSATION_TYPE.DIRECT,
//   CHANNEL = $Enums.CONVERSATION_TYPE.CHANNEL_CHAT, 
// }
// export enum CONVERSATION_TYP {
//   DIRECT = "DIRECT",
//   CHANNEL = "CHANNEL",
// }


export interface ConversationIthemProps{
  id: string;
  type: string;
  // createdAt: Date;
  createdAt: string;
  channelId: string;
  lastMessage: string;
  profilePic: string;
  name:string;
  title:string;
}

