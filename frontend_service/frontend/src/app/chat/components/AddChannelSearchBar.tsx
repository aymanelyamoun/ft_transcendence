import React from 'react'
import Image from 'next/image'
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Friend, friendsData} from '../page';
// import searchBarInAddChannel from "../../../public/iconSearchInAddChannel.png";
import searchBarInAddChannel from "../../../../public/iconSearchInAddChannel.png";
// import { Friend, friendsData} from '../../../../app/(notRoot)/chat/page';
// import searchBarInAddChannel from "../../../../public/iconSearchInAddChannel.png";
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  top: 2vh;
  right: 13vw;
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

const AddChannelSearchBar = ({addChannelSearch, setAddChannelSearch,setChannelFriendSearch}: FriendListProps) => {

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

//   return ( 
//       <div className='ml-auto flex items-center' ref={SearchIcon}>
//         <div   onClick={() => setAddChannelSearch(true)}   className={` ${addChannelSearch ? 'hidden': ''} mr-[12px]`}>
//             <Image  className='addChannelSearchIcon flex items-end' src={searchBarInAddChannel} alt="searchBar"  width={22} height={22} ></Image>
//         </div> 
//         { addChannelSearch &&

//            <div className="m-[10px] flex ml-auto z-1000">
//               <input type="text" className="seachBarAddChannel flex " 
//              value={searchText}
//              onChange={handleInputChange}
//              />
//             </div>
//         }
//       </div>
//   )
// }

return ( 
  <div className='ml-auto flex items-center' ref={SearchIcon}>
       <SearchContainer>
          <input type="text" className="seachBarAddChannel flex " 
         value={searchText}
         onChange={handleInputChange}
         />
        </SearchContainer>
  </div>
)
}

export default AddChannelSearchBar