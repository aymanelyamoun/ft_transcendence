<<<<<<< HEAD
"use client"

import React from 'react'
=======

>>>>>>> origin/chat_front
import Image from 'next/image'
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import searchBarInAddChannel from "../../../../../public/iconSearchInAddChannel.png";
import { Friend } from "../page";

interface FriendListProps {
  // setFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
  addChannelSearch: boolean;
  setAddChannelSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
  friendsList : Friend[];
}

const AddChannelSearchBar = ({addChannelSearch, setAddChannelSearch,setChannelFriendSearch, friendsList}: FriendListProps) => {

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

    const filteredFriends = friendsList.filter((friend) => {
      return friend.username.toLowerCase().startsWith(e.target.value.toLowerCase());
    });
    // console.log("filteredFriends : ", filteredFriends);
    setSearchText(e.target.value);
    setChannelFriendSearch(filteredFriends);
  };

  return ( 
      <div className='ml-auto flex items-center' ref={SearchIcon}>
        <div   onClick={() => setAddChannelSearch(true)}   className={` ${addChannelSearch ? 'hidden': ''} mr-[12px] cursor-pointer`}>
        {/* <BsSearch size={22}/> */}
            <Image  className='addChannelSearchIcon flex items-end' src={searchBarInAddChannel} alt="searchBar"  width={22} height={22} ></Image>
        </div> 
        { addChannelSearch &&

           <div className="m-[10px] flex ml-auto z-1000">
              <input type="text" className="seachBarAddChannel flex " 
             value={searchText}
             onChange={handleInputChange}
             />
            </div>
        }
      </div>
  )
}

export default AddChannelSearchBar