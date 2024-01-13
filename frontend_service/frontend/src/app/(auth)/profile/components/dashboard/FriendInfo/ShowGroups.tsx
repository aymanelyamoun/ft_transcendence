import React, { useEffect, useRef, useState } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { Backend_URL } from '@/lib/Constants';
import { SearchU } from '../interfaces';
import GroupComponent from '../Header/GroupComponent';

import { connect } from 'react-redux'
import { toggleShowGroups } from '@/features/booleans/booleanActions';
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

interface showGroupProps
{
  onClose: () => void;
  showGroups: boolean;
  toggleShowGroups: () => void;
}

const ShowGroups = React.forwardRef<HTMLDivElement, showGroupProps>((props) => {
  const onClose = props.onClose;
  const { showGroups, toggleShowGroups} = props;
  const [isLoading, setisLoading] = useState(false);
  const [ChannelFriendSearch, setChannelFriendSearch] = useState<SearchU[]>([]);
  const [ShowGroups, setShowGroups] = useState(true);
  const showRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const handleClickOutside = (event: any) => {
    if (showRef.current && !showRef.current.contains(event.target as Node))
    {
      onClose();
      toggleShowGroups();
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]) 

  return (
    <div onClick={handleClickOutside} className="addChannelOverlay flex justify-center items-center ">
      <div ref={showRef} className={styles['info-container']}>
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

const mapStateToProps = (state: RootState) => {
  return {
    ShowGroups: state.booleans.showGroups,
  };
};

const mapDispatchToProps = {
  toggleShowGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowGroups);