import React, { useContext } from "react";
import { useEffect, useState, useRef } from "react";

import chooseFriendIcon from "../../../../public/chooseFriendIcon.png";
import notchoosenFriendIcon from "../../../../public/notChoosenFriendIcon.png";
import removeFriends from "../../../../public/removeFriends_Icon.png";
// import { Friend, friendsData } from "../../../app/(notRoot)/chat/page";
import { Friend } from "../page";

// import chooseFriendIcon from "../../../../public/chooseFriendIcon.png";
// import notchoosenFriendIcon from "../../../../public/notChoosenFriendIcon.png";
// import removeFriends from "../../../../public/removeFriends_Icon.png";
// import { Friend, friendsData } from "../../../../app/(notRoot)/chat/page";

import Image from "next/image";
import channleImage from "../../../../../public/group_pic.jpg";
import passwordParameter from "../../../../../public/passwordParameterIcon.png";
import channelPic from "../../../../../public/group_pic.jpg";
// import channleImage from "../../../../public/group_pic.jpg";
// import passwordParameter from "../../../../public/passwordParameterIcon.png";

import { AlertMessage } from "./alertMessage";

import { UserContext } from "@/utils/createContext";
import ProfilePicUpload from "@/app/components/ProfilePicUpload";
import { Backend_URL } from "@/lib/Constants";
import { setGoBackContext } from "./conversationInfo";
// import { act } from "react-dom/test-utils";

