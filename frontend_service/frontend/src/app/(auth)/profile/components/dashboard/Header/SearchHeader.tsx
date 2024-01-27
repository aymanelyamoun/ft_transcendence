"use client"

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchModal from './SearchModal';
import { BsSearch } from "react-icons/bs";
 
import { SearchU } from '../interfaces';


const SearchInput = styled.input`
flex: 1;
padding: 0.5rem;
border: none;
border-radius: 0.5rem;
outline: none;
`;

const SearchButton = styled.button`
background-color: #fff;
border: none;
outline: none;
cursor: pointer;
`;

const SearchHeaderContainer = styled.div`
display: flex;
align-items: center;
border-radius: 50%;
margin-top: 0.5rem;
padding: 0.8rem;
border: 1px solid rgba(40, 44, 78, 1);
background-color: rgba(40, 44, 78, 1);
cursor: pointer;
`;

const SearchIcon = styled(BsSearch)`
color: aliceblue;
font-size: 3vh;
cursor: pointer;
`;


// const SearchModal = styled.div`

// `;

interface SearchHeaderProps {
    onSearch : (query: string) => void;
    onClose: () => void;
    searchUsers: SearchU[];
}


const SearchHeader = () => {
    const [SearchUsers, setSearchUsers] = useState<SearchU[]>([]);
    const [ChannelFriendSearch, setChannelFriendSearch] = useState<SearchU[]>([]);
    const [query, setQuery] = useState('');
    const [ShowModal, setShowModal] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    
    const handleSearch = (e: React.FormEvent) => {
        setShowModal(true);
        setisLoading(true);
        // fetchUsers();
    };

    const fetchUsers = async () => {
        try {
          const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL + "user/all", {
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
            setSearchUsers(data);
          }else {
            // alert("Error fetching data: ");
            console.error("Error fetching data: ", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setisLoading(false); }
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
            console.log("requested search channels : ",data);
            setChannelFriendSearch(data);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setisLoading(false);
        }
      };
    
      useEffect(() => {
        fetchUsers();
        fetchChannel('all');
      }, []);

      useEffect(() => {
        console.log("ChannelFriendSearch: ",ChannelFriendSearch);
      });
    
    return (
        <>
        <SearchHeaderContainer onClick={handleSearch}>
            <SearchIcon onClick={fetchUsers}/>
        </SearchHeaderContainer>
        {ShowModal && !isLoading && (
        <SearchModal
          onClose={() => setShowModal(false)}
          searchUsers={SearchUsers}
          setSearchUsers={setSearchUsers}
          ChannelFriendSearch={ChannelFriendSearch}       
          setChannelFriendSearch={setChannelFriendSearch}
        />
      )}
    </>
  );
};

export default SearchHeader;