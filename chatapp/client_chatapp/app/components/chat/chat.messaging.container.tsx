import { messageType, userInfo } from "@/app/types";
import ChatMessaging from "./chat.messaging";
import ChatInfo from "./chat.message.info";

const messages:messageType[] = [
    {
        id:4,
        message:"hi from",
        timeSent:"some time",
        senderId:9,
    },
    {
        id:4,
        message:"hi from",
        timeSent:"some time",
        senderId:9,
    },
    {
        id:4,
        message:"hi from",
        timeSent:"some time",
        senderId:9,
    },
    {
        id:4,
        message:"hi from",
        timeSent:"some time",
        senderId:9,
    },

]

export const fakeUser:userInfo = {
    id:8,
    imageUrl:"https://images.pexels.com/photos/8375591/pexels-photo-8375591.jpeg",
    userName:"fakeUserName",
    title:"faker",
    status:1,
    userMessages: messages,
    lastMessage:"i am telling you !!!"
};

export default function ChatMessagingContainers()
{
    return(
        <>
            <ChatMessaging messages={messages}/>
            <ChatInfo user={fakeUser}/>
        </>
    );
}
