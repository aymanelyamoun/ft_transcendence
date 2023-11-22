export type Channel = {
    channelName: string;
    password?: string;
    type: string;
    admines?: string[]
    creator: string
}

export type JoinChannel = {
    channelId: string,
    password?: string,
    userId:string,
}