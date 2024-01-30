import React, { use, useContext } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { setGoBackContext } from './conversationInfo';

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
    // const setGoBack = useContext(setGoBackContext);

      const handleAddChannelClick = () => {
        setShowAddChannel(true);

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