import { messageType } from "../../types"
export default function Message({message}:{message:messageType})
{
    return(
        <div>
            <h1>{message.senderId}</h1>
            <p>{message.message}</p>
            <h6>{message.timeSent}</h6>
        </div>
    )
}