import { IoGameController } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar()
{

    return (
        <div className="w-full h-[5vh] flex flex-row justify-center items-center z-[99999999999]">
            <div className="w-1/3 max-w-xs max-h-[5vh] min-h-[5vh] bg-[#282C4E] rounded-b-lg flex flex-row justify-center items-center"> 
                <Link href={'/game'} className="h-full w-full flex flex-col items-center justify-center">
                    <IoGameController className="h-[66%] w-[33%] text-white" />            
                </Link>
                <Link href={'/profile'} className="h-full w-full flex flex-col items-center justify-center">
                    <FaUser className="h-[66%] w-[33%] text-white" />            
                </Link>
                <Link href={'/chat'} className="h-full w-full flex flex-col items-center justify-center">
                    <FaMessage className="h-[66%] w-[33%] text-white" />            
                </Link>
            </div>
        </div>
    )
}


