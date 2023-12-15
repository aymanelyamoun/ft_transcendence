// Sidebar.tsx
import React from 'react';
import styles from './sidebar.module.css'; // Update the import if needed
declare module '@iconscout/react-unicons';
import picture from '../../../imgs/aoumad.jpeg';
import { UilSetting } from '@iconscout/react-unicons';
import { FaGoogleWallet } from 'react-icons/fa';
import Settings from '../Settings/Settings';
import styled from 'styled-components';

interface SidebarInfo {
  id: string;
  username: string;
  profilePic: string;
  title: string;
  wallet: number;
  online: boolean;
}

interface SidebarProps {
  sidebar: SidebarInfo;
  // onSidebarItemClick: (id: string) => void;
}

const SidebarRoot = styled.div`
  grid-row-start: 1;
  grid-row-end: 4;
  grid-column-start: 2;
  grid-column-end: 3;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 5.4vh;
  transition: all 300ms ease;
  `;
  
  const SidebarContainer = styled.div`
  background: linear-gradient(169.75deg, rgba(255, 255, 255, 0) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.957018) 83.26%, rgba(154, 155, 211, 0.9) 136.85%);
  padding-bottom: 30vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileHeader = styled.div`
  border-radius: 10px;
  background: rgba(5, 10, 39, 0.55);
  width: 80%;
  position: relative;
  top: 3vh;
  left: 0%;
  right: 20%;
  padding-bottom: 8.215rem;
`;

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
        <SidebarRoot>
        <SidebarContainer>
          <ProfileHeader>
          <div className={styles['profile-image']}>
            <img src={props.sidebar.profilePic} alt="Profile" className={styles['profile-image']} />
            <span className={styles.username}>{props.sidebar.username}</span>
            <span className={styles['user-id']}>{props.sidebar.title}</span>
          </div>
        </ProfileHeader>
        <div className={styles.wallet}>
              <FaGoogleWallet />
              <span className={styles['wallet-value']}>{props.sidebar.wallet}</span>
        </div>
            <div className={styles['settings-container']}>
            <Settings />
            </div>
        </SidebarContainer>
    </SidebarRoot>
  );
};

export default Sidebar;
