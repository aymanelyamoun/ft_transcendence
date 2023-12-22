import React from "react";
import { useEffect, useState, useRef } from "react";

import chooseFriendIcon from "../../../../public/chooseFriendIcon.png";
import notchoosenFriendIcon from "../../../../public/notChoosenFriendIcon.png";
import removeFriends from "../../../../public/removeFriends_Icon.png";
// import { Friend, friendsData } from "../../../app/(notRoot)/chat/page";
import { Friend, friendsData } from "../page";

// import chooseFriendIcon from "../../../../public/chooseFriendIcon.png";
// import notchoosenFriendIcon from "../../../../public/notChoosenFriendIcon.png";
// import removeFriends from "../../../../public/removeFriends_Icon.png";
// import { Friend, friendsData } from "../../../../app/(notRoot)/chat/page";

import Image from "next/image";
import channleImage from "../../../../../public/group_pic.jpg";
import passwordParameter from "../../../../../public/passwordParameterIcon.png";
// import channleImage from "../../../../public/group_pic.jpg";
// import passwordParameter from "../../../../public/passwordParameterIcon.png";

import AddChannelSearchBar from "./AddChannelSearchBar";
import { AlertMessage } from "./alertMessage";

const CreateChannel = () => {
  const [password, setPassword] = useState<boolean>(false);
  const [allowTyping, setAllowTyping] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("public");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showNotify, setShowNotify] = useState<boolean>(false);
  


  const handleOptionChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement;
    setPasswordMatch(event.target.value === confirmPasswordInput.value);
  };
  
  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    setPasswordMatch(event.target.value === passwordInput.value);
  };

  const handleCreateButton = () => {
    if (!passwordMatch) {
      setShowAlert(true);
    }
    else {
      setShowNotify(true);
    }
  }

  return (
    <div className=" createChannelOverlay flex justify-center items-center ">
      <div
        id="AddchannelContainer"
        className="addChannelModal felx justify-between rounded-[10px] "
      >
        <div className=" px-24 pt-4">
          <div className="scrollbar flex flex-col items-center rounded-t-[10px] h-[531px] overflow-y-auto ">
            <div>
              <Image
                className="channelImage"
                src={channleImage}
                alt={"channelImage"}
              />
            </div>
            <div className="">
              <input
                className="channelName  placeholder-[#545781]"
                type="text"
                placeholder="Channel Name"
              />
            </div>
            <div className="">
              <select value={selectedOption} onChange={handleOptionChange} className="channelType">
                <option value="public">public</option>
                <option value="private">private</option>
                <option value="protected">protected</option>
              </select>
            </div>
            { selectedOption === 'protected' &&

                (!password ? (
                  <div className="passWord relative">
                    password
                    <div
                      onClick={() => setPassword(true)}
                      className="passwordParameter absolute right-[3%] top-[18%]"
                    >
                      <Image src={passwordParameter} alt="password" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="fixPasswordBg">
                      <div className="setPassWord relative">
                        password
                        <div
                          onClick={() => {setPassword(false); setAllowTyping(false) }}
                          className="passwordParameter absolute right-[3%] top-[18%]"
                        >
                          <Image src={passwordParameter} alt="password" />
                        </div>
                      </div>
                    </div>
                    <div className={`typePassword ${(!allowTyping || selectedOption !== 'protected') ? 'h-[55px]' : 'h-[215px]'}`}>
                      <div className="flex justify-between">
                        <p className="requiredPasswordText items-end">
                          {" "}
                          required password
                        </p>
                        <div className="mt-[15px] mr-[10px]">
                          <label className="relative inline-flex items-center mb-5 cursor-pointer">
                            <input
                              type="checkbox"
                              value=""
                              className="sr-only peer"
                            />
                            <div
                              onClick={() => setAllowTyping(!allowTyping)}
                              className="w-9 h-5 bg-green-200 peer-focus:outline-none
                                      rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                      peer-checked:after:border-[#c2ff86] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
                                        after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#c2ff86]"
                            ></div>
                          </label>
                        </div>
                      </div>
                      { (allowTyping && selectedOption === 'protected')  && 
                        <>
                          <div>
                            <div>
                              <p className="password">password</p>
                            </div>
                            <input
                              className="passwordInput pl-[12px]"
                              type="password"
                              id="password"
                              onChange={handlePasswordChange}
                            />
                          </div>
                          <div>
                            <div>
                              <p className="password mt-[15px]">confirm password</p>
                            </div>
                            <input
                              className="passwordInput pl-[12px]"
                              type="password"
                              id="confirmPassword"
                              onChange={handleConfirmPasswordChange}
                            />
                          </div>
                        </>
                      }
                      {showAlert && (<AlertMessage onClick={() => setShowAlert(false)} message={"The Password Confirmation Does Not Match"} type={"error"}> </AlertMessage>)}
                      {showNotify && (<AlertMessage onClick={() => setShowNotify(false)} message={"Channel Has Been Created Successfully"} type={'notify'}> </AlertMessage>)}
                    </div>
                  </div>
                  )
            )
            }
          </div>
        </div>
        <button onClick={handleCreateButton} className="next w-[526px] h-[73px] bg-[#9A9BD3] rounded-b-[10px]">
          CREATE
        </button>
      </div>
    </div>
  );
};
export default CreateChannel;
