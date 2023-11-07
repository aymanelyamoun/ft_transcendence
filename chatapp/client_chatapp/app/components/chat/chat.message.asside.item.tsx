import { userInfo } from "@/app/types";

export default function MessageAssideItem({user}:{user:userInfo})
{
    return(
        <div>
            <img src={user.imageUrl} alt="friend profile pic" className="w-2.5" />
            <div>
                <h3>{user.userName}</h3>
                <p>{user.lastMessage}</p>
            </div>
        </div>
    )
}