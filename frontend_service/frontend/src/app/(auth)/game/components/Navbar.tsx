import { IoGameController } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
export default function Navbar()
{


    // const [isLoading, setIsLoading] = useState(true);
    
    // useEffect(() => {
    //     // Simulate loading delay (you can replace this with actual loading logic)
    //     const loadingTimeout = setTimeout(() => {
    //     setIsLoading(false);
    //     }, 6000);
    
    //     // Cleanup timeout on component unmount
    //     return () => clearTimeout(loadingTimeout);
    // }, []);
    
    // if (isLoading) {
    //     return <Loading />;
    // }

        
    return (
        <div className="w-full h-[5vh] flex flex-row justify-center items-center z-50 ">
            <div className="w-1/3 max-w-xs max-h-[5vh] min-h-[5vh] outline outline-2 bg-[#282C4E] rounded-b-lg flex flex-row justify-center items-center"> 
                <Link href={'/game'} className="h-full w-full flex flex-col items-center justify-center">
                    <IoGameController className="h-[66%] w-[33%] text-white" />            
                </Link>
                <Link href={'/profile/dashboard'} className="h-full w-full flex flex-col items-center justify-center">
                    <FaUser className="h-[66%] w-[33%] text-white" />            
                </Link>
                <Link href={'/chat'} className="h-full w-full flex flex-col items-center justify-center">
                    <FaMessage className="h-[66%] w-[33%] text-white" />            
                </Link>
            </div>
        </div>
    )
}