'use client';
import React, { useContext, useEffect, useState, createContext } from "react";
import Loading from "@/app/components/Loading";
import Authorization from "@/utils/auth";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Confirm from "./confirm/page";
import ConfirmAuth from "./confirmauth/page";
import Navbar from "./game/components/Navbar";
import { UserContext } from "@/utils/createContext";
import { Provider } from "react-redux";
import store from '@/store';

// import './globals.css'
// import '../../../src/app/'


interface User {
  id?: string;
  email?: string;
  username?: string;
  profilePic?: string;
  hash?: string;
  typeLog?: string;
  isTwoFactorEnabled?: boolean;
  isConfirmed2Fa?: boolean;
  title?: string;
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [twoFa, setTwoFa] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
 
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/checkAuth", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setAuthenticated(true);
          if (data?.isTwoFactorEnabled && !data.isConfirmed2Fa) {
            setTwoFa(true);
            return;
          }
        }
        else {
          router.push("/");
          return <Loading />;
        }
      } catch (error) {
      }
    };
    checkAuthentication();
  }, [pathname, router]);
  const value = { user, setUser };

  return (
    <main className="h-screen w-screen bg-[#050A27]">
      <Provider store={store}>
      <UserContext.Provider value={value}>
        <>
          {authenticated ? (
            user?.isTwoFactorEnabled && !user.isConfirmed2Fa? (
              <ConfirmAuth />
            ) 
            : 
            (
              !user?.hash ? (
                <Confirm /> 
              ) : (
                <>
                  <Navbar />
                  {children}
                </>
              )
            )
          ) : (
            <Loading />
          )}
        </>
      </UserContext.Provider>
      </Provider>
    </main>
  );
}

export default RootLayout;

export function useUser() {
  const { user } = useContext(UserContext);
  return user;
}
