import React, { useEffect } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { MdGroupAdd } from "react-icons/md";

interface FriendInfoProps {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
}

const InfoName = styled.div`
  font-weight: 800;
  font-size: 2vh;
  font-family: "Inter", sans-serif;
  margin-left: 1rem;
  color: aliceblue;
  position: relative;
  top: initial;
  right: 0.5rem;
  margin-top: -10.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddGroupButton = styled.button`
  position: relative;
  // left: 13vw;
  margin-left: auto;
  margin-right: 1vw;
  top: 0vh;
  svg {
      font-size: 1.5rem;
      color: aliceblue;
  }

`;

const FriendInfo = React.forwardRef<HTMLDivElement, FriendInfoProps>((props, ref) => {
  useEffect(() => {
    console.log("FriendInfo Mounted:", props.id, props.username, props.profilePic);

    // Clean-up function (optional)
    return () => {
      console.log("FriendInfo Unmounted");
    };
  }, [props.id, props.username, props.profilePic]);

  return (
  <div className=" addChannelOverlay flex justify-center items-center ">
    <div ref={ref} className={styles['info-container']}>
      <div className={styles['info-picture']}>
        <img src={props.profilePic} alt={props.username} className={styles['info-picture']}/>
      </div>
      <InfoName>
        <span >Snouae</span>
      </InfoName>
      <AddGroupButton>
        <MdGroupAdd />
      </AddGroupButton>
    </div>
  </div>
  );
});

export default FriendInfo;