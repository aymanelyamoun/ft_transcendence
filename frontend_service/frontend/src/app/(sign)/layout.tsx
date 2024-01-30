'use client';
import React, { useContext, useEffect, useState, createContext } from "react";
import Loading from "@/app/components/Loading";
import Authorization from "@/utils/auth";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Confirm from "../(auth)/confirm/page";


function RootLayout({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/check", {
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
          } else {
            setAuthenticated(false);
          }
        } catch (error) {
          setAuthenticated(false);
        }
      };
      checkAuthentication();
    }, [pathname]);
    if (authenticated === null) {
      return <Loading />;
    }
    if (authenticated) {
      router.push("/profile");
      return <Loading />;
    }
    return <>
      {children}
    </>;
  }
  
  export default RootLayout;
  