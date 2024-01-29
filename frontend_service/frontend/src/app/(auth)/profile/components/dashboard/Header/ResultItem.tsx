"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StaticImageData } from "next/image";
import FriendComponent from "./FriendComponent";
import GroupComponent from "./GroupComponent";
import { AddSearchInterface, SearchU } from "../interfaces";
import { ResultItemProps } from "../interfaces";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

const ItemContainer = styled.div<{ isMember: boolean }>`
  background: rgba(154, 155, 211, 0.2);
  // display: flex;
  display: ${(props) => (props.isMember ? "none" : "flex")};
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

const ResultItem: React.FC<ResultItemProps> = (props) => {
  const loggedInUserId = useSelector(
    (state: RootState) => state.strings.loggedInUserId
  );
  function isUserMember(
    members: { user: { profilePic: string; id: string } }[],
    userId: string
  ) {
    if (members) return members.some((member) => member.user.id === userId);
  }

  const isMember = isUserMember(props.members, loggedInUserId) as boolean;

  return (
    <ItemContainer isMember={isMember}>
      {props.group ? (
        !isMember ? (
          <GroupComponent
            key={props.id}
            id={props.id}
            channelName={props.channelName}
            channelPic={props.channelPic}
            channelType={props.channelType}
            members={props.members}
            setChannelFriendSearchU={props.setChannelFriendSearch}
            ShowGroups={false}
            banedUsers={[]}
            setChannelFriendSearch={function (
              value: React.SetStateAction<AddSearchInterface[]>
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        ) : null
      ) : (
        <FriendComponent
          key={props.id}
          id={props.id}
          username={props.username}
          profilePic={props.profilePic}
          isBlocked={props.isBlocked}
          setSearchUsers={props.setSearchUsers}
        />
      )}
    </ItemContainer>
  );
};

// export default ResultItem;

export default connect((state: RootState) => ({
  loggedInUserId: state.strings.loggedInUserId,
}))(ResultItem);
