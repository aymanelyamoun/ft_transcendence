import React from 'react'
import msgs from '../../../../../public/msgs_icons.png'
import msgs2 from '../../../../../public/msgs2_icons.png'
import msg from '../../../../../public/msg_icon.png'
import msg2 from '../../../../../public/msg2_icon.png'
// import msgs from '../../../../public/msgs_icons.png'
// import msgs2 from '../../../../public/msgs2_icons.png'
// import msg from '../../../../public/msg_icon.png'
// import msg2 from '../../../../public/msg2_icon.png'
import Image, { StaticImageData } from 'next/image'
// import { Channel, channelsData} from '../../../../app/(notRoot)/chat/page';
import { Channel,} from '../page';
import { useState } from 'react';

interface ChannelChatProps {
  onClickChannelsChat: () => void;
  activeState: React.MutableRefObject<'friend' | 'channel'>;
  setChannelChatIcon: React.Dispatch<React.SetStateAction<StaticImageData>>;
  setFriendsChatIcon: React.Dispatch<React.SetStateAction<StaticImageData>>;
  channelChatIcon: StaticImageData;
}

const ChannelChat = ({onClickChannelsChat, activeState, setChannelChatIcon, channelChatIcon, setFriendsChatIcon}: ChannelChatProps) => {


  const toggleImageIcon = () => {
    onClickChannelsChat();
    if (activeState.current === 'channel')
    {
      setChannelChatIcon(msgs); 
      setFriendsChatIcon(msg2);
    }
    else
    {
      setChannelChatIcon(msgs2);
      setFriendsChatIcon(msg);
    }
  };
  return (
    <div>
        <button className='ml-[10px] mt-[9px]' onClick={toggleImageIcon}>
            <Image src={channelChatIcon} alt='msg' width={30} height={30}/>
        </button>
    </div>
  )
}

export default ChannelChat