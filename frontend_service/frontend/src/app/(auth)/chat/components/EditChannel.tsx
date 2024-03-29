import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import channleImage from "../../../../../public/group_pic.jpg";
import { AlertMessage } from "./alertMessage";
import passwordParameter from "../../../../../public/passwordParameterIcon.png";
import {
  ConversationListContext,
  LstConversationSetStateContext,
  LstConversationStateContext,
} from "./conversationInfo";
import channelPic from "../../../../../public/group_pic.jpg";
import ProfilePicUpload from "@/app/components/ProfilePicUpload";
import { Backend_URL } from "@/lib/Constants";
import { ConversationIthemProps } from "@/utils/types/chatTypes";
import { useRouter } from "next/router";

interface channelInfos {
  id: number;
  channelName: string;
  channelPic: string;
  type: string;
  password: string;
  creator: string;
  members: string[];
  admines: string[];
}

const EditChannel = ({
  setEditChannel,
  setRefresh,
}: {
  setEditChannel: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [saveChannelName, setSaveChannelName] = useState<string>("");
  // selectedOption need to be intialized with the channel type by fetching it from the backend
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [channelName, setChannelName] = useState<boolean>(false);
  const setConversationList = useContext(LstConversationSetStateContext);

  const [savePassword, setSavePassword] = useState<string>("");
  const [password, setPassword] = useState<boolean>(false);
  const [allowTyping, setAllowTyping] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [notCreated, setNotCreated] = useState<boolean>(false);
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [useChannelPic, setUseChannelPic] = useState<string>("");

  const conversationProps = useContext(LstConversationStateContext);
  const lastConversation = useContext(LstConversationStateContext);
  const lastConvId = lastConversation?.id;

  const cancelEditChannel = useRef<HTMLDivElement>(null);

  const [conversationInfo, setConversationInfo] = useState<channelInfos | null>(
    null
  );

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
  const router = useRouter();
  useEffect(() => {
    const channelId = conversationProps?.channelId;
    // here i should fetch the channelName and channelPic and channelType and else ... from the backend
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL+`channels/channelInfos/${channelId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        if (!res.ok) {

          throw new Error(`${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setSaveChannelName(data.channelName);
          setSelectedOption(data.channelType);
          setUseChannelPic(data.channelPic);
        }
      })
      .catch((error) => {
        if (error.message.includes("403") || error.message.includes("404")) router.push("/unauthorized");
      });
  }, [conversationProps?.channelId]);

  const handleEditButton = () => {
    if (passwordMatch && saveChannelName !== "") {
      setShowNotify(true);
    }
    if (!passwordMatch) {
      setShowAlert(true);
    }

    if (saveChannelName === "") {
      setChannelName(true);
    }

    const channelData = {
      channelName: saveChannelName,
      channelPic: useChannelPic,
      password: savePassword,
      type: selectedOption,
      channelId: conversationProps?.channelId,
    };

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/editChannel", {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(channelData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        } else {
          setRefresh((prev) => !prev);
          const newName = channelData.channelName;
          setConversationList(
            (prevConversation: ConversationIthemProps | undefined) => {
              if (prevConversation && prevConversation.id === lastConvId) {
                return {
                  ...prevConversation,
                  name: newName,
                };
              }
              return prevConversation;
            }
          );
        }
      })
      .catch((error) => {

      });
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
        const resCLoud = await fetch( process.env.NEXT_PUBLIC_CLOUD_API as string,
          {
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

  const handleCancelAddChannel = (event: any) => {
    if (
      cancelEditChannel.current &&
      !cancelEditChannel.current.contains(event.target)
    ) {
      setEditChannel(false);
    }
  };

  return (
    <div
      onClick={handleCancelAddChannel}
      className=" editChannelOverlay flex justify-center items-center "
    >
      <div
        className="editChannelModal felx justify-between rounded-[10px] "
        ref={cancelEditChannel}
      >
        <div className=" px-4 pt-4">
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
                setEditChannel(false);
              }}
              message={"Channel Has Been Edited Successfully"}
              type={"notify"}
            >
              {" "}
            </AlertMessage>
          )}
          {notCreated && (
            <AlertMessage
              onClick={() => {
                setNotCreated(false);
                setEditChannel(false);
              }}
              message={"Channel Not Edited"}
              type={"error"}
            >
              {" "}
            </AlertMessage>
          )}
          <div className="scrollbar flex flex-col items-center rounded-t-[10px] h-[531px] overflow-y-auto ">
            <div>
               <ProfilePicUpload
              profilePic={useChannelPic}
              handlePicUpdate={handlePicUpdate}
            />
            </div>
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
                    {allowTyping && selectedOption === "protected" && (
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
          onClick={handleEditButton}
          className="next w-[526px] h-[73px] bg-[#9A9BD3] rounded-b-[10px]"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default EditChannel;
