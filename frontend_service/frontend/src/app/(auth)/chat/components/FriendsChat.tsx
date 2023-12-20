import React from 'react'
import splitBar from '../../../public/splitBar.png'
// import splitBar from '../../../../public/splitBar.png'
import Image, { StaticImageData } from 'next/image'
import { NextPage } from 'next';
import msg from '../../../../public/msg_icon.png'
import msgs from '../../../../public/msgs_icons.png'
import msg2 from '../../../../public/msg2_icon.png'
import msgs2 from '../../../../public/msgs2_icons.png'
// import msg from '../../../../public/msg_icon.png'
// import msgs from '../../../../public/msgs_icons.png'
// import msg2 from '../../../../public/msg2_icon.png'
// import msgs2 from '../../../../public/msgs2_icons.png'
import { useState } from 'react';
// import { Friend, friendsData} from '../page';
// import { Friend, friendsData} from '../../../../app/(notRoot)/chat/page';


interface FriendsChatProps {
  onClickFriendsChat: () => void;
  activeState: React.MutableRefObject<'friend' | 'channel'>;
  setFriendsChatIcon: React.Dispatch<React.SetStateAction<StaticImageData>>;
  setChannelChatIcon: React.Dispatch<React.SetStateAction<StaticImageData>>;
  friendsChatIcon: StaticImageData;
}


const FriendsChat = ({onClickFriendsChat, activeState, setFriendsChatIcon, friendsChatIcon, setChannelChatIcon} : FriendsChatProps) => {
  

  const toggleImageImage = () => {
    onClickFriendsChat();
    console.log(activeState.current);
    if (activeState.current === 'friend')
    {
      setChannelChatIcon(msgs2);
      setFriendsChatIcon(msg); 
    }
    else
    {
      setChannelChatIcon(msgs);
      setFriendsChatIcon(msg2);
    }
  };
  return (
    <div>
     <button className='mr-[10px] mt-[9px]' onClick={toggleImageImage}>
            <Image src={friendsChatIcon} alt='msg' width={24} height={24}/>
    </button>
    </div>
  )
}

export default FriendsChat