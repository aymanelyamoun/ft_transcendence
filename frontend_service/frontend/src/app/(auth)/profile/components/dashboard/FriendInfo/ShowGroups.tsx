import React, { useEffect, useRef, useState } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';
import { Backend_URL } from '@/lib/Constants';
import { AddSearchInterface, SearchU } from '../interfaces';
import GroupComponent from '../Header/GroupComponent';

import { connect, useSelector } from 'react-redux';
import { toggleShowGroups } from '@/features/booleans/booleanActions';
import { setSelectedUserId } from '@/features/strings/stringActions';
import { GiAstronautHelmet } from 'react-icons/gi';
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

const ShowGroupsList = styled.div`
flex: 1;
display: flex;
flex-direction: column;
border-top-left-radius: 10px;
width: 100%;
height: 100%;
overflow-y: auto;
justify-content: flex-start;
align-items: center;

  // @media (max-height: 1100px) and (min-height: 700px)
  // {

  // }
  // @media (max-width: 550px)
  // {

  // }
`;

const ShowGroupsContainer = styled.div`
  background: rgba(154, 155, 211, 0.2);
  display: flex;
  align-items: center;
  width: 85%;
  // width: 100%;
  heigh: 120px;
  padding: 6px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(154, 155, 211, 0.2);
  margin: 15px 10px;
  border-radius: 15px;
`;

const NoGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 15vh;
  color: #fff;
`;

const NoGroupIcon = styled.div`
  font-size: 11vh;
  color: #fff;
`;

const NoGroupSpan = styled.span`
font-size: 3vh;
`;

interface showGroupProps
{
  onClose: () => void;
  parentType: string;
  showGroups: boolean;
  toggleShowGroups: () => void;
}

const ShowGroups = (props : showGroupProps) => {
  const parentType = props.parentType;
  const onClose = props.onClose;
  const { showGroups, toggleShowGroups} = props;
  const [isLoading, setisLoading] = useState(false);
  const [ChannelFriendSearch, setChannelFriendSearch] = useState<AddSearchInterface[]>([]);
  const [ShowGroups, setShowGroups] = useState(true);
  const showRef = useRef<HTMLDivElement>(null);
  const selectedUserId = useSelector((state: RootState) => state.strings.selectedUserId)

  const fetchChannelGroups = async () => {
    try {
      const res = await fetch( Backend_URL+"channels/toAddSearch", {
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
  }, [ChannelFriendSearch]);

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
  }, [onClose]);

  function isUserMember(members: { user: { profilePic: string, id: string}}[], userId: string)
  {
    if (members)
      return (members.some(member => member.user.id === userId));
  };

  // const isMember = isUserMember(, selectedUserId);

  // useEffect(() => {
  //   console.log("Heeeere is member: ", isMember);
  // })


  return (
    <div onClick={handleClickOutside} className="addChannelOverlay flex justify-center items-center ">
      <div ref={showRef} className={styles['info-container']}>
        <ShowGroupsList>
          {ChannelFriendSearch.length ? (
          ChannelFriendSearch.map((friend) => {
            return (
              <>
                {!isUserMember(friend.members, selectedUserId) ? (
              <ShowGroupsContainer>
              <GroupComponent
                key={friend.id}
                id={friend.id} 
                channelName={friend.channelName}
                channelPic={friend.channelPic}
                channelType={friend.channelType}
                // members={friend.members}
                members={friend.members}
                bannedUsers={friend.bannedUsers || []}
                setChannelFriendSearch={setChannelFriendSearch}
                ShowGroups={ShowGroups}
                setChannelFriendSearchU={function (value: React.SetStateAction<SearchU[]>): void {
                  throw new Error('Function not implemented.')
                } }/>
                </ShowGroupsContainer>
                ) : null}
                {/* idea hna hiya ndir chi number variable and it will keep incrementing and when it gets to the
                ChannelFriendSearch.length it will sho the `No available groups` */}
                </>
            );
          })
          ) : (
            <NoGroupsContainer>
              <NoGroupIcon>
                <GiAstronautHelmet />
              </NoGroupIcon>
              <NoGroupSpan>No Available groups</NoGroupSpan>
            </NoGroupsContainer>
          )
        }
        </ShowGroupsList>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    showGroups: state.booleans.showGroups,
  };
};

const mapDispatchToProps = {
  toggleShowGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowGroups);
