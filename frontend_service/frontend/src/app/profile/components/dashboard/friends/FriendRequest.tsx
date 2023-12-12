import React from 'react';
import styles from './friends.module.css';
import FriendRequestItem from './FriendRequestItem';

interface FriendRequest {
  id: string;
  name: string;
  picture: string;
}

interface FriendRequestProps {
  friendRequests: FriendRequest[];
  acceptRequest: (id: string) => void;
  refuseRequest: (id: string) => void;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ friendRequests, acceptRequest, refuseRequest }) => {
  return (
    <div className={styles['friendRequest']}>
      <ul>
        {friendRequests.map((friendRequest) => (
          <FriendRequestItem
            key={friendRequest.id}
            id={friendRequest.id}
            name={friendRequest.name}
            picture={friendRequest.picture}
            acceptRequest={acceptRequest}
            refuseRequest={refuseRequest}
          />
        ))}
      </ul>
    </div>
  );
}

export default FriendRequest;