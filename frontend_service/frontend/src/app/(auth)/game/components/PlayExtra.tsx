'use client';
import { useRouter } from 'next/navigation'

interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}




export default function PlayExtra({setGameState, gameState}: GameMenuProps) {
    const router = useRouter();
    const playComputer = () => {
        router.push('/game/singleplayer');
    }

    const playFriend = () => {
        router.push('/chat');
    }
    return (
        <div className='flex flex-col items-center justify-center h-[80vh] w-[30vw] gap-[4vh]'>
            <button className='relative sm:text-lg md:text-xl lg:text-2xl xl:text-3x blue-card text-white bg-[#383e6e] hover:bg-[#262b4c] flex-1 w-full'>
                <div onClick={playFriend} className="left-[16%] top-[30%] h-[15%] w-[46%] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-start absolute font-[poppins]">PLAY A FRIEND</div>
                <img className="absolute left-[68%] top-[15%] h-[95%] w-[37%] rounded-xl" src='/CyanCard.svg'></img>
            </button>
            <button className='relative sm:text-lg md:text-xl lg:text-2xl xl:text-3x blue-card text-white bg-[#383e6e] hover:bg-[#262b4c] flex-1 w-full'
            onClick={playComputer}>
                <div className="left-[16%] top-[30%] h-[15%] w-[46%] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-start absolute font-[poppins]">PLAY THE COMPUTER</div>
                <img className="absolute left-[68%] top-[15%] h-[95%] w-[37%] rounded-xl" src='/CyanCard.svg'></img>
            </button>
            <button className='relative sm:text-lg md:text-xl lg:text-2xl xl:text-3x blue-card text-white bg-[#383e6e] hover:bg-[#262b4c] flex-1 w-full cursor-not-allowed'>
                <div className="left-[16%] top-[30%] h-[15%] w-[46%] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-start absolute font-[poppins]">RAMADAN EVENT...</div>
                <img className="absolute left-[68%] top-[15%] h-[95%] w-[37%] rounded-xl" src='/CyanCard.svg'></img>
            </button>
        </div>
    )
}
// 