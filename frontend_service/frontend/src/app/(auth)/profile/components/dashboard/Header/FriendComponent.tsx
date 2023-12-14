import React, {useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import AddFriend from '@/app/chat/components/AddFriend';
import { IoMdPersonAdd } from "react-icons/io";
import { Backend_URL } from '@/lib/Constants';

interface FriendComponentProps {
    id: number;
    username: string;
    profilePic: string;
}

const FriendImage = styled.div`
    width: 3.4rem;
    height: 3rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    border-radius: 50%;
// img{
    
// }
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

const FriendComponent: React.FC<FriendComponentProps> = (props) => {

    const SendRequest = async (props: FriendComponentProps) => {
        try {
            console.log(props.id);
            const response = await fetch(`${Backend_URL}request/send/${props.id}`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
            });
            if(response.ok){
                alert("the request has been sent");
            }else {
               alert("the request has not been sent");
              }
        } catch (error) {
            console.log(error);
        };
    };
  return (
    <>
        <FriendImage>
            <img src={props.profilePic} alt="Profile" className="rounded-full" />
        </FriendImage>
        <FriendName>
            <span>{props.username}</span>
        </FriendName>
        <AddFriendButton onClick={() => SendRequest(props)}>
            <IoMdPersonAdd />
        </AddFriendButton>
    </>
  )
}

export default FriendComponent