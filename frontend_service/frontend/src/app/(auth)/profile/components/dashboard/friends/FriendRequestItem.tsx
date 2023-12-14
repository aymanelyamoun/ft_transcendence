import React, { useEffect } from 'react'
import styles from './friends.module.css'
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { Backend_URL } from '@/lib/Constants';

interface FriendRequestItemProps {
  id: string;
  title: string;
  // profilePic: string;
  discription: string;
  acceptRequest: (id: string) => void;
  refuseRequest: (id: string) => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = (props) => {

  const fetchAcceptRequest = async (props: FriendRequestItemProps) => {
    try {
      const response = await fetch(`${Backend_URL}request/accept/${props.id}`,
        {
          method: 'POST',
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
      });
      if(response.ok){
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
      const response = await fetch(`${Backend_URL}request/refuse/${props.id}`,
        {
          method: 'POST',
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
      });
      if(response.ok){
          alert("the refuse request has been sent");
      }else {
         alert("the refuse request has not been sent");
        }
  } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptRequest = () => {
    props.acceptRequest(props.id);
  };

  const handleRefuseRequest = () => {
    props.refuseRequest(props.id);
  };
  return (
    <div className={styles['friendReqItem']}>
        <div className={styles['friendReq-image']}>
        <img alt="Profile" className="rounded-lg" />
            {/* <img src={props.picture} alt="Profile" className="rounded-lg" /> */}
        </div>
        <div className={styles['friendReq-name']}>
            <span className={styles['friendReq-name']}>{props.title}</span>
        </div>
        <div className={styles['friendReqSent']}>
                <span className={styles['friendReqSent']}>{props.discription}</span>
                <button className={styles['friendReqAccept']} onClick={ () => fetchAcceptRequest(props)}><FcOk /></button>
                <button className={styles['friendReqDecline']} onClick={ () => fetchRefuseRequest(props)}><FcCancel /></button>
        </div>
    </div>
  );
};

export default FriendRequestItem;