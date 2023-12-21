"use client";
import { Backend_URL } from '@/lib/Constants';
import Link from "next/link";
import Image from 'next/image'
import { FaFacebook, FaLinkedinIn, FaGoogle, FaEnvelope, FaRegEnvelope } from 'react-icons/fa'
import { MdLabelOutline } from 'react-icons/md'
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { AlertMessage } from '@/app/components/alertMessage';

let response : any;
  type FormInputs = {
  username: string;
  email: string;
  hash: string;
  hashConfirm: string;
  };
 
 export default function Signup()
 {

  const [isError, setIsError] = useState<boolean>(false);
  const [isNotify, setIsNotify] = useState<boolean>(false);
  const handleClick = () => {
    setIsError(false);
    setIsNotify(false);
  }
   const router = useRouter();
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch(Backend_URL + 'auth/check', {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin':'*'
        },
    });
        if (!res.ok) {
          const data = await res.json();
        } else {
            router.push("/profile/dashboard");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
  checkAuthentication();
  },[]);
  const register = async () =>
  {
    try {
      const res = await fetch(Backend_URL + "auth/register", {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          username: data.current.username,
          email: data.current.email,
          hash: data.current.hash,
          hashConfirm: data.current.hashConfirm
        }),
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        },
      });
      if (!res.ok) {
        response = await res.json();
        setIsError(true);
        return;
      }
      setIsNotify(true);
      router.push("/signin");
    } catch (error)
    {
         console.error("Error in log function:", error);
    }
  }

  const data = useRef<FormInputs>({
    username: "",
    email: "",
    hash: "",
    hashConfirm: "",
  })
  
  const gradientStyle = {
  background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
  };
  
  return(
    <div
    style={{ background: "#050A27" }}
    className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
  >
      <h2 className=" text-white shadow-2xl  text-7xl font-bold mb-3"> PONG</h2>
      <div style={{ background: '#9A9BD3', transform: 'rotate(-137.42deg)' }} className='fixed top-4 left-36 w-[30px] h-[323px] rounded-lg'></div>
      <div
        style={gradientStyle}
        className=" max-w-lg sm:w-2/3 w-80 p-1 rounded-md sm:block px-20  overflow-y-auto"
      >
          <div className='py-10'>
          <div className="flex flex-col items-center ">
             <div style={{ background: 'rgba(154, 155, 211, 0.20)'}} className=" p-2 flex items-center mb-7 rounded-md w-full">
              <input type="text" name="Username" placeholder='Username' style={{ background: 'rgba(154, 155, 211, 0)' }} className=" outline-none text-sm flex-1 max-w-full"
              onChange={(e) => (data.current.username = e.target.value) }
              />
            </div>
            <div style={{ background: 'rgba(154, 155, 211, 0.2)'}} className="  p-2 flex items-center mb-7 rounded-md w-full ">
              <input style={{ background: 'rgba(154, 155, 211, 0)' }} type="email" name="email" placeholder='Email' className=" outline-none text-sm flex-1 max-w-full"
                onChange={(e) => (data.current.email = e.target.value) } />
            </div>
            <div style={{ background: 'rgba(154, 155, 211, 0.20)'}} className=" p-2 flex items-center mb-7 rounded-md w-full">
              <input
                type="password"
                name="password"
                placeholder="password"
                style={{ background: 'rgba(154, 155, 211, 0)' }}
                className="outline-none text-sm flex-1 max-w-full"
                onChange={(e) => (data.current.hash = e.target.value)}
              />     
            </div>
            <div style={{ background: 'rgba(154, 155, 211, 0.20)'}} className=" p-2 flex items-center mb-7 rounded-md w-full">
              <input
                type="password"
                name="confirm password"
                placeholder="confirm password"
                style={{ background: 'rgba(154, 155, 211, 0)' }}
                className="outline-none text-sm flex-1 max-w-full"
                onChange={(e) => (data.current.hashConfirm = e.target.value)}
              />     
            </div>
          <Link href="" className=' m = 0 border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-[#999BD3] mb-7' onClick={register}>Sign up</Link>
          <div className="border-2 border-white w-10 inline-block mb-7"></div>
          <div className="flex justify-center mb-7 ">
            <Link href="http://localhost:3001/api/auth/google/login" className="border-2 rounded-full border-gray-200 p-3 mx-1 hover:bg-[#999BD3] ">
              <FaGoogle className="text-sm text-white" /> 
            </Link>
            <Link  href="http://localhost:3001/api/auth/42/login" className="border-2 rounded-full border-gray-200 p-3 mx-1 hover:bg-[#999BD3]">
              <FaLinkedinIn className="text-sm text-white" />
            </Link>
            </div>
              <Link href="/signin" className=' text-white  px-12 py-2 inline-block font-semibold mb-2 hover:bg-[#999BD3]'>Sign in</Link>
          </div>
          {isError === true ? <AlertMessage onClick={handleClick} message={response.message} type="error" /> : isNotify === true ? <AlertMessage onClick={handleClick} message={"User Created!"} type="notify" /> : ""}

          </div>
        </div>
    </div>
  );
}