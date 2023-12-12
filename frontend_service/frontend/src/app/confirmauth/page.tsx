'use client'

import React, { useState } from "react";
import { Backend_URL } from "@/lib/Constants";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [codeTwoFa, setCodeTwoFa] = useState<string>("");

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
        router.push("/profile/dashboard");
      } else {
        alert("Two-factor authentication code is incorrect!");
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

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
            className="outline-none text-sm flex-1 text-white"
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
