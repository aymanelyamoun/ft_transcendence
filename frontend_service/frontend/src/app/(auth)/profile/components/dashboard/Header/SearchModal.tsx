"use client"

import SearchFriends from "../SearchFriends/SearchFriends";
import React, {useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
// import avatar from '../../../../../../public/garou-kid.jpeg';
import avatar from "../../../../../../../public/garou-kid.jpeg";
import jake from '../../../../../../../public/jakeWithHeadPhones.jpg';
import { StaticImageData } from 'next/image'
import ResultItem from './ResultItem';
import { on } from "events";
import { SearchU } from "../interfaces";
import styles from './search.module.css';
import { GiAstronautHelmet } from "react-icons/gi";
// import { SearchU } from "../SearchFriends/SearchFriends";

interface SearchModalProps {
    searchUsers: SearchU[];
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
    setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
    ChannelFriendSearch: SearchU[];
    onClose: (isOpen: boolean) => void;
}


const ResultList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 10px;
    height: 50vh;
    overflow-y: auto;
    justify-content: flex-start;
    align-items: center;
`;

const NoGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 15vh;
  color: #fff;
`;

const NoGroupIcon = styled.div`
  font-size: 11vh;
  color: #fff;
`;

const NoGroupSpan = styled.span`
font-size: 3vh;
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
          <div onClick={handleCancelAddChannel} className="addChannelOverlay flex justify-center items-center">
            <div ref={cancelAddChannel} id="AddchannelContainer" className={styles['addChannelModaloumad']}>
              <ResultList>
                  <SearchFriends addChannelSearch={addChannelSearch} setAddChannelSearch={setAddChannelSearch} setChannelFriendSearch={setChannelFriendSearch} setFriendSearch={setFriendSearch} />
                {[...friendSearch, ...ChannelFriendSearch].map((friend) => (
                  <ResultItem
                    key={friend.id}
                    id={friend.id}
                    username={friend.username}
                    profilePic={friend.profilePic}
                    channelName={friend.channelName}
                    channelPic={friend.channelPic}
                    channelType={friend.channelType}
                    isBlocked={friend.isBlocked}
                    group={friend.group}
                    members={friend.members}
                    banedUsers={[]}
                    setSearchUsers={setSearchUsers}
                    setChannelFriendSearch={setChannelFriendSearch}
                  />
                ))}
              </ResultList>
            </div>
          </div>
        </>
      );
};

export default SearchModal;