import React from 'react'
import Image from 'next/image'
import addFriend from '../../../../public/addFriendButton.png';

const AddFriend = () => {
  return (
    <div className='addFriendIconContainer cursor-pointer'>
        <Image className='addFriendIcon' width={30} height={30} src={addFriend} alt='addFriend'/>
    </div>
  )
}

export default AddFriend