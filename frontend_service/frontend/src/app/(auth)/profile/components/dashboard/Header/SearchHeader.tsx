import React, { useState } from 'react';
import styled from 'styled-components';
import SearchModal from './SearchModal';
import { BsSearch } from "react-icons/bs";


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
    group: boolean;
    groupMembers?: string[];
}

interface SearchHeaderProps {
    onSearch : (query: string) => void;
    onClose: () => void;
    searchUsers: SearchU[];
}


const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, onClose, searchUsers}) => {
    const [query, setQuery] = useState('');
    const [ShowModal, setShowModal] = useState(false);
    
    const handleSearch = (e: React.FormEvent) => {
        setShowModal(true);
    };
    
    return (
        <>
        <SearchHeaderContainer onClick={handleSearch}>
            <SearchIcon />
        </SearchHeaderContainer>
        {ShowModal ? (
            <SearchModal onSearch={onSearch} onClose={() => setShowModal(false)} searchUsers={searchUsers}/>
        ) : null}
        </>
        // {showModal && <SearchModal onSearch={onSearch} onClose={() => setShowModal(false)} />}
    );
};

export default SearchHeader;