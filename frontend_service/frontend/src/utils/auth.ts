import { Backend_URL } from '@/lib/Constants';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import React from 'react'




export default function Authorization()
{
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    useEffect(() => {
    const checkAuthentication = async () => {
        try {
          const res = await fetch(Backend_URL + "auth/check", {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
          if (res.ok) {
            setAuthenticated(true);
            const data = await res.json();
          } else {
            // router.push("/");
            setAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      checkAuthentication()
    }, []);
    return authenticated;
}
