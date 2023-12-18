import React from 'react'

export const alertMessage = ({message , type} : {message:string, type:string}) => {

  return (
    <div className=" createChannelOverlay flex justify-center items-center ">
         <div id="AddchannelContainer" className="addChannelModal felx justify-between rounded-[10px] "

        </div>
        {type === "error" ? <p> hello</p>: <p>by</p> }

    </div>

  )
}
