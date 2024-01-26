"use client";
 
import Link from "next/link";
import Image from 'next/image'
import { FaFacebook, FaLinkedinIn, FaGoogle, FaEnvelope, FaRegEnvelope } from 'react-icons/fa'
import { MdLabelOutline } from 'react-icons/md'
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { AlertMessage } from '@/app/components/alertMessage';
import InputField from '@/app/components/InputField';
import Button from '@/app/components/Button';
import { fetchAPI } from '@/utils/api';
import { Si42 } from "react-icons/si";

import { config } from 'dotenv';

config();

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
  const register = async () => {
    try {
      await fetchAPI({
        url: process.env.NEXT_PUBLIC_BACKEND_URL + 'auth/register',
        method: 'POST',
        body: {
          username: formData.username,
          email: formData.email,
          hash: formData.hash,
          hashConfirm: formData.hashConfirm
        },
      });
      setIsNotify(true);
      router.push('/signin');
    } catch (error) {
      response = error;
      setIsError(true);
    }
  };
  const [formData, setFormData] = useState<FormInputs>({
    username: "",
    email: "",
    hash: "",
    hashConfirm: "",
  });

  
  const gradientStyle = {
  background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
  };
  
  return(
    <div
    style={{ background: "#050A27" }}
    className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
  >
      <h2 className="text-white shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3">PONG</h2>
      <div
        style={gradientStyle}
        className=" max-w-lg sm:w-2/3 w-80 p-1 rounded-md sm:block px-20  overflow-y-auto"
      >
          <div className='py-10'>
          <div className="flex flex-col items-center ">
          <InputField type="text" name="username" placeholder="Username" value={formData.username} onChange={(e) => (setFormData({ ...formData, username: e.target.value }))} />
            <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={(e) => (setFormData({ ...formData, email: e.target.value }))} />
            <InputField type="password" name="password" placeholder="Password" value={formData.hash} onChange={(e) => (setFormData({ ...formData, hash: e.target.value }))} />
            <InputField type="password" name="confirm password" placeholder="Confirm Password" value={formData.hashConfirm} onChange={(e) => (setFormData({ ...formData, hashConfirm: e.target.value }))} />
          <Button onClick={register} text="Sign up" />
          <div className="border-2 border-white w-10 inline-block mb-7"></div>
          <div className="flex justify-center mb-7 ">
            <Link href={process.env.NEXT_PUBLIC_BACKEND_URL+"auth/google/login"} className="border-2 rounded-full border-gray-200 p-3 mx-1 hover:bg-[#999BD3] ">
              <FaGoogle className="text-sm text-white" /> 
            </Link>
            <Link  href={process.env.NEXT_PUBLIC_BACKEND_URL+"auth/42/login"} className="border-2 rounded-full border-gray-200 p-3 mx-1 hover:bg-[#999BD3]">
            <Si42 className="text-sm text-white" />
            </Link>
            </div>
              <Link href="/signin" className=' text-white  px-12 py-2 inline-block font-semibold mb-2 hover:text-[#999BD3]'>Sign in</Link>
          </div>
          {isError === true ? <AlertMessage onClick={handleClick} message={response.message} type="error" /> : isNotify === true ? <AlertMessage onClick={handleClick} message={"User Created!"} type="notify" /> : ""}
          </div>
        </div>
    </div>
  );
}