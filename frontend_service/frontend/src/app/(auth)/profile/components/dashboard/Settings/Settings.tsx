"use client";

import React from 'react'
import styles from './Settings.module.css'
import { UilSetting } from '@iconscout/react-unicons';
import LogOut from '../LogOut/LogOut';
import EditProfile from '../EditProfile/EditProfile';
import styled from 'styled-components';
import { Backend_URL } from '@/lib/Constants';
import { useRouter } from "next/navigation";

interface SettingsProps {
    isOpen?: boolean;
    // onClick: () => void;
}

const SettingsContainer = styled.div`
    color: aliceblue;
    position: relative;
    height: 2vh;
    width: -webkit-fill-available;
    // top: 18vh;
    left: 0vw;
    margin: 1.56rem;
    padding: 2.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-top: auto;

    &:hover {
        transition: all 0.3s ease-in-out;
        background: rgba(5, 10, 39, 0.55);
    }
    &:active {
        transition: all 0.3s ease-in-out;
        background: rgba(5, 10, 39, 0.55);
    }
`;

const OpenBarContainer = styled.div`
  position: relative;
  top: 0vh;
  left: 0vw;
  gap: 0.6rem;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: height 0.2s ease-in-out;
  overflow: hidden;

  open {
    height: 10vh;
    transition: height 0.2s ease-in-out;
  }

  svg {
    font-size: 3rem;
    color: aliceblue;
  }
`;

const OpenedBar = styled.div`
    position: absolute;
    bottom: 0.1vh;
    left: 0;
    width: -webkit-fill-available;
    height: 13.5rem;
    background: rgba(5, 10, 39, 0.55);
    transition: height 0.3s ease-in-out; /* Smooth transition */
    border-radius: 1rem;
`;

const SettingSpan = styled.span`
    color: #FEFFFF;
    font-family: Poppins;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;


const Settings: React.FC<SettingsProps> = ({ isOpen}) => {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
        // if (onClick) {
        //     onClick();
        // }
    };

    React.useEffect(() => {
        if (isOpen) {
            setOpen(true);
        }
    }, [isOpen]);

    const LogOutReq = async () => {
        try {
            const response = await fetch(`${Backend_URL}auth/logout`, {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
            });
            if(response.ok){
                router.push("/");
            }else {
               alert("the logout has not been sent");
              }
        } catch (error) {
            console.log(error);
        };
    }

    return (
        <SettingsContainer
          onClick={handleClick}
        >
          {/* <div className={styles['settings-container']}> */}
          <OpenBarContainer >
            <UilSetting/>
            <SettingSpan> Settings</SettingSpan>
          </OpenBarContainer>
          {open && (
            <OpenedBar>
                <div className={styles.otherBar}>
                    <EditProfile/>
                </div>
                <div className={styles.otherBar} onClick={ () => LogOutReq()}>
                    <LogOut />
                </div>
            </OpenedBar>
          )}
          </SettingsContainer>
      );
};

export default Settings;