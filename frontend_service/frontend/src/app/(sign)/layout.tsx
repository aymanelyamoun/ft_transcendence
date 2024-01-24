'use client';
import React, { useContext, useEffect, useState, createContext } from "react";
import Loading from "@/app/components/Loading";
import { Backend_URL } from "@/lib/Constants";
import Authorization from "@/utils/auth";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Confirm from "../(auth)/confirm/page";
import Transition from "../components/Transition";

function RootLayout({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    
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
          } else {
            setAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthenticated(false);
        }
      };
      checkAuthentication();
    }, [pathname]);


    const [isRouting, setisRouting] = useState(false);
    const path = usePathname();
    const [prevPath, setPrevPath] = useState("/");
  
    useEffect(() => {
      if (prevPath !== path) {
        setisRouting(true);
      }
    }, [path, prevPath]);
  
    useEffect(() => {
      if (isRouting) {
        setPrevPath(path);
        const timeout = setTimeout(() => {
          setisRouting(false);
        }, 1200);
  
        return () => clearTimeout(timeout);
      }
    }, [isRouting, path]);

  
    if (authenticated === null) {
      return <Loading />;
    }
    if (authenticated) {
      router.push("/profile/dashboard");
      return <Loading />;
    }
    return <>
    {isRouting && <Transition />}
    {children}
    </>;
  }
  
  export default RootLayout;
  

