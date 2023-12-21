"use client";
import React from "react";
import { useState, ChangeEvent } from "react";
import { NextPage } from "next";
// import { Friend, friendsData } from '../../../../app/(notRoot)/page';
// import { Friend, friendsData } from '../page';
import { Channel, channelsData } from "../page";
import { ConversationIthemProps } from "../../../../../../../backend_service/backend/types/chatTypes";
// import { Friend, friendsData } from '../../../app/(notRoot)/chat/page';
// import { Channel, channelsData } from '../../../app/(notRoot)/chat/page';
// import { Friend, friendsData } from '../../../../app/(notRoot)/chat/page';
// import { Channel, channelsData } from '../../../../app/(notRoot)/chat/page';

// interface FriendListProps {
//   friendSearch: Friend[];
//   setFriendSearch: React.Dispatch<React.SetStateAction<Friend[]>>;
//   channelSearch: Channel[];
//   setChannelSearch: React.Dispatch<React.SetStateAction<Channel[]>>;
// }

// const SearchBar  = ({ friendSearch, setFriendSearch, channelSearch, setChannelSearch } : FriendListProps) => {

// const SearchBar = ({
//   rowData,
// }: // conversation,
// // setConversation,
// {
//   rowData: ConversationIthemProps[];
//   // conversation: Conversation[];
//   // setConversation: React.Dispatch<React.SetStateAction<Conversation[]>>;
// }) => {
//   const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
//   const [searchText, setSearchText] = useState<string>("");

//   const handleSearchBarFocus = () => {
//     setIsSearchBarFocused(true);
//   };

//   const handleSearchBarBlur = () => {
//     setIsSearchBarFocused(false);
//     if (searchText.trim() === "") {
//       setSearchText("");
//     }
//   };

//   // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//   //   const filteredFriends = conversation.filter((conv) => {
//   //     return conv.name.toLowerCase().startsWith(e.target.value.toLowerCase());
//   //   });

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const filteredFriends = rowData.filter((conv) => {
//       return conv.name.toLowerCase().startsWith(e.target.value.toLowerCase());
//     });

//     setSearchText(e.target.value);

//     // const filteredChannels = conversation.filter((channel) => {
//     //   return conversation.channelName.toLowerCase().startsWith(e.target.value.toLowerCase());
//     // });
//     console.log(filteredFriends);
//     if (e.target.value === "") setConversation(rowData);
//     else setConversation(filteredFriends);
//     // setConversation(filteredChannels);
//   };

//   return (
//     <div className="searchBarContainer">
//       <input
//         type="text"
//         className={`searchBar ${
//           isSearchBarFocused || searchText ? "searchBarFocused" : ""
//         }`}
//         onFocus={handleSearchBarFocus}
//         onBlur={handleSearchBarBlur}
//         value={searchText}
//         onChange={handleInputChange}
//       />
//     </div>
//   );
// };
// export default SearchBar;
