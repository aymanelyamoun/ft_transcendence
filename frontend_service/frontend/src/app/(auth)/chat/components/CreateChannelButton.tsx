import React from 'react'
import { IoMdAddCircle } from 'react-icons/io'

const CreateChannelButton = ({
  setShowAddChannel,
  setRefresh,
  
}:{
  setShowAddChannel:React.Dispatch<React.SetStateAction<boolean>>,
  setRefresh:React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    const iconStyle = {
        width: "50px",
        height: "50px",
        bottom: "9%",
        right: "0",
      };

      const handleAddChannelClick = () => {
        setShowAddChannel(true);
        // console.log("add channel clicked: " + showAddChannel);
      };

  return (
    <div className=" sticky w-[50px] ml-auto bottom-[12.8px] cursor-pointer">
    <IoMdAddCircle
      style={iconStyle}
      onClick={handleAddChannelClick}
      color='#FEFFFF'
    />
  </div>
  )
}

export default CreateChannelButton