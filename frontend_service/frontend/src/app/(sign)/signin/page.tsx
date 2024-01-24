"use client";
import Image from 'next/image'
import { FaFacebook, FaLinkedinIn, FaGoogle, FaEnvelope, FaRegEnvelope } from 'react-icons/fa'
import { MdLabelOutline } from 'react-icons/md'
import Link from "next/link";
import { Backend_URL } from '@/lib/Constants';
import { useRef, useState } from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { AlertMessage } from '@/app/components/alertMessage';
import Loading from '@/app/components/Loading';
import InputField from '@/app/components/InputField';
import Button from '@/app/components/Button';
import { fetchAPI } from '@/utils/api';
import MyIcon from '@/app/components/42Icon';
import { Si42 } from "react-icons/si";


let data : any;
type FormInputs = {
  email: string;
  hash: string;
}

export default function Signin() {
  const [formData, setFormData] = useState<FormInputs>({
    email: "",
    hash: "",
  });
  
  const [isError, setIsError] = useState<boolean>(false);
  const [isNotify, setIsNotify] = useState<boolean>(false);
  const handleClick = () => {
    setIsError(false);
    setIsNotify(false);
  }
   const router = useRouter();
  const log = async () => {
    try {
      const res = await fetchAPI({
        url: Backend_URL + 'auth/login',
        method: 'POST',
        body: {
          email: formData.email,
          hash: formData.hash,
        },
      });

      if (res.isTwoFactorEnabled) {
        router.push('/confirmauth');
      } else {
        setIsNotify(true);
        router.push('/profile');
      }
    } catch (error) {
      data = error;
      setIsError(true);
    }
  };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const gradientStyle = {
    background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
  };
  

  return (
    <div style={{ background: '#050A27' }} 
    className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen">
          <h2 className="text-white shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3">PONG</h2>
          <div
          style={gradientStyle}
          className=" max-w-lg sm:w-2/3 w-80 p-1 rounded-md sm:block px-20  overflow-y-auto"
        >
            <div className='py-10'>
            <div className="flex flex-col items-center ">
            <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            <InputField type="password" name="hash" placeholder="Password" value={formData.hash} onChange={handleInputChange} />
            <Button onClick={log} text="LOG" />
            <div className="border-2 border-white w-10 inline-block mb-7"></div>
            <div className="flex justify-center mb-7 ">
              <Link href="http://localhost:3001/api/auth/google/login" className="border-2 rounded-full border-gray-200 p-3 mx-1 hover:bg-[#999BD3] ">
                <FaGoogle className="text-sm text-white" /> 
              </Link>
              <Link  href="http://localhost:3001/api/auth/42/login" className="border-2 rounded-full border-gray-200 p-3 mx-1 hover:bg-[#999BD3]">
                <Si42 className="text-sm text-white" />
                {/* <MyIcon /> */}
              </Link>
              </div>
              <Link href="/signup" className=' text-white  px-12 py-2 inline-block font-semibold mb-2 hover:text-[#999BD3]'>Create Account</Link>
            </div>
            </div>
            {isError === true ? <AlertMessage onClick={handleClick} message={data.message} type="error" /> : ""}
        </div>
    </div>
  );
}