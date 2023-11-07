import { userInfo } from "@/app/types"
export default function ChatInfo({user}:{user:userInfo})
{
    return(
        <div>
            <div>
                <img src={user.imageUrl} alt="profile pic" className="w-2.5" />
                <h3>{user.userName}</h3>
                <h5>{user.title}</h5>
            </div>
            <div>
                <div>
                    <button>addF</button>
                    <button>addG</button>
                </div>
                <button>play</button>
            </div>
        </div>
    )
}