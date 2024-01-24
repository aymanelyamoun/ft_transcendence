"use client";
import React from 'react'
// import { motion } from "framer-motion";
export default function Transition() {

    const TransitionVariants  = {
        initial : {
            y : "100%",
            height : "100%",
        },
        animate: {
            y: "0%",
            height : "0%",
        },
        exit : {
            y: ["0%", "100%"],
            height: ["0%", "100%"],
        },
    }
//   return (
    // <div>
    // <motion.div
    //     className='fixed right-0 h-screen w-screen bottom-full z-[30] bg-[#1C1F41]'
    //     variants={TransitionVariants}
    //     initial="initial"
    //     exit="exit"
    //     animate="animate"
    //     transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }} />
    //     <motion.div
    //     className='fixed right-0 h-screen w-screen bottom-full z-[20] bg-[#494C75]'
    //     variants={TransitionVariants}
    //     initial="initial"
    //     exit="exit"
    //     animate="animate"
    //     transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
    // />
    //     <motion.div
    //     className='fixed right-0 h-screen w-screen bottom-full z-[10]  bg-[#50537D]'
    //     variants={TransitionVariants}
    //     initial="initial"
    //     exit="exit"
    //     animate="animate"
    //     transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
    // />
    // </div>
//   )
}
