"use client";
import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import styled from 'styled-components';
import { IoSearch } from "react-icons/io5";

interface SearchBarState {
  searchTerm: string;
}

// const SearchIcon = styled.div`
// position: absolute;
// top: 23vh;
// left: 24.37vw;
// z-index: 999;

//   svg {
//     font-size: 2rem;
//     color: Black;
//   }

//   focus: {
//     color: black;
//     cursor: pointer;
//     z-index: -1;
// `;

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Implement search functionality using the searchTerm
  };


  return (
    <>
      {/* <SearchIcon> */}
        {/* <IoSearch /> */}
      {/* </SearchIcon> */}
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <div className={styles.searchBoxContainer}>
        <input
          id="search-box"
          type="text"
          className={styles.searchBox}
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
          <span className={styles.searchIconContainer}>
            Search
          </span>
      </div>
      {/* <button type="submit" id="search-submit">Search</button> */}
    </form>
        </>
  );
};

export default SearchBar;