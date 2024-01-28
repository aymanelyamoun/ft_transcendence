"use client";
import React, { useEffect, useState } from 'react';
import styles from './SkinComp.module.css';
import styled from 'styled-components';
import Image from 'next/image';
import { TbLock } from "react-icons/tb";
import { useUser } from '@/app/(auth)/layout';
 

interface SkinProps {
  svgImage: any;
  Name: string;
  Type: string;
  active: string;
  setActiveSkin: React.Dispatch<React.SetStateAction<string>>;
}

const SkinImg = styled.div`
position: relative;
  top: 7vh;
`;
const skinunLock = (skin : string, title : string): boolean => {
  if (skin == "default")
    return (true);
  if ((skin === "bong" || skin === "basketball" || skin === "kazino") && (title === "Silver" || title === "Gold" || title === "Master" ))
    return (true);
  if ((skin === "beach" || skin === "greeny" || skin === "redball") && (title === "Gold" || title === "Master" ))
    return (true);
  if ((skin === "potto" || skin === "mikaza") && (title === "Master"))
    return (true);
  return (false);
}


const SkinComp: React.FC<SkinProps> = ({ svgImage, Name, Type, active, setActiveSkin }) => {
  
  const [title, setTitle] = useState<string>('default');
  const user = useUser();
  useEffect(() => {
    const checkAuthentication = async () => {
        if (user) {
          setTitle(user.title || 'default');
        }
    };
    checkAuthentication();
  },[user]); 
  const SendSkin = async (Name: string, Type: string) => {
    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/skins`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({ Name: Name, Type: Type }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (response.ok)
    {
      setActiveSkin(Name);
    }
  } catch (error) {
    alert(error);
  }
  }
  return (
    <div className={styles.SkinCompRoot}>
      
      <div className={`${skinunLock(Name, title) ? styles.rotateanimation : "w-full h-full relative box-border rounded-[10px] z-auto hover:cursor-not-allowed"} ${active === Name ? styles.active : ''}`} onClick={() => 
      {if(skinunLock(Name, title)){ SendSkin(Name, Type)}}
      }>
        <div className={`${styles.SkinComp} ${active === Name ? styles.active : ''}`} onClick={() => 
          {if(skinunLock(Name, title)){ SendSkin(Name, Type)}}
          }>
          <SkinImg>
            <Image src={svgImage.src} alt={Name} />
          </SkinImg>
            <span className={styles['skin-name']}>{Name}</span>
        </div>
      {!skinunLock(Name, title) && (<div className='absolute top-0 right-0 h-full w-full bg-black/[.35]'>
        {<TbLock className='text-[#FFFEFC]  top-[25%] right-[30%] w-full h-full'/>}
      </div>)}
      </div>
    </div>
  );
};

export default SkinComp;