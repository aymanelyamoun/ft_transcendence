"use client"

import SearchFriends from "../SearchFriends/SearchFriends";
import React, {useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
// import avatar from '../../../../../../public/garou-kid.jpeg';
import avatar from "../../../../../../../public/garou-kid.jpeg";
import jake from '../../../../../../../public/jakeWithHeadPhones.jpg';
import { StaticImageData } from 'next/image'
import ResultItem from './ResultItem';
import { Backend_URL } from "@/lib/Constants";
import { on } from "events";
import { SearchU } from "../SearchFriends/SearchFriends";

// interface SearchU {
//     id: string;
//     username?: string;
//     channelName?:string;
//     profilePic?: string;
//     channelPic?: string;
//     isBlocked: boolean;
//     group: boolean;
//     Members?: string[];
// }

interface SearchModalProps {
    searchUsers: SearchU[];
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
    setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
    ChannelFriendSearch: SearchU[];
    onClose: (isOpen: boolean) => void;
}


  const ResultList = styled.div`
  flex: 1; // Fills remaining space vertically
  display: flex;
  flex-direction: column; // Stack results vertically
  align-items: center;
  border-top-left-radius: 10px; // Matches Tailwind rounded-t-[10px]
  height: 750px; // Same height as Tailwind h-[750px]
  overflow-y: auto; // Scroll if needed
`;

const SearchModal : React.FC<SearchModalProps> = ({ onClose, searchUsers , setSearchUsers, ChannelFriendSearch, setChannelFriendSearch}) => {
    const [friendSearch, setFriendSearch] = useState<SearchU[]>(searchUsers);
    const cancelAddChannel = useRef<HTMLDivElement>(null);
    const [addChannelSearch, setAddChannelSearch] = useState<boolean>(false);

    const handleCancelAddChannel = (event: any) => {
        if (cancelAddChannel.current && !cancelAddChannel.current.contains(event.target)) {
            onClose(false);
        }
    };

    return (
        <>
        <div onClick={handleCancelAddChannel} className=" addChannelOverlay flex justify-center items-center ">
            <div ref={cancelAddChannel} id="AddchannelContainer" className="addChannelModaloumad flex justify-between rounded-[10px] ">
                <ResultList>
                        <SearchFriends addChannelSearch={addChannelSearch} setAddChannelSearch={setAddChannelSearch} setChannelFriendSearch={setChannelFriendSearch} setFriendSearch={setFriendSearch}/>
                        {[...friendSearch, ...ChannelFriendSearch].map((friend) => (
                        <ResultItem key={friend.id}
                            id={friend.id}
                            channelName={friend.channelName}
                            channelPic={friend.channelPic}
                            isBlocked={friend.isBlocked}
                            group={friend.group}
                            Members={friend.Members}
                            setSearchUsers={setSearchUsers}
                            setChannelFriendSearch={setChannelFriendSearch} 
                        />
                        ))}
                  </ResultList>
              </div>
          </div>
        </>
    )
};

export default SearchModal;