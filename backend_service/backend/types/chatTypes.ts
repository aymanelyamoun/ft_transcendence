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

export interface ConversationIthem{
  id: string;
  type: $Enums.CONVERSATION_TYPE;
  createdAt: Date;
  channelId: string;
  lastMessage: string;
  profilePic: string;
  name:string;
  title:string;
}
