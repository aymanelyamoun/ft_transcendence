'use client';;
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Matter, {Engine, Bodies, World, Render, Composite} from 'matter-js';
import Simulation from '@/app/(auth)/game/components/Simulation';
import { socket } from '@/socket';
import Image from 'next/image';

interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}
export default function PlayOnline({setGameState, gameState}: GameMenuProps) {
    // add a matter js simulation in the background of scene
    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        }
    }, [])
    return (
        <button id='ParentSim' className='linear-main rounded-lg bg-gradient-to-br w-[54vw] h-[80vh] text-white flex flex-col justify-center items-center'
        onClick={() => {setGameState('playing'); }}>
            <Simulation/>
            <div className='w-[70%] h-[60%] bg-[#9A9BD380] mx-auto rounded-xl'>
                <div className='flex flex-row h-full w-full relative'>
                    {/* <div className="flex flex-col items-center justify-" */}
                    <div className='left-[16%] top-[30%] h-[15%] w-[46%] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-start absolute font-poppins'>PLAY ONLINE</div>
                    <Image alt='image' className=" left-[16%] top-[50%] h-[12%] w-[35%] rounded-xl absolute " src='/Go.svg'/>
                    <Image alt='image' className='left-[68%] top-[40%] h-[68%] w-[37%] rounded-xl absolute' src='/BlackCard.svg'/>
                </div>
            </div>
        </button>
    )
}