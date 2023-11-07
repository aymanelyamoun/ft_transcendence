export type messageType = {
    id:number;
    message:string;
    timeSent:string;
    senderId:number;
}

export type userInfo = {
    id:number;
    imageUrl:string;
    userName:string;
    title:string;
    status:number;
    userMessages:messageType[];
    lastMessage:string; /*temp value*/
}