const CreateChannel = ({
  selectedFriends,
  setSelectedFriends,
  setChannelCreated,
  setRefresh,
}: {
  selectedFriends: Friend[];
  setSelectedFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  setChannelCreated: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [saveChannelName, setSaveChannelName] = useState<string>("");
  const [channelName, setChannelName] = useState<boolean>(false);
  const [savePassword, setSavePassword] = useState<string>("");
  const [password, setPassword] = useState<boolean>(false);
  const [allowTyping, setAllowTyping] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("public");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [noPass, setNoPass] = useState<boolean>(false);
  const [notCreated, setNotCreated] = useState<boolean>(false);
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [useChannelPic, setUseChannelPic] = useState<string>(
    "https://i.imgur.com/GJvG1b.png"
  );
  const cancelCreateChannel = useRef<HTMLDivElement>(null);
  const creatorInfo = useContext(UserContext);
  const setGoBack = useContext(setGoBackContext);

  const handleCancelAddChannel = (event: any) => {
    if (
      cancelCreateChannel.current &&
      !cancelCreateChannel.current.contains(event.target)
    ) {
      setChannelCreated(false);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (saveChannelName === "") setChannelName(true);
    setSelectedOption(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordInput = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;
    setPasswordMatch(event.target.value === confirmPasswordInput.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    setPasswordMatch(event.target.value === passwordInput.value);
    setSavePassword(event.target.value);
  };

  const handleCreateButton = () => {
    if (passwordMatch && saveChannelName !== "") {
      setShowNotify(true);
    } else if (!passwordMatch) setShowAlert(true);

    if (saveChannelName === "") setChannelName(true);
    if (selectedOption === "protected" && savePassword === "") {
      setNoPass(true);
      setShowNotify(false);
      return;
    }

    const members = selectedFriends.map((friend) => ({
      userId: friend.id,
      isAdmin: false,
    }));

    const channelData = {
      channelName: saveChannelName,
      channelPic: useChannelPic,
      // channelPic: channelPic,
      // channelPic: need to put the actual link of the channel pic,
      password: savePassword,
      type: selectedOption,
      // creator: creatorInfo?.id,
      members: members,
      admines: [creatorInfo],
      // here i should add the selected friends
    };


    fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/createChannel", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(channelData),
    })
      .then((res) => {
        if (!res.ok) {
          setNotCreated(true);
          throw new Error("Network response was not ok");
        } else {
          setRefresh((prev) => !prev);
        }

      })
      .catch((error) => {
      });

    setSelectedFriends([]);
  };
  function getExtension(filename : string) {
    return filename.split('.').pop();
  }
  
  const handlePicUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let profilePic: any;
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = getExtension(file.name)?.toLowerCase();
      const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  
      if (!fileExtension || !allowedImageExtensions.includes(fileExtension)) {
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "imagesus");
        const resCLoud = await fetch( process.env.NEXT_PUBLIC_CLOUD_API as string ,{
            method: "POST",
            body: formData,
          }
        );
        if (resCLoud.ok) {
          const data1 = await resCLoud.json();
          if (data1 && data1.secure_url) {
            profilePic = data1.secure_url;
            setUseChannelPic(profilePic);
          }
        }
      } catch (error) {
      }
    }
  };

  return (
    <div
      onClick={handleCancelAddChannel}
      className=" createChannelOverlay flex justify-center items-center "
    >
      <div
        ref={cancelCreateChannel}
        className="addChannelModal felx justify-between rounded-[10px] "
      >
        <div className=" px-24 pt-4">
          <div className="scrollbar flex flex-col items-center rounded-t-[10px] h-[531px] overflow-y-auto ">
            {showAlert && (
              <AlertMessage
                onClick={() => setShowAlert(false)}
                message={"The Password Confirmation Does Not Match"}
                type={"error"}
              >
                {" "}
              </AlertMessage>
            )}
            {showNotify && (
              <AlertMessage
                onClick={() => {
                  setShowNotify(false);
                  setChannelCreated(false);
                }}
                message={"Channel Has Been Created Successfully"}
                type={"notify"}
              >
                {" "}
              </AlertMessage>
            )}
            {notCreated && (
              <AlertMessage
                onClick={() => {
                  setNotCreated(false);
                  setChannelCreated(false);
                }}
                message={"Channel Not Created"}
                type={"error"}
              >
                {" "}
              </AlertMessage>
            )}
            {noPass && (
              <AlertMessage
                onClick={() => setNoPass(false)}
                message={"Please Enter Password"}
                type={"error"}
              >
                {" "}
              </AlertMessage>
            )}
            <ProfilePicUpload
              profilePic={useChannelPic}
              handlePicUpdate={handlePicUpdate}
            />

            <div className="">
              <input
                className="channelName  placeholder-[#545781]"
                type="text"
                placeholder="Channel Name"
                onChange={(e) => setSaveChannelName(e.target.value)}
              />
            </div>
            <div>
              <select
                value={selectedOption}
                onChange={handleOptionChange}
                className="channelType"
              >
                <option value="public">public</option>
                <option value="private">private</option>
                <option value="protected">protected</option>
              </select>
            </div>
            {channelName && (
              <AlertMessage
                onClick={() => setChannelName(false)}
                message={"Please Enter Channel Name"}
                type={"error"}
              >
                {" "}
              </AlertMessage>
            )}
            {selectedOption === "protected" &&
              (!password ? (
                <div className="passWord relative">
                  <span className="ml-[10px]"> password </span>
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
                    <span className="ml-[10px]"> password </span>
                      <div
                        onClick={() => {
                          setPassword(false);
                          setAllowTyping(false);
                        }}
                        className="passwordParameter absolute right-[3%] top-[18%]"
                      >
                        <Image src={passwordParameter} alt="password" />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`typePassword ${
                      !allowTyping || selectedOption !== "protected"
                        ? "h-[55px]"
                        : "h-[215px]"
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="requiredPasswordText items-end">
                        show password input
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
                    {allowTyping && selectedOption === "protected" && (
                      <>
                        <div>
                          <div>
                            <p className="password"> password</p>
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
                            <p className="password mt-[15px]">
                              confirm password
                            </p>
                          </div>
                          <input
                            className="passwordInput pl-[12px]"
                            type="password"
                            id="confirmPassword"
                            onChange={handleConfirmPasswordChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <button
          onClick={handleCreateButton}
          className="next w-[526px] h-[73px] bg-[#9A9BD3] rounded-b-[10px]"
        >
          CREATE
        </button>
      </div>
    </div>
  );
};
export default CreateChannel;
