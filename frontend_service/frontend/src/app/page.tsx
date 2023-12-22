"use client";
import Image from "next/image";
import {
  FaFacebook,
  FaLinkedinIn,
  FaGoogle,
  FaEnvelope,
  FaRegEnvelope,
} from "react-icons/fa";
import { MdLabelOutline } from "react-icons/md";
import { socket } from "../socket";
import { use, useEffect } from "react";
import Link from "next/link";
// import { Link } from 'react-router-dom';

const gradientStyle = {
  background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
};

export default function Home() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      // socket.emit("userData", { userId: userId, isAdmin: "false" });
      console.log("connected to server");
    });

    socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    socket.on("message", (data) => {
      console.log(data);
    });

    socket.on("pong", (data) => {
      console.log(data);
    });
    return () => {
      socket.disconnect();
    }});

    return (
      <div style={{ background: '#050A27' }} className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen">
      <div style={gradientStyle} className='fixed top-8 left-1/4 transform -translate-x-1/2 -rotate-6  max-w-[200px] max-h-[423px] w-[19%] h-[43%] rounded-lg animate-pulse'></div>
        <div style={{ background: '#9A9BD3'  } } className='fixed top-8 right-1/4 transform  translate-x-1/2 rotate-6 max-w-[30px] max-h-[323px] w-[3%] h-[33%] rounded-lg animate-pulse'></div>

      <h2 className="text-white  font-bold mb-3 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        PONG
    </h2>

      <div className=' py-20'>
      <Link
      style={gradientStyle}
      href="/signin"
      className='text-white rounded-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-2 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl inline-block font-semibold hover:bg-[#999BD3] mb-7 shadow-xl animate-pulse'
    >
    PLAY
    </Link>     </div>
    </div>
  );
}

/*<div className="w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
  {/* sign up section 
  <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
  <div className='border-2 w-10 border-white inline-block mb-2'></div>
  <p className="mb-10">consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <a href="" className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500'>Sign Up</a>
</div>*/

//flex for all element in one line
//flex row
//flex col
//2/3: Represents the width value. In this case, it means two-thirds of the parent container's width.
//in my case we will take the 2/3 of the window
//max-w-4xl: The width won't exceed the maximum width of 4 extra-large viewport units.
/*By default, Tailwind CSS has a breakpoint for xl screens, and the width for xl screens is 1280 pixels.
So, "4 extra-large viewport units" might mean a maximum width of approximately 4 times the width of an xl screen, which would be 4 * 1280 pixels. */
/*
sm: Small screens (usually less than 640px wide)
md: Medium screens (usually between 640px and 768px wide)
lg: Large screens (usually between 768px and 1024px wide)
xl: Extra-large screens (usually 1024px wide and above)
 */
//rounded-tr-2xl :
//rounded, it applies a default border-radius to all corners of the element, making it slightly rounded.
//tr : top right
//2xl : apply a larger border-radius to the top-right corner of the element."
//mb : margin bottom
//mb-2 : mb-8px
//border-2 means "apply a border with a width of a specific size (based on the spacing scale) to this element."
