import React, { useEffect, useState } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { Backend_URL } from '@/lib/Constants';
import { SearchU } from '../interfaces';
import GroupComponent from '../Header/GroupComponent';

// const ShowGroupsContainer = styled.div`
// background: rgba(154, 155, 211, 0.2);
// display: flex;
// align-items: center;
// width: 90%;
// // width: 100%;
// padding: 6px 10px;
// box-sizing: border-box;
// border-bottom: 1px solid rgba(154, 155, 211, 0.2);
// margin: 15px 10px;
// border-radius: 15px;
// `;

const ShowGroupsRoot = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-evenly;
`;

const ShowGroups = React.forwardRef<HTMLDivElement>((props, ref) => {
  const [isLoading, setisLoading] = useState(false);
  const [ChannelFriendSearch, setChannelFriendSearch] = useState<SearchU[]>([]);
  const [ShowGroups, setShowGroups] = useState(true);

  const fetchChannelGroups = async () => {
    try {
      const res = await fetch( Backend_URL+"channels/search/all", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("requested search channels : ",data);
        setChannelFriendSearch(data);
      } else
      {
        alert("Error fetching data: ");
        console.error("Error fetching data: ", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchChannelGroups();
    console.log("ChannelFriendSearch : ", ChannelFriendSearch);
  }, []);

  return (
    <div className="addChannelGroups flex justify-center items-center">
      <div ref={ref} className={styles['info-container']}>
        <ShowGroupsRoot>
        {/* <ShowGroupsContainer> */}
          {ChannelFriendSearch.map((friend) => {
            return (
              <GroupComponent
                key={friend.id}
                id={friend.id} 
                channelName={friend.channelName}
                channelPic={friend.channelPic}
                members={friend.members}  
                setChannelFriendSearch={setChannelFriendSearch}
                ShowGroups={ShowGroups}
              />
            );
          })}
        {/* </ShowGroupsContainer> */}
        </ShowGroupsRoot>
      </div>
    </div>
  );
});
  
  export default ShowGroups;