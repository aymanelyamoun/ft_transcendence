"use client";
import React from 'react';
import styles from './SkinComp.module.css';
import styled from 'styled-components';
import { Backend_URL } from '@/lib/Constants';

interface SkinProps {
  svgImage: any;
  Name: string;
  Type: string;
  active: boolean;
  onClick: () => void;
}

const SkinImg = styled.div`
position: relative;
  top: 7vh;
`;

const SkinComp: React.FC<SkinProps> = ({ svgImage, Name, Type, active, onClick }) => {

  const SendSkin = async (Name: string, Type: string, onFetchComplete: () => void) => {
    console.log("skin body: ", Name, Type);
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
      console.log("active before: ", active);
      onFetchComplete();
      console.log("active after: ", active);
      // setactive(Name);
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
  return (
    <div className={`${styles.SkinComp} ${active ? styles.active : ''}`} onClick={() => SendSkin(Name, Type, onClick)}>
      <SkinImg>
        <img src={svgImage.src} alt={Name} />
      </SkinImg>
        <span className={styles['skin-name']}>{Name}</span>
    </div>
  );
};

export default SkinComp;