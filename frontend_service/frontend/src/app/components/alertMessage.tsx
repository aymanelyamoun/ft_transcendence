import React from 'react'
import { FaRunning } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'



const CostumeButton = ({
    onClick,
    bgColor,
    color,
    children,
    width,
    hight,
  } : {
    onClick: () => void
    bgColor: string;
    color: string;
    width: string;
    hight: string;
    children: React.ReactNode;
  }) => {
    return (
      <button
        onClick={onClick} className={`flex items-center justify-around ${bgColor} text-[${color}] p-2 ${width} ${hight} rounded-sm border-2`}
      >
        {children}
      </button>
    );
  };


export const AlertMessage = ({onClick , message , type, children} : { onClick: () => void ,  message:string, type:string , children?:React.ReactNode}) => {
    return (
      <div className=" alertOverlay flex justify-center items-center ">
        <div className="alertModal felx justify-between rounded-[10px] ">
          <div className=" px-[55px] py-[65px]">
            <div className=" relative flex flex-col rounded-t-[10px] h-[250px] ">
              <div className='flex justify-center items-center'>
                <p className={`alertMessage font-poppins font-light ${type !== 'notify' ? "text-[#FC2B5D]" : "text-[#FEFFFF]"} text-xl leading-normal not-italic`}>{message}</p>
                  <div className=' absolute top-[79%] '>
                        {type === 'error' ? (
                            <button onClick={onClick} className= "alertDismiss relative buttom-[10%] text-[#FC2B5D]">
                              <p className="font-poppins font-semibold"> Dismiss </p> 
                            </button> 
                            ) : type === 'exit' ? (
                              <CostumeButton
                              onClick={onClick}
                              bgColor="bg-transparent border-[#FC2B5D]"
                              color="#FC2B5D"
                              width="w-[186px]"
                              hight="h-11"
                            >
                              <p className=" text-light-red font-semibold font-poppins text-sm">
                                Exit Channel
                              </p>
                              <FaRunning color="#FC2B5D" size={24} />
                            </CostumeButton> 
                       ) : type === 'delete' ? (
                        
                        <CostumeButton
                        onClick={onClick}
                        bgColor="bg-[#FC2B5D] border-[#FC2B5D]"
                        color="#FC2B5D"
                        width="w-[186px]"
                        hight="h-11"
                        >
                        <p className=" text-[#FEFFFF] font-poppins font-medium text-sm">
                          Delete channel
                        </p>
                        <MdDelete color="#FEFFFF" size={24} />
                        </CostumeButton>
  
                       ) : type === 'confirm' ? (
                        children 
                       ) : type === 'notify' ? (
                        <CostumeButton
                          onClick={onClick}
                          bgColor="bg-[#FEFFFF] border-[#FEFFFF]"
                          color="#FC2B5D"
                          width="w-[186px]"
                          hight="h-11"
                        >
                          <p className=" text-[#0D1130] font-semibold font-poppins text-sm">
                            OK
                          </p>
                        </CostumeButton>
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