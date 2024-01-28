import Image from "next/image";
export default function GameDialog({picture} : {picture : string}){
    return (
        <>
            <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full bg-black opacity-[.7]"/>
            <div className="absolute top-[18%] h-[30%] w-[50%] bg-[#282C4E]"/>
            <div className="absolute top-[20%] text-center text-4xl font-poppins
             text-white flex items-center justify-center h-[10%] w-[30%] border-white">
                WINNER IS
            </div>
            <Image src={picture} alt="Winner Picture" className="absolute top-[30%]  h-[150px] w-[150px] rounded-xl bg-gray-400"/>
        </>
    )
}