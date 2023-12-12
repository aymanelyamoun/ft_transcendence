"use client"
import React from 'react'
import { useState, ChangeEvent} from 'react';
import { NextPage } from 'next';
// import { Friend, friendsData } from '../../../../app/(notRoot)/page';
import { Friend, friendsData } from '../page';
import { Channel, channelsData } from '../page';
// import { Friend, friendsData } from '../../../app/(notRoot)/chat/page';
// import { Channel, channelsData } from '../../../app/(notRoot)/chat/page';
// import { Friend, friendsData } from '../../../../app/(notRoot)/chat/page';
// import { Channel, channelsData } from '../../../../app/(notRoot)/chat/page';

interface FriendListProps {
  friendSearch: Friend[];
  setFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
  channelSearch: Channel[];
  setChannelSearch: React.Dispatch<React.SetStateAction<Channel[]>>;
}

const SearchBar  = ({ friendSearch, setFriendSearch, channelSearch, setChannelSearch } : FriendListProps) => {

    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
    const [searchText, setSearchText] = useState<string>('');

    const handleSearchBarFocus = () => {
      setIsSearchBarFocused(true);
    };
  
    const handleSearchBarBlur = () => {
      setIsSearchBarFocused(false);
      if (searchText.trim() === '') {
        setSearchText('');
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {

      const filteredFriends = friendsData.filter((friend) => {
        return friend.name.toLowerCase().startsWith(e.target.value.toLowerCase());
      });

      const filteredChannels = channelsData.filter((channel) => {
        return channel.channelName.toLowerCase().startsWith(e.target.value.toLowerCase());
      });

      setSearchText(e.target.value);
      setFriendSearch(filteredFriends);
      setChannelSearch(filteredChannels);
    };

  return (
    <div>
        <input type='text' className={`searchBar ${isSearchBarFocused || searchText ? 'searchBarFocused' : ''}`} 
        onFocus={handleSearchBarFocus}
        onBlur={handleSearchBarBlur}
        value={searchText}
        onChange={handleInputChange}
        />
    </div>
  )
}

export default SearchBar