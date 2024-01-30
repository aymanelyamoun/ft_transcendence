"use client"
import React from 'react'
import Image from 'next/image'
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Friend} from '../../../../chat/page';
import searchBarInAddChannel from "../../../../public/iconSearchInAddChannel.png";
// import { Friend, friendsData} from '../../../../app/(notRoot)/chat/page';
// import searchBarInAddChannel from "../../../../public/iconSearchInAddChannel.png";
import styled from 'styled-components';
 
import SearchHeader from '../Header/SearchHeader';
import ResultItem from '../Header/ResultItem';
import { channel } from 'diagnostics_channel';
import { SearchU } from '../interfaces';
import { toggleSearchFetch } from '@/features/booleans/booleanActions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const SearchContainer = styled.div`
  position: relative;
  top: 1vh;
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;


interface FriendListProps {
  setChannelFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
  setFriendSearch: React.Dispatch<React.SetStateAction<SearchU[]>>;
}


const SearchFriends = ({setChannelFriendSearch , setFriendSearch}: FriendListProps) => {

  const [searchText, setSearchText] = useState<string>('');
  const dispatch = useDispatch();
  const activeFetch = useSelector((state: RootState) => state.booleans.activeFetch);

  const Searchusers = async (username: string) => {
    try {
      const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"user/"+username, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        const data = await res.json() as SearchU[];
        setFriendSearch(data);
      }
    } catch (error) {
    }
  };

  const fetchChannel = async (channelName: string) => {
    try {
      const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"channels/search/"+channelName, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        const data = await res.json() as SearchU[];
        setChannelFriendSearch(data);
      }
    } catch (error) {
    }
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
   let username : string = e.target.value;
    username = username.trim();
    if (username)
    {
      Searchusers('search/'+username);
      fetchChannel(username);
    }
      
    else
    {
      // Searchusers('all');
      dispatch(toggleSearchFetch());
      fetchChannel('all');
    }
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "user/all", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          const data = await res.json() as SearchU[];
          setFriendSearch(data);
        }
      } catch (error) {
      }
    };
  fetchUsers();
  }, [activeFetch, setFriendSearch])

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