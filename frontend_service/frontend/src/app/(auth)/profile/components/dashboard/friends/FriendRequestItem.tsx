import React, { useEffect } from 'react'
import styles from './friends.module.css'
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { Backend_URL } from '@/lib/Constants';
import { PiHandshakeBold } from "react-icons/pi";
import { FaHandshakeAltSlash } from "react-icons/fa";
import styled from 'styled-components';

interface FriendR
{
  id: string;
  title: string;
  // sender: {
    profilePic: string;
  // };
  discription: string;
}


interface FriendRequestItemProps {
  id: string;
  title: string;
  // sender: {
    profilePic: string;
  // };
  discription: string;
  setfriendRequests: any;
}

const ButtonsContainer = styled.div`

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 0.5vh;
  color: #fff;
  margin-left: auto;
  margin-right: 1vw;
`;

const FriendRequestItem: React.FC<FriendRequestItemProps> = (props) => {

  const [officiallyFriends, setOfficiallyFriends] = React.useState(false);
  const [NotFriends, setNotFriends] = React.useState(false);

  const fetchAcceptRequest = async (props: FriendRequestItemProps) => {
    try {
      const res = await fetch(`${Backend_URL}request/accept/${props.id}`,
        {
          method: 'POST',
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
      });
      if(res.ok){
          const data = await res.json();
          props.setfriendRequests(data);
          setOfficiallyFriends(true);
          alert("the accept request has been sent");
      }else {
         alert("the accept request has not been sent");
        }
  } catch (error) {
      console.log(error);
    }
  };

  const fetchRefuseRequest = async (props: FriendRequestItemProps) => {
    try {
      const res = await fetch(`${Backend_URL}request/refuse/${props.id}`,
        {
          method: 'POST',
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
      });
      if(res.ok){
        const data : FriendR[] = await res.json();
        console.log(data);
        props.setfriendRequests(data);
        setNotFriends(true);
          alert("the refuse request has been sent");
      }else {
         alert("the refuse request has not been sent");
        }
  } catch (error) {
      console.log(error);
    }
  };

  // return (
  //   <div className={styles['friendReqItem']}>
  //       <div className={styles['friendReq-image']}>
  //           <img src={props.profilePic} alt="Profile" className="rounded-lg" />
  //       </div>
  //       <div className={styles['friendReq-name']}>
  //           <span className={styles['friendReq-name']}>{props.title}</span>
  //       </div>
  //       <div className={styles['friendReqSent']}>
  //               <span className={styles['friendReqSent']}>{props.discription}</span>
  //       {officiallyFriends ? (
  //         <HanshakeButton>
  //           <PiHandshakeBold />
  //         </HanshakeButton>
  //       ) : (
  //         NotFriends ? (
  //           <NoFriendsButton>
  //             <FaHandshakeAltSlash />
  //           </NoFriendsButton>
  //         ) : (
  //           <div>
  //             <button className={styles['friendReqAccept']} onClick={() => fetchAcceptRequest(props)}><FcOk /></button>
  //             <button className={styles['friendReqDecline']} onClick={() => fetchRefuseRequest(props)}><FcCancel /></button>
  //           </div>
  //         )
  //       )}
  //               </div>
  //   </div>
  // );
  return (
    <div className={styles['friendReqItem']}>
        <div className={styles['friendReq-image']}>
            <img src={props.profilePic} alt="Profile" className="rounded-lg" />
        </div>
        <div className={styles['friendReq-name']}>
            <span className={styles['friendReq-name']}>{props.title}</span>
        </div>
        <div className={styles['friendReqSent']}>
                <span className={styles['friendReqSent']}>{props.discription}</span>
        </div>
                <ButtonsContainer>
                  <button className={styles['friendReqAccept']} onClick={ () => fetchAcceptRequest(props)}><FcOk /></button>
                  <button className={styles['friendReqDecline']} onClick={ () => fetchRefuseRequest(props)}><FcCancel /></button>
                </ButtonsContainer>
    </div>
  );
};

export default FriendRequestItem;