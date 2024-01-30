"use client";
import Link from 'next/link'
import React from 'react'

export default function Notfound() {
    const gradientStyle = {
        background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
         };
      return (
          <div style={{ background: '#050A27' }} className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen">
          <div style={gradientStyle} className='fixed top-8 left-1/4 transform -translate-x-1/2 -rotate-6 w-[20vh] h-[40vh] rounded-lg'></div>
            <div style={{ background: '#9A9BD3'  } } className='fixed top-8 right-1/4 transform translate-x-1/2 rotate-6 w-[5vh] h-[40vh] rounded-lg '></div>
            <h2 className="text-white shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3">403</h2>
            <h2 style={{ color: '#9A9BD3' }} className='shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3'> unauthorized! </h2>
            <Link href='/profile' style={{ color: '#9A9BD3' }} className='shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold underline'>Dashboard</Link>
        </div>
      )
}
