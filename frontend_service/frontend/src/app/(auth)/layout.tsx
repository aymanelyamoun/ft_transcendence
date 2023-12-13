
'use client'
import React, { useContext, useEffect, useState, createContext } from "react";
import Loading from "@/app/components/Loading";
import { Backend_URL } from "@/lib/Constants";
import Authorization from "@/utils/auth";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import Confirm from "./confirm/page";


interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  hash: string;
  typeLog: string;
}


interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void; 
}


const UserContext = createContext<UserContextValue>({
  user: null as User | null,
  setUser: (user: User | null) => {},
});

function RootLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
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
          setUser(data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkAuthentication();
  }, []);

  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
    {authenticated ? (
      !user?.hash ? (
        <Confirm />
      ) : (
        <> 
          {children}
        </>
      )
    ) : (
      <Loading />
    )}
    </UserContext.Provider>
  );
}

export default RootLayout;

export function useUser() {
  const { user } = useContext(UserContext);
  return user;
}
