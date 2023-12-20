"use client";
import { Backend_URL } from "@/lib/Constants";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import { useUser } from "../layout";
import { json } from "stream/consumers";
import { AlertMessage } from "@/app/components/alertMessage";

let data: any;
export default function Confirm() {

  const [isError, setIsError] = useState<boolean>(false);
  const [isNotify, setIsNotify] = useState<boolean>(false);
  const handleClick = () => {
    setIsError(false);
    setIsNotify(false);
  }

  interface UserData {
    username: string;
    profilePic?: string;
    hash: string;
    typeLog: string;
  }

  const user = useUser();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>({
    username: user?.username || '',
    profilePic: user?.profilePic || '',
    hash: user?.hash || '',
    typeLog: user?.typeLog || '',
  });
  const [hash, setPassword] = useState<string>(user?.hash || '');

  useEffect(() => {
    const checkAuthentication = async () => {
        if (user) {
          setUserData({
            username: user.username,
            profilePic: user.profilePic,
            hash: user.hash,
            typeLog: user.typeLog,
          });
          setPassword(user.hash);
          setAuthenticated(true);
        }
    };
    checkAuthentication();
  }, [user, router]);
  
  const confirm = async () => {
    console.log(userData?.profilePic);
    const res = await fetch(Backend_URL + "user/confirm", {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        username: userData?.username,
        profilePic: userData?.profilePic,
        hash: userData?.hash,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    data = await res.json();
    console.log(data);
    if (!res.ok) {
      
      setIsError(true);
      return;
    }
    setIsNotify(true);
    window.location.href = "/profile/dashboard";    
  
  };
  
  
  
  const handleConfirm = () => {
    // if (userData?.hash != '') {
      confirm();
    // } else {
    //   // alert("Password is required!");
    //   <AlertMessage onClick={handleClick} message={data.message} type="error" />
    // }
  };
  const gradientStyle = {
    background:
      "linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)",
  };
  
  
  return (
     <div>
       {/* {!authenticated ? (
         <Loading />
       ) : ( */}
    <div
      style={{ background: "#050A27" }}
      className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
    >
           <h2 className=" text-white shadow-2xl  text-7xl font-bold mb-3">
             {" "}
             PONG
           </h2>
           <div
             style={{ background: "#9A9BD3", transform: "rotate(-137.42deg)" }}
             className="fixed top-4 left-36 w-[30px] h-[323px] rounded-lg"
           ></div>
      <div
        style={gradientStyle}
        className=" max-w-lg sm:w-2/3 w-80 p-1 rounded-md sm:block px-20  overflow-y-auto"
      >
             <div className="py-10">
               <div className="flex flex-col items-center ">
                 <div className="flex items-center shrink-0 mb-7">
                   <label htmlFor="fileInput" className="cursor-pointer">
                     <img
                       id="preview_img"
                       className="w-20 h-auto object-cover rounded-full sm:w-24 md:w-32 lg:w-40 xl:w-48"
                       src={userData?.profilePic}
                       alt="Current profile photo"
                     />
                   </label>
                   <input
                     type="file"
                     id="fileInput"
                     accept="image/*"
                     className="hidden"
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                         const reader = new FileReader();
                         reader.onloadend = () => {
                           setUserData((prev) => ({
                             ...(prev as UserData),
                             profilePic: reader.result as string,
                           }));
                         };
                         reader.readAsDataURL(file);
                       }
                     }}
                   />
                 </div>
                 <div
                   style={{ background: "rgba(154, 155, 211, 0.20)" }}
                   className=" p-2 flex items-center mb-7 rounded-md w-full"
                 >
                   <input
                     value={userData?.username}
                     type="text"
                     name="Username"
                     placeholder="Username"
                     style={{ background: "rgba(154, 155, 211, 0)" }}
                     className=" outline-none text-sm flex-1 text-white"
                     onChange={(e) =>
                       setUserData(
                         (prev) =>
                           ({
                             username: e.target.value,
                             profilePic: prev?.profilePic || undefined,
                           } as UserData)
                       )
                     }
                   />
                 </div>
                 {hash === "" && (
                   <div
                     style={{ background: "rgba(154, 155, 211, 0.20)" }}
                     className=" p-2 flex items-center mb-7 rounded-md w-full"
                   >
                     <input
                       type="password"
                       name="password"
                       placeholder="password"
                       value={userData?.hash}
                       style={{ background: "rgba(154, 155, 211, 0)" }}
                       className="outline-none text-sm flex-1"
                       onChange={(e) =>
                         setUserData(
                           (prev) =>
                             ({
                               hash: e.target.value,
                               username: prev?.username || undefined,
                               profilePic: prev?.profilePic || undefined,
                             } as UserData)
                         )
                       }
                     />
                   </div>
                 )}
                 <div className="border-2 border-white w-10 inline-block mb-7"></div>
                 <Link
                   href=""
                   className={
                   "border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-[#999BD3] mb-7"   
                   }
                   onClick={handleConfirm}
                 >
                   Confirm
                 </Link>
               </div>
             </div>
             {isError === true ? <AlertMessage onClick={handleClick} message={data.message} type="error" /> : isNotify === true ? <AlertMessage onClick={handleClick} message={"User Confirmed!"} type="notify" /> : ""}

           </div>
         </div>
       {/* )}  */}
     </div>
   );
}
