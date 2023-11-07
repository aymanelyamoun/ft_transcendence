import { messageType } from '../../types'
import Message from './chat.message'


// const mess:messageType[] = 
export default function ChatMessaging({messages}:{messages: messageType[]})
{
    return(
        <div className='bg-zinc-500 w-3/4 '>
            {(messages.map((msg:messageType)=>(
                <Message message={msg}/>
            )))}
        </div>
    )
}