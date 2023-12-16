import React from 'react'
import Image from 'next/image'
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Friend, friendsData} from '../../../../../../app/chat/page';
import searchBarInAddChannel from "../../../../public/iconSearchInAddChannel.png";
// import { Friend, friendsData} from '../../../../app/(notRoot)/chat/page';
// import searchBarInAddChannel from "../../../../public/iconSearchInAddChannel.png";
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  top: 2vh;
  margin: 0 auto;
  // display: flex;
  width: 50%;
  height: 5vh;
  width: 50%;
  display: flex;
  margin-left: auto;
`;


interface FriendListProps {
  // setFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
  addChannelSearch: boolean;
  setAddChannelSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const SearchFriends = ({addChannelSearch, setAddChannelSearch,setChannelFriendSearch}: FriendListProps) => {

  // const SearchBar = useRef<HTMLDivElement>(null);
  const SearchIcon = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState<string>('');


  useEffect(() => {
      const handleClickOutside = (event: any) => {

       if (!SearchIcon.current?.contains(event.target)) {
          setAddChannelSearch(false);
        }

    }
      const AddchannelContainer = document.getElementById("AddchannelContainer");

      AddchannelContainer?.addEventListener("click", handleClickOutside);

    return () => {
      AddchannelContainer?.removeEventListener("click", handleClickOutside);
    };

    }, [])


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {

    const filteredFriends = friendsData.filter((friend) => {
      return friend.name.toLowerCase().startsWith(e.target.value.toLowerCase());
    });
    console.log("filteredFriends : ", filteredFriends);
    setSearchText(e.target.value);
    setChannelFriendSearch(filteredFriends);
  };

return ( 
       <SearchContainer>
          <input type="text" className="seachBarAddChannel flex " 
         value={searchText}
         onChange={handleInputChange}
         />
        </SearchContainer>
)
}

export default SearchFriends;