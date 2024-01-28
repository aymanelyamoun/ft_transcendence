"use client"

import React, { useEffect } from 'react';
import styles from './sidebar.module.css';
declare module '@iconscout/react-unicons';
import { FaGoogleWallet } from 'react-icons/fa';
import Settings from '../Settings/Settings';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLoggedInUserId } from '@/features/strings/stringActions';
import Link from 'next/link';
import { GiSkullShield } from "react-icons/gi";
import { IoShieldSharp } from "react-icons/io5";
import { GiRosaShield } from "react-icons/gi";
import { GiBorderedShield } from "react-icons/gi";
import Image from 'next/image';

interface SidebarInfo {
  id: string;
  username: string;
  profilePic: string;
  title: string;
  wallet: number;
  totalXp: number
}

interface SidebarProps {
  dashboard: boolean;
  sidebar: SidebarInfo;
  ShowSettings: boolean;
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedInUserId: (id: string) => void;
}

const SidebarRootUserProfile = styled.div<{isDashboard: boolean}>`
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 300ms ease;

    ${props => (props.isDashboard
      ?`
      @media (max-width: 1000px) {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 1;
        grid-column-end: 2;
        display: flex;
        flex-direction: column;
        position: relative;
        top: 5vh;
        transition: all 300ms ease;
      `
      : '')}
  }
  `;

  const SidebarRootStandard = styled.div<{isDashboard: boolean}>`
  grid-row-start: 1;
  grid-row-end: 4;
  grid-column-start: 2;
  grid-column-end: 3;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 4vh;
  transition: all 300ms ease;

  ${props => (props.isDashboard
    ? `
  @media (max-width: 1000px) {
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 1;
    grid-column-end: 2;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 300ms ease;
    }
    `
    : '')}
  `;
  
  const SidebarContainer = styled.div<{isDashboard: boolean}>`
  background: linear-gradient(169.75deg, rgba(255, 255, 255, 0) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.957018) 83.26%, rgba(154, 155, 211, 0.9) 136.85%);
  height: 95%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;

  ${props => (props.isDashboard
    ? `
      @media (max-width: 1000px) {
        height: 88%;
        width: 100%;
      }
    `
    : '')}
`;

const ProfileHeader = styled.div<{isDashboard: boolean}>`
  border-radius: 10px;
  background: rgba(5, 10, 39, 0.55);
  width: 80%;
  height: 40%;
  position: relative;
  top: 3vh;
  ${props => (props.isDashboard
    ? `
  @media (max-width: 1000px) {
    width: 93%;
    top: 1vh;
  }
  `
  : '')}
`;

const ProfileImage = styled.div`
  width: auto;
  margin: 2.5vh 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Username = styled.span<{isDashboard: boolean}>`
color: #FEFFFF;
font-family: var(--font-poppins);
font-size: 1.5rem;
font-style: normal;
font-weight: 400;
line-height: normal;
  ${props => (props.isDashboard
    ? `
    @media (max-width: 1000px) {
      position: relative;
      bottom: 6vh;
    }
  `
  : '')}
`;

const UserId = styled.span<{isDashboard: boolean}>`
  color: #FEFFFF;
  font-family: var(--font-poppins);
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  ${props => (props.isDashboard
    ? `
    @media (max-width: 1000px) {
      position: relative;
      bottom: 6vh;
    }
  `
  : '')}
`;

const Wallet = styled.div<{isDashboard: boolean}>`
  color: aliceblue;
  position: relative;
  top: 5vh;
  left: 0vw;
  margin: 30px;
  gap: 0.5rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => (props.isDashboard
    ? `
    @media (max-width: 1000px) {
      display: none;
    }
  `
  : '')}
`;

const WalletIcon = styled(FaGoogleWallet)`
  width: 50px;
  height: 50px;
`;

const WalletValue = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const Sidebar: React.FC<SidebarProps> = (props) => {

  const { ShowSettings, setLoggedInUserId } = props;
  const setShowEditProfile = props.setShowEditProfile;
  const isDashboard = props.dashboard;
  useEffect(() => {
    if (props.sidebar && props.sidebar.id) {
      const loggedInUserId = props.sidebar.id;
      setLoggedInUserId(loggedInUserId);
    }
  }, [props.sidebar, setLoggedInUserId]);

  const SidebarRoot = ShowSettings ? SidebarRootStandard : SidebarRootUserProfile;

  return (
        <SidebarRoot isDashboard={isDashboard}>
        <SidebarContainer isDashboard={isDashboard}>
          <ProfileHeader isDashboard={isDashboard}>
          <ProfileImage>
            {!ShowSettings ? (
              <Image src={props.sidebar.profilePic} alt="Profile" className={styles['profile-image']} />
            ) : (
            <Link href="/profile/statistics">
            <Image src={props.sidebar.profilePic} alt="Profile" className={styles['profile-image']} />
            </Link>
            )}
            <Username isDashboard={isDashboard}>{props.sidebar.username}</Username>
            {props.sidebar.title === 'Bronze' ? (
              <IoShieldSharp className='text-5xl text-amber-700' />
          ) : props.sidebar.title === 'Silver' ? (
            <GiRosaShield className='text-5xl text-gray-500' />
          ) : props.sidebar.title === 'Gold' ? (
            <GiBorderedShield className='text-5xl text-yellow-500' />
          ) : props.sidebar.title === 'Master' ? (
            <GiSkullShield className='text-5xl text-red-600' />
          ) : (
            null
          )}
            <UserId isDashboard={isDashboard}>
                {props.sidebar.title}
            </UserId>
          </ProfileImage>
        </ProfileHeader>
        <Wallet isDashboard={isDashboard}>
            <WalletIcon />
            <WalletValue>{props.sidebar.totalXp} XP </WalletValue>
        </Wallet>
        {ShowSettings ? <Settings setShowEditProfile={setShowEditProfile}/> : null}
        </SidebarContainer>
    </SidebarRoot>
  );
};

const mapStateToProps = (state: RootState) => 
{
  return {
    setLoggedInUserId: state.strings.loggedInUserId,
  };
};

const mapDispatchToProps = {
  setLoggedInUserId,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
