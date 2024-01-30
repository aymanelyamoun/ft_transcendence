"use client"

import React, { useEffect, useState } from 'react'
import styles from './friends.module.css'
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
 
import { PiHandshakeBold } from "react-icons/pi";
import { FaHandshakeAltSlash } from "react-icons/fa";
import styled from 'styled-components';
import Image from 'next/image';
import { connect } from 'react-redux';
import { toggleSearchFetch } from '@/features/booleans/booleanActions';
import {useDispatch } from 'react-redux';
import { AlertMessage } from '@/app/components/alertMessage';

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
    color: #fff;
    margin-left: auto;
    margin-right: 1vw;
`;

const UserInfoContainer = styled.div`
position: relative;
display: flex;
flex-direction: column;
justify-content: center;
flex-wrap: nowrap;
align-items: center;
`;

const FriendRequestItem: React.FC<FriendRequestItemProps> = (props) => {
  const dispatch = useDispatch();

  const fetchAcceptRequest = async (props: FriendRequestItemProps) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}request/accept/${props.id}`,
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
          dispatch(toggleSearchFetch());
      }
  } catch (error) {
    }
  };

  const fetchRefuseRequest = async (props: FriendRequestItemProps) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}request/refuse/${props.id}`,
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
        props.setfriendRequests(data);
      }
  } catch (error) {
    }
  };
  return (
    <div className={styles['friendReqItem']}>
        <div className={styles['friendReq-image']}>
            <Image src={props.profilePic} alt="Profile" className="rounded-lg" />
        </div>
        <UserInfoContainer>
        <div className={styles['friendReq-name']}>
            <span className={styles['friendReq-name']}>{props.title}</span>
        </div>
        <div className={styles['friendReqSent']}>
                <span className={styles['friendReqSent']}>{props.discription}</span>
        </div>
        </UserInfoContainer>
                <ButtonsContainer>
                  <button className={styles['friendReqAccept']} onClick={ () => fetchAcceptRequest(props)}><FcOk /></button>
                  <button className={styles['friendReqDecline']} onClick={ () => fetchRefuseRequest(props)}><FcCancel /></button>
                </ButtonsContainer>
    </div>
  );
};

export default FriendRequestItem;