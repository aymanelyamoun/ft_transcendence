"use client"

import React, {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import { IoMdPersonAdd } from "react-icons/io";
 
import { CgUnblock } from "react-icons/cg";
import { BsFillPersonCheckFill } from "react-icons/bs";
import Link from 'next/link';
import { SearchU } from '../interfaces';
import Image from 'next/image';
import { AlertMessage } from '@/app/components/alertMessage';

interface FriendComponentProps {
    id: string;
    username?: string;
    isBlocked: boolean;
    profilePic: string;
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
}

const FriendImage = styled.div`
    width: 3.4rem;
    height: 3rem;
    position: relative;
    bottom: 0.2rem;
    right: 0.4rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    border-radius: 50%;
    pointer: cursor;
`;

const FriendName = styled.div`
    font-family: "Inter", sans-serif;
    font-weight: 800;
    font-size: 20px;
    font-weight: bold;
    color: aliceblue;
    align-self: flex-start;
    margin-left: 16px;
    margin-top: 10px;
`;

const AddFriendButton = styled.button`
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

const UnblockButton = styled.button`
    position: relative;
    // left: 13vw;
    margin-left: auto;
    margin-right: 1vw;
    top: 0vh;
    svg {
        font-size: 1.5rem;
        color: red;
    }
`;

const FriendComponent: React.FC<FriendComponentProps> = (props) => {

    const [UserAdded, setUserAdded] = useState<boolean>(false);
    const [UserUnblocked, setUserUnblocked] = useState<boolean>(false);
    const [showAlertUnblock, setShowAlertUnblock] = useState<boolean>(false);
    const [showRequestSent, setShowRequestSent] = useState<boolean>(false);

    const SendRequest = async (props: FriendComponentProps) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}request/send/${props.id}`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
            });
            if(response.ok){
                setShowRequestSent(true);
                setUserAdded(true);
            }
        } catch (error) {
            console.log(error);
        };
    };

    
    
    const UnblockFriend = async (props: FriendComponentProps) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}request/deblock/${props.id}`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
            });
            if(response.ok){
                fetchIcon();
                setUserUnblocked(true);
                setShowAlertUnblock(true);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const fetchIcon = useCallback(async () => {
        try
        {
            const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL + "user/all", {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
            });
            if(res.ok){
                const data = await res.json() as SearchU[];
                props.setSearchUsers(data);
            }
        }
        catch(error)
        {
            console.log(error);
        }
    },[props]);
    
    useEffect(() => {
        fetchIcon();
    }, [props.setSearchUsers, fetchIcon]);
  return (
    <>
        <Link href={`/profile/FriendProfile?username=${props.username}`}>
        <FriendImage>
            <Image src={props.profilePic} alt="Profile" className="rounded-full" />
        </FriendImage>
        </Link>
        <FriendName>
            <span>{props.username}</span>
        </FriendName>
        {props.isBlocked && !UserUnblocked ? (
        <UnblockButton onClick={() => UnblockFriend(props)}>
            <CgUnblock />
        </UnblockButton>
        ) : (
        <AddFriendButton onClick={() => SendRequest(props)}>
            {UserAdded ? (
                <BsFillPersonCheckFill />
            ) : (
            <IoMdPersonAdd /> )}
        </AddFriendButton>
        )}
        {
            showAlertUnblock && (<AlertMessage onClick={() => setShowAlertUnblock(false)} message={"The user has been Unblocked!"} type='notify'/>)
        }
        {
            showRequestSent && (<AlertMessage onClick={() => setShowRequestSent(false)} message={"The request has been sent successfully!"} type='notify'/>)
        }
    </>
  )
}

export default FriendComponent;