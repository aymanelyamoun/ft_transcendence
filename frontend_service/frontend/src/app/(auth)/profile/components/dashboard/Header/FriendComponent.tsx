import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/image'
import AddFriend from '@/app/(auth)/chat/components/AddFriend';
import { IoMdPersonAdd } from "react-icons/io";
import { Backend_URL } from '@/lib/Constants';
import { CgUnblock } from "react-icons/cg";
import { BsFillPersonCheckFill } from "react-icons/bs";

interface SearchU {
    id: number;
    username: string;
    profilePic: string;
    isBlocked: boolean;
    group: boolean;
    groupMembers?: string[];
  }

interface FriendComponentProps {
    id: number;
    username: string;
    isBlocked: boolean;
    profilePic: string;
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
}

const FriendImage = styled.div`
    width: 3.4rem;
    height: 3rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    border-radius: 50%;
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
                setUserAdded(true);
            }else {
               alert("the request has not been sent");
              }
        } catch (error) {
            console.log(error);
        };
    };

    
    
    const UnblockFriend = async (props: FriendComponentProps) => {
        try {
            console.log(props.id);
            const response = await fetch(`${Backend_URL}request/deblock/${props.id}`, {
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
                alert("the user has been unblocked");
            }else {
               alert("the user has not been unblocked");
              }
        } catch (error) {
            console.log(error);
        }
    };
    
    const fetchIcon = async () => {
        try
        {
            const res = await fetch( Backend_URL + "user/all", {
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
                console.log(props.isBlocked);
                // console.log(data);
            }
        }
        catch(error)
        {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchIcon();
    }, [props.setSearchUsers]);

  return (
    <>
        <FriendImage>
            <img src={props.profilePic} alt="Profile" className="rounded-full" />
        </FriendImage>
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
    </>
  )
}

export default FriendComponent;