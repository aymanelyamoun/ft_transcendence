import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchModal from './SearchModal';
import { BsSearch } from "react-icons/bs";
import { Backend_URL } from '@/lib/Constants';


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
font-size: 2rem;
cursor: pointer;
`;

// const SearchModal = styled.div`

// `;

interface SearchU
{
    id: number;
    username: string;
    profilePic: string;
    isBlocked: boolean; 
    group: boolean;
    groupMembers?: string[];
}

interface SearchHeaderProps {
    onSearch : (query: string) => void;
    onClose: () => void;
    searchUsers: SearchU[];
}


const SearchHeader = () => {
    const [SearchUsers, setSearchUsers] = useState<SearchU[]>([]);
    const [query, setQuery] = useState('');
    const [ShowModal, setShowModal] = useState(false);
    
    const handleSearch = (e: React.FormEvent) => {
        setShowModal(true);
        // fetchUsers();
    };

    const fetchUsers = async () => {
        try {
          const res = await fetch( Backend_URL + "user/all", {
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
            console.log(data);
            setSearchUsers(data);
          }else {
            alert("Error fetching data: ");
            console.error("Error fetching data: ", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      useEffect(() => {

        fetchUsers();
      }, []);

    
    return (
        <>
        <SearchHeaderContainer onClick={handleSearch}>
            <SearchIcon onClick={fetchUsers} />
        </SearchHeaderContainer>
        {ShowModal ? (
            // <SearchModal onSearch={onSearch} onClose={() => setShowModal(false)} searchUsers={searchUsers}/>
            <SearchModal onClose={setShowModal} searchUsers={SearchUsers} setSearchUsers={setSearchUsers}/>
        ) : null}
        </>
        // {showModal && <SearchModal onSearch={onSearch} onClose={() => setShowModal(false)} />}
    );
};

export default SearchHeader;