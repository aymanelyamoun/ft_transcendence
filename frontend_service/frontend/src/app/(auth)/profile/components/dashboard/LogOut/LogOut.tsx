"use client"

import React, { useEffect, useState } from 'react'
import styles from './LogOut.module.css'
import { IoIosLogOut } from "react-icons/io";
import Link from 'next/link';

const LogOut: React.FC = () => {
  return (
    <>
    <Link href={process.env.NEXT_PUBLIC_BACKEND_URL+"auth/logout"}>
    <div className={styles.LogOut}>
        <IoIosLogOut />
        <div className='logout-text'>Log Out</div>
    </div>
    </Link>
    </>
  );
};

export default LogOut