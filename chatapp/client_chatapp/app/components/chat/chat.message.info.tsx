import { userInfo } from "@/app/types"
function ButtonAdd({txt}:{txt:string})
{
    return <button className="bg-blue-500 w-2/5 h-10">{txt}</button>
}

export default function ChatInfo({user}:{user:userInfo})
{
    return(
        <div className="bg-red-500 w-1/4 flex flex-col items-center">
            <div className="w-full bg-slate-50 flex flex-col items-center h-1/3" >
                <img className="w-32 h-32 rounded-full" src={user.imageUrl} alt="profile pic"/>
                <h3 className="">{user.userName}</h3>
                <h5>{user.title}</h5>
            </div>
            <div className="w-44 h-28 flex flex-col justify-center content-around">
                <div className="flex justify-between ">
                    <ButtonAdd txt="addF"/>
                    <ButtonAdd txt="addG"/>
                </div>
                <button className="bg-blue-500 h-10">play</button>
            </div>
        </div>
    )
}