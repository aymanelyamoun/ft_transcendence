import { user } from "./user";

export type ChannelData = {
    channelName: string;
    channelPic: string;
    password?: string;
    type: string;
    admines?: string[];
    // creator: string;
    members?: user[];
}

export type ChangeChannelData = {
    channelName: string;
    password?: string;
    type: string;
    channelId: string;
    // userId: string
    removeAdmins?: user[];
    addAdmins?: user[];
}

export type JoinChannel = {
    channelId: string,
    password?: string,
}

// export type DeleteChannel = {
//     channelId:string,
//     userId:string,
// }

// export type RemoveUserFromChannel = {
//     channelId:string,
//     userId:string,
//     userToRemove?:string

// }

export type ChannelEdit = {
    channelId:string,
    userId2?:string,
}

export type MuteUser = {
    channelId:string,
    userToMute:string,
    muteUntil:string,
    // muteUntil:Date,
}