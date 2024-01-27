'use client';

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useUser } from "../layout";
import Loading from "@/app/components/Loading";
import { fetchAPI } from "@/utils/api";
import { AlertMessage } from "@/app/components/alertMessage";

 let response : any;
// interface ConfirmAuthProps {
//   setTwoFa: React.Dispatch<React.SetStateAction<boolean>>;
// }
//  export default function ConfirmAuth ({setTwoFa} : {setTwoFa: React.Dispatch<React.SetStateAction<boolean>>}) {
export default function ConfirmAuth () {

  const [isError, setIsError] = useState<boolean>(false);
  const [isNotify, setIsNotify] = useState<boolean>(false);
  const handleClick = () => {
    setIsError(false);
    setIsNotify(false);
  }
  interface UserData {
       isTwoFactorEnabled?: Boolean;
       isConfirmed2Fa?: Boolean;
  }
  const router = useRouter();
  const user = useUser();
  const [codeTwoFa, setCodeTwoFa] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>({
    isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
    isConfirmed2Fa: user?.isConfirmed2Fa || false,
  });
  useEffect(() => {
    const checkAuthentication = async () => {
        if (user) {
          setUserData({
            isTwoFactorEnabled: user.isTwoFactorEnabled,
            isConfirmed2Fa: user.isConfirmed2Fa
          });
        }
    };
    checkAuthentication();
  }, [user, router]);

  const handleValidateTwoFa = async () => {
    try {
      await fetchAPI({
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/2FA/validate",
        method: "POST",
        body: {
          token : codeTwoFa,
        },
      });
      setIsNotify(true);
      console.log("heeeeere");
      // setTwoFa(false);
      router.push("/profile");
      return <Loading />;
    }
    catch (error)
    {
      response = "Two-factor authentication code is incorrect!";
      setIsError(true);
    }
  };

  if (!(userData?.isTwoFactorEnabled && !userData.isConfirmed2Fa))
  {
    router.push("/profile");
    return <Loading />;
  }
  return (
    <div
      style={{ background: "#050A27" }}
      className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
    >
      <h2 className="text-white shadow-2xl text-3xl font-bold mb-3">2FA</h2>
      <div className="py-5">
        <div
          style={{ background: "rgba(154, 155, 211, 0.20)" }}
          className="p-2 flex items-center mb-7 rounded-md w-full"
        >
          <input
            type="text"
            name="Username"
            placeholder="CODE"
            style={{ background: "rgba(154, 155, 211, 0)" }}
            className="outline-none text-sm flex-1 max-w-full text-white"
            value={codeTwoFa}
            onChange={(e) => setCodeTwoFa(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleValidateTwoFa();
              }
            }}
          />
        </div>
        {isError == true ? <AlertMessage onClick={handleClick} message={response} type="error" />  : ""}
      </div>
    </div>
  );
}
