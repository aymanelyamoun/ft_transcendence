import React, {useState} from 'react';
import PlayOnline from './components/PlayOnline';
import PlayExtra from './components/PlayExtra';


interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}

export function GameMenu({setGameState, gameState}: GameMenuProps){ // bg-[#383e6e] hover:bg-[#262b4c]

    return (
        <div className='flex flex-col w-screen h-screen items-center gap-[3vw] bg-[#050A27]'>
            <div id="TopBar" className="w-1/3 max-w-xs max-h-[5vh] min-h-[5vh] outline outline-2 bg-[#282C4E] rounded-b-lg " />
            <div className='flex items-center justify-center w-full h-[80vh] gap-[2vw]'>
                <PlayOnline setGameState={setGameState} gameState={gameState}/>
                <PlayExtra setGameState={setGameState} gameState={gameState}/>
            </div>
        </div>
    )
}