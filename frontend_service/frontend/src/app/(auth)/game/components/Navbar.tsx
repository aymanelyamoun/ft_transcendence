import { IoGameController } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
export default function Navbar()
{
    return (
        <div className="w-full h-[5vh] flex flex-row justify-center items-center">
            <div className="w-1/3 max-w-xs max-h-[5vh] min-h-[5vh] outline outline-2 bg-[#282C4E] rounded-b-lg flex flex-row justify-center items-center"> 
                <Link href={'/game'} className="h-full w-full flex flex-col items-center justify-center">
                    <IoGameController className="h-[80%] w-[33%] text-white" />            
                </Link>
                <Link href={'/profile/dashboard'} className="h-full w-full flex flex-col items-center justify-center">
                    <FaUser className="h-[80%] w-[33%] text-white" />            
                </Link>
                <Link href={'/chat'} className="h-full w-full flex flex-col items-center justify-center">
                    <FaMessage className="h-[80%] w-[33%] text-white" />            
                </Link>
            </div>
        </div>
    )
}