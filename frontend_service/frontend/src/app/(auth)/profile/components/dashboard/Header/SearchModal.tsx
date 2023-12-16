// import AddChannelSearchBar from '@/app/chat/components/AddChannelSearchBar';
// import AddChannelSearchBar from "../../../../../app/chat/components/AddChannelSearchBar";
// import AddChannelSearchBar from "@/app/chat/components/AddChannelSearchBar";
import SearchFriends from "../SearchFriends/SearchFriends";
import React, {useState, useRef } from 'react'
import styled from 'styled-components';
// import avatar from '../../../../../../public/garou-kid.jpeg';
import avatar from "../../../../../../../public/garou-kid.jpeg";
import jake from '../../../../../../../public/jakeWithHeadPhones.jpg';
import { StaticImageData } from 'next/image'
import ResultItem from './ResultItem';

interface SearchU {
  id: number;
  username: string;
  // Change "profilePic" to the actual type of the data being passed
  // e.g., string or StaticImageData
  profilePic: string;
  group: boolean;
  groupMembers?: string[];
}

interface SearchModalProps {
    onSearch: (query: string) => void;
    onClose: () => void;
    searchUsers: SearchU[];
}


// const friendsData: Friend[] = [
//     {
//       id: 1,
//       name: 'Anas',
//       profilePic: avatar,
//         group: false,
//     },
//     {
//       id: 2,
//       name: 'Abdo',
//       profilePic: avatar,
//         group: false,
//     },
//     {
//       id: 3,
//       name: 'Aymane',
//       profilePic: avatar,
//       group: true,
//       groupMembers: [avatar, jake, avatar, jake, avatar],
//     },
//     {
//       id: 4,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 5,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 6,
//       name: 'Aymane',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 7,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 8,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 9,
//       name: 'Aymane',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 10,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 11,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 12,
//       name: 'Aymane',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 13,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 14,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 15,
//       name: 'Aymane',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 16,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 17,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 18,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 19,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 20,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 21,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 22,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 23,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//     {
//       id: 24,
//       name: 'Snowa',
//       profilePic: avatar,
//       group: false,
//     },
//     {
//       id: 25,
//       name: 'Oussama',
//       profilePic: jake,
//       group: false,
//     },
//   ];

  const ResultList = styled.div`
  flex: 1; // Fills remaining space vertically
  display: flex;
  flex-direction: column; // Stack results vertically
  align-items: center;
  border-top-left-radius: 10px; // Matches Tailwind rounded-t-[10px]
  height: 750px; // Same height as Tailwind h-[750px]
  overflow-y: auto; // Scroll if needed
`;


const SearchModal: React.FC<SearchModalProps> = ({ onSearch, onClose, searchUsers }) => {
    const [friendSearch, setFriendSearch] = useState<SearchU[]>(searchUsers);
    const cancelAddChannel = useRef<HTMLDivElement>(null);
    const [addChannelSearch, setAddChannelSearch] = useState<boolean>(false);
    const [ChannelFriendSearch, setChannelFriendSearch] = useState<SearchU[]>(searchUsers);

    const handleCancelAddChannel = (event: any) => {
        if (cancelAddChannel.current && !cancelAddChannel.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <>
        <div onClick={handleCancelAddChannel} className=" addChannelOverlay flex justify-center items-center ">
            <div ref={cancelAddChannel} id="AddchannelContainer" className="addChannelModal flex justify-between rounded-[10px] ">
                {/* <div className=" px-40 pt-4"> */}
                <ResultList>
                    {/* <div className="scrollbar flex flex-col items-center rounded-t-[10px] h-[750px] overflow-y-auto "> */}
                        <SearchFriends addChannelSearch={addChannelSearch} setAddChannelSearch={setAddChannelSearch} setChannelFriendSearch={setChannelFriendSearch} setFriendSearch={setFriendSearch}/>
                        {friendSearch.map((friend) => (
                        <ResultItem key={friend.id}
                            id={friend.id}
                            username={friend.username}
                            profilePic={friend.profilePic}
                            group={friend.group}
                            groupMembers={friend.groupMembers}          
                        />
                        ))}
                     {/* </div> */}
                  </ResultList>
              </div>
          </div>
        </>
    )
};

export default SearchModal;