import React from 'react'

<<<<<<< HEAD
export const AlertMessage = ({message , type, children} : {message:string, type:string , children:React.ReactNode}) => {

  return (
    <div className=" alertOverlay flex justify-center items-center ">
      <div className="alertModal felx justify-between rounded-[10px] ">
        <div className=" px-[55px] py-[65px]">
          <div className=" relative flex flex-col rounded-t-[10px] h-[250px] ">
            <div className='flex justify-center items-center'>
              <p className={`alertMessage font-poppins font-light ${type !== 'notify' ? "text-[#FC2B5D]" : "text-[#FEFFFF]"} text-xl leading-normal not-italic`}>{message}</p>
                <div className=' absolute top-[79%] '>
                      {type === 'error' ? (
                          <button className= "alertDismiss relative buttom-[10%] text-[#FC2B5D]">
                            <p className="font-poppins font-semibold"> Dismiss </p> 
                          </button> 
                          ) : type === 'exit' ? (
                          children
                     ) : type === 'delete' ? (
                      children
                     ) : type === 'confirm' ? (
                      children 
                     ) : type === 'notify' ? (
                      children
                     ) : null
                    }
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  )
}
=======
export const alertMessage = ({message , type} : {message:string, type:string}) => {

  return (
    <div className=" createChannelOverlay flex justify-center items-center ">
         <div id="AddchannelContainer" className="addChannelModal felx justify-between rounded-[10px] "

        </div>
        {type === "error" ? <p> hello</p>: <p>by</p> }

    </div>

  )
}
>>>>>>> chat_game
