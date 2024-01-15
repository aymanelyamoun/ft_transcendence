"use client";
import React, { useEffect } from 'react';
import styles from './SkinComp.module.css';
import styled from 'styled-components';
import { Backend_URL } from '@/lib/Constants';

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

const SkinComp: React.FC<SkinProps> = ({ svgImage, Name, Type, active, setActiveSkin }) => {

  const SendSkin = async (Name: string, Type: string) => {
    try {
    const response = await fetch(`${Backend_URL}user/skins`, {
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
    // const body = await response.text();
    // console.log("skin body: ", response);
    // if(response.ok){
    //   // console.log("skin body: ", body);
    //   alert("the skin has been sent");
      // setIsActive(!isActive);
    // }else {
    //   alert("the skin has not been sent");
    // }
  } catch (error) {
    alert(error);
  }
  }
  // useEffect(() => {
  //   console.log("active: ", active);
  // },[setActiveSkin]);
  return (
    <div className={`${styles.SkinComp} ${active === Name ? styles.active : ''}`} onClick={() => SendSkin(Name, Type)}>
      <SkinImg>
        <img src={svgImage.src} alt={Name} />
      </SkinImg>
        <span className={styles['skin-name']}>{Name}</span>
    </div>
  );
};

export default SkinComp;