// import AddChannelSearchBar from '@/app/chat/components/AddChannelSearchBar';
// import AddChannelSearchBar from "../../../../../app/chat/components/AddChannelSearchBar";
// import AddChannelSearchBar from "@/app/chat/components/AddChannelSearchBar";
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

interface SearchU {
  id: number;
  username: string;
  profilePic: string;
  isBlocked: boolean;
  group: boolean;
  groupMembers?: string[];
}

interface SearchModalProps {
    searchUsers: SearchU[];
    setSearchUsers: React.Dispatch<React.SetStateAction<SearchU[]>>;
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

const SearchModal : React.FC<SearchModalProps> = ({ onClose, searchUsers , setSearchUsers}) => {
    const [friendSearch, setFriendSearch] = useState<SearchU[]>(searchUsers);
    const cancelAddChannel = useRef<HTMLDivElement>(null);
    const [addChannelSearch, setAddChannelSearch] = useState<boolean>(false);
    const [ChannelFriendSearch, setChannelFriendSearch] = useState<SearchU[]>(searchUsers);

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
                        {friendSearch.map((friend) => (
                        <ResultItem key={friend.id}
                            id={friend.id}
                            username={friend.username}
                            profilePic={friend.profilePic}
                            isBlocked={friend.isBlocked}
                            group={friend.group}
                            groupMembers={friend.groupMembers}
                            setSearchUsers={setSearchUsers}    
                        />
                        ))}
                  </ResultList>
              </div>
          </div>
        </>
    )
};

export default SearchModal;