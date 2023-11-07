import { userInfo } from "@/app/types";
import MessageAssideItem from './chat.message.asside.item'
export default function ChatSideBar({userlist}:{userlist:userInfo[]}){
    return (
        <aside className="text-2xl text-blue-600/100" >
            {
                userlist.map((user)=>{
                    return(
                        <MessageAssideItem user={user}/>
                    );
                })
            }
        </aside>)
}
