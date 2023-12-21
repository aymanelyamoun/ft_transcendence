'use client'

import React, { useEffect, useState } from "react";
import { Backend_URL } from "@/lib/Constants";
import { useRouter } from "next/navigation";
import { useUser } from "../layout";
import Loading from "@/app/components/Loading";

export default function ConfirmAuth() {
  interface UserData {
       isTwoFactorEnabled: Boolean;
       isConfirmed2Fa: Boolean;
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
      const res = await fetch(Backend_URL + "auth/2FA/validate", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: codeTwoFa,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Two-factor authentication code is correct!");
       // router.push("/profile/dashboard");
       window.location.href = "/profile/dashboard";
      } else {
        if (userData?.isTwoFactorEnabled)
          alert("Two-factor authentication code is incorrect!");
        else{
        alert("Two-factor authentication is not enabled!");
        router.push("/profile/dashboard");
        }
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  if (!(userData?.isTwoFactorEnabled && !userData.isConfirmed2Fa))
  {
    console.log(213515645645645646464646464654564);
    router.push("/profile/dashboard");
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
      </div>
    </div>
  );
}